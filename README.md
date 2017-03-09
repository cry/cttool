# Certificate Transparency toolkit

Certificate transparency essentially logs new TLS certificates as they are issued to centralised logging servers run by Google/Symantec. By querying these logs for all issued certificates, it is possible to obtain a list of all hostnames to which TLS certificates have been issued.

## Usage:

    npm install

    chmod +x cttool
	./cttool discover twillo.com

## Example output:

	srzd :: ~/cttool ‹master*› » ./cttool discover example.com -c -f res.json
	[2017-03-09 15:11:54.568] [INFO] Main - Certificate Transparency tool v0.0.2

	[2017-03-09 15:11:54.575] [INFO] GoogleCT - Discovering subdomains for example.com
	[2017-03-09 15:11:56.128] [INFO] GoogleCT - Total of 6 certs in Google CT.
	[2017-03-09 15:11:56.129] [INFO] GoogleCT - Estimated time to scrape: 0 minutes

	[2017-03-09 15:11:56.129] [INFO] GoogleCT - Received results from #0.
	[2017-03-09 15:11:56.131] [INFO] GoogleCT - Subject alternate Name found on ZC3lTYTDBJQVf1P2V7+fibTqbIsWNR/X7CWNVW+CEEA=, resolving.
	[2017-03-09 15:11:56.133] [INFO] GoogleCT - Subject alternate Name found on lEghNqFAC8OhE2/so+edTSAOA90gskXRnw54tWeer0g=, resolving.
	[2017-03-09 15:11:56.134] [INFO] GoogleCT - Subject alternate Name found on qPFPUswSgtcVOhMxbn2jnmrjexoQwWKIuQJKm53DxMY=, resolving.
	[2017-03-09 15:11:56.134] [INFO] GoogleCT - Subject alternate Name found on i1lWxX/c9yC2kHpLG8jKLkbNkOrVwGGkJs9IphF7+/o=, resolving.
	[2017-03-09 15:11:56.135] [INFO] GoogleCT - Subject alternate Name found on xpqwTBsg5vx4YcZ0dsrdodrnqNz24j4VMRwtJ5S/zRE=, resolving.
	[2017-03-09 15:11:56.136] [INFO] GoogleCT - Subject alternate Name found on 5+/5CCYLsoF06MZllUI1wLAZfnmN5D9Ugh+zPquLHqI=, resolving.
	[2017-03-09 15:11:57.380] [INFO] GoogleCT - Found alternate names for xpqwTBsg5vx4YcZ0dsrdodrnqNz24j4VMRwtJ5S/zRE=
	[2017-03-09 15:11:57.423] [INFO] GoogleCT - Found alternate names for qPFPUswSgtcVOhMxbn2jnmrjexoQwWKIuQJKm53DxMY=
	[2017-03-09 15:11:57.439] [INFO] GoogleCT - Found alternate names for i1lWxX/c9yC2kHpLG8jKLkbNkOrVwGGkJs9IphF7+/o=
	[2017-03-09 15:11:57.466] [INFO] GoogleCT - Found alternate names for ZC3lTYTDBJQVf1P2V7+fibTqbIsWNR/X7CWNVW+CEEA=
	[2017-03-09 15:11:57.466] [INFO] GoogleCT - Found alternate names for 5+/5CCYLsoF06MZllUI1wLAZfnmN5D9Ugh+zPquLHqI=
	[2017-03-09 15:11:57.504] [INFO] GoogleCT - Found alternate names for lEghNqFAC8OhE2/so+edTSAOA90gskXRnw54tWeer0g=
	[2017-03-09 15:11:57.505] [INFO] GoogleCT - Found 15 unique hostnames in CT log for example.com

	Checking if hosts have a valid DNS entry..
	This may take a while, meanwhile raw domain list has been written to res.json

	> *.example.com
	> *.test1.com
	> www.example.org - 93.184.216.34
	> www.example.com - 93.184.216.34
	> example.com - 93.184.216.34
	> dev.example.com - no dns found
	> products.example.com - no dns found
	> support.example.com - no dns found
	> m.testexample.com - 176.74.176.187
	> m.example.com - no dns found
	> example.net - 93.184.216.34
	> example.org - 93.184.216.34
	> example.edu - 93.184.216.34
	> www.example.edu - 93.184.216.34
	> www.example.net - 93.184.216.34