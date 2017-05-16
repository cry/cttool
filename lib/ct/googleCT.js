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

        debug("parseRes received data = " + JSON.stringify(data))

        let lastPage = (data.numResults - data.startIndex) <= 10

		log.info("Received results from #%d -> #%d", data.startIndex, lastPage ? data.numResults : data.startIndex + 9);

		certs.push.apply(certs, data.results);

		if (lastPage) return certs;

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

    remoteURL = util.format(addr, url, expired, subdomains);

    debug("remote url: " + remoteURL)

    return rp(remoteURL)
    	.then((res) => {

            debug("recv results: " + res)

    		if (~res.indexOf('"results":[]')) {
    			log.fatal("Domain not found within Google CT, aborting.");

    			// Reject if failure, assume domain not found.

    			return new Promise((resolve, reject) => reject());
    		};

    		let data = fixGoogleJSON(res);

            debug("parsed data: " + JSON.stringify(data))

            log.info(util.format("Total of %d certs in Google CT.", data.numResults));

            log.info(util.format("Estimated time to scrape: %d minutes\n", Math.round(data.numResults * 3 / 60 / 10)));

    		return new Promise((resolve, reject) => {
    			resolve(parseRes(data));
    		});

    	})
    	.catch((err) => {
    		log.error("Encountered error while trying to reach Google CT logs.");
    		log.error(err.message);
    		log.info("Retrying..");

    		return searchAllTLS({
    			url: url,
    			expired: expired,
    			subdomains: subdomains
    		});
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

                    if ((~el.subject.indexOf('cloudflare') || ~el.subject.indexOf('fastly')) && !cloudflareWarn) cloudflareWarn = true;

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