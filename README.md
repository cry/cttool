# Certificate Transparency toolkit

Certificate transparency essentially logs new TLS certificates as they are issued to centralised logging servers run by Google/Symantec. By querying these logs for all issued certificates, it is possible to obtain a list of all hostnames to which TLS certificates have been issued.

## Usage:

    npm install

    chmod +x cttool
	./cttool discover twillo.com

## Example output:

	srzd :: ~/cttool ‹master› » ./cttool discover example.com
	[2017-03-08 02:44:47.237] [INFO] Main - Certificate Transparency tool v0.0.1

	[2017-03-08 02:44:47.243] [INFO] GoogleCT - Discovering subdomains for example.com
	[2017-03-08 02:44:49.404] [INFO] GoogleCT - Total of 6 certs in Google CT.
	[2017-03-08 02:44:49.404] [INFO] GoogleCT - Received results from #0.
	[2017-03-08 02:44:49.406] [INFO] GoogleCT - Subject alternate Name found on ZC3lTYTDBJQVf1P2V7+fibTqbIsWNR/X7CWNVW+CEEA=, resolving.
	[2017-03-08 02:44:49.409] [INFO] GoogleCT - Subject alternate Name found on lEghNqFAC8OhE2/so+edTSAOA90gskXRnw54tWeer0g=, resolving.
	[2017-03-08 02:44:49.410] [INFO] GoogleCT - Subject alternate Name found on qPFPUswSgtcVOhMxbn2jnmrjexoQwWKIuQJKm53DxMY=, resolving.
	[2017-03-08 02:44:49.411] [INFO] GoogleCT - Subject alternate Name found on i1lWxX/c9yC2kHpLG8jKLkbNkOrVwGGkJs9IphF7+/o=, resolving.
	[2017-03-08 02:44:49.412] [INFO] GoogleCT - Subject alternate Name found on xpqwTBsg5vx4YcZ0dsrdodrnqNz24j4VMRwtJ5S/zRE=, resolving.
	[2017-03-08 02:44:49.413] [INFO] GoogleCT - Subject alternate Name found on 5+/5CCYLsoF06MZllUI1wLAZfnmN5D9Ugh+zPquLHqI=, resolving.
	[2017-03-08 02:44:50.806] [INFO] GoogleCT - Found alternate names for i1lWxX/c9yC2kHpLG8jKLkbNkOrVwGGkJs9IphF7+/o=
	[2017-03-08 02:44:50.810] [INFO] GoogleCT - Found alternate names for xpqwTBsg5vx4YcZ0dsrdodrnqNz24j4VMRwtJ5S/zRE=
	[2017-03-08 02:44:50.832] [INFO] GoogleCT - Found alternate names for lEghNqFAC8OhE2/so+edTSAOA90gskXRnw54tWeer0g=
	[2017-03-08 02:44:50.857] [INFO] GoogleCT - Found alternate names for qPFPUswSgtcVOhMxbn2jnmrjexoQwWKIuQJKm53DxMY=
	[2017-03-08 02:44:50.871] [INFO] GoogleCT - Found alternate names for 5+/5CCYLsoF06MZllUI1wLAZfnmN5D9Ugh+zPquLHqI=
	[2017-03-08 02:44:51.027] [INFO] GoogleCT - Found alternate names for ZC3lTYTDBJQVf1P2V7+fibTqbIsWNR/X7CWNVW+CEEA=
	[2017-03-08 02:44:51.027] [INFO] GoogleCT - Found 15 unique hostnames in CT log for example.com

	[2017-03-08 02:44:51.027] [INFO] Main - Unique hostnames found:

	> www.example.org
	> *.example.com
	> www.example.com
	> m.example.com
	> example.com
	> m.testexample.com
	> *.test1.com
	> dev.example.com
	> products.example.com
	> support.example.com
	> example.edu
	> example.net
	> example.org
	> www.example.edu
	> www.example.net