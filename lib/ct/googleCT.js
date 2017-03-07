"use strict";

let googleCT = function() {},
	util = require("util"),
	Promise = require("bluebird"),
	rp = require("request-promise"),
	debug = require("debug")('ctt-gct'),
	log = (require('log4js')).getLogger('GoogleCT'),
	remoteURL = ""; // Dodgy pollution of global space.

const addr = "https://www.google.com/transparencyreport/jsonp/ct/search?domain=%s&incl_exp=%s&incl_sub=%s&c=fx";
const parseRes = (data, certs = []) => {

		log.info("Received results from #%d.", data.startIndex);

		certs.push.apply(certs, data.results);

		if (data.numResults - data.startIndex <= 10) return certs;

		return rp(util.format(remoteURL + "&token=%s", data.nextPageToken))
			.then((res) => {
    			let data = fixGoogleJSON(res);

    			return parseRes(data, certs);
			});
	},
	fixGoogleJSON = (str) => JSON.parse(str.replace("/* API response */fx(", "").replace("}]});", "}]}"));

const searchAllTLS = ({ url = null, expired = false, subdomains = false }) => {

    if (url === null)
    	throw "You must provide a URL to scrape."

    remoteURL = util.format(addr, url, expired, subdomains)

    return rp(remoteURL)
    	.then((res) => {

    		let data = fixGoogleJSON(res);

            log.info(util.format("Total of %d certs in Google CT.", data.numResults));

    		return new Promise((resolve, reject) => {
    			resolve(parseRes(data));
    		});

    	})
    	.catch((err) => {
    		log.fatal("Encountered error while trying to reach Google CT logs.");
    		log.fatal(err.message);

    		return new Promise((resolve, reject) => reject(err));
    	});

};

const resolveSAN = (hash) => {
	if (hash === null)
		throw "Must provide a hash to resolveSAN.";

	return rp(util.format("https://www.google.com/transparencyreport/jsonp/ct/cert?hash=%s&c=fx", encodeURIComponent(hash)))
		.then((res) => {
			let data = fixGoogleJSON(res);

			log.info("Found alternate names for " + hash)

			return new Promise((resolve, reject) => {
    			resolve(data.result.dnsNames);
    		});
		})
		.catch((err) => {
			log.error("Recieved error on " + hash + ", retrying.");

			return resolveSAN(hash);
		})
}

googleCT.prototype.getHostnames = (url) => {
	if (url === undefined) 
		throw "URL is required.";

	log.info("Discovering subdomains for " + url);

	return searchAllTLS({
		url: url,
		expired: true,
		subdomains: true
	})
		.then((data) => {
			return new Promise((resolve, reject) => {

				let uniqSubjects = [],
					promises = [],
                    cloudflareWarn = false;

				data.forEach((el, ind) => {

                    if ((~el.subject.indexOf('cloudflaressl') || ~el.subject.indexOf('fastly')) && !cloudflareWarn) cloudflareWarn = true;

					if (!~uniqSubjects.indexOf(el.subject)) uniqSubjects.push(el.subject);

					// Resolve any SAN hostnames

					if (el.numDnsNames > 1) {

						log.info("Subject alternate Name found on " + el.hash + ", resolving.");

						promises.push(resolveSAN(el.hash)
							.then((names) => {
								names.forEach((name) => {
									if (!~uniqSubjects.indexOf(name)) uniqSubjects.push(name);
								})
							}));
					};
				});

				Promise.all(promises)
					.then(() => {
						log.info(util.format("Found %d unique hostnames in CT log for %s", uniqSubjects.length, url));

                        if (cloudflareWarn) log.warn("Cloudflare or similar SSL proxying detected, results may include other hosts listed in SAN.");
						resolve(uniqSubjects);
					});

			});
		});
}

module.exports = new googleCT();