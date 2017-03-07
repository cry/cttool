# Certificate Transparency toolkit

Certificate transparency essentially logs new TLS certificates as they are issued to centralised logging servers run by Google/Symantec. By querying these logs for all issued certificates, it is possible to obtain a list of all hostnames to which TLS certificates have been issued.

## Usage:

    npm install

    chmod +x cttool
	./cttool discover twillo.com