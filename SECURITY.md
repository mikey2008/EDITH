# Security Policy

## Supported Versions

Currently, only the latest version of EDITH is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Security is a primary priority for the EDITH platform. 
Because the application processes data entirely client-side without proprietary backend servers, traditional data exfiltration is mitigated. Furthermore, strict Content-Security-Policy (CSP) headers restrict all external connections strictly to Wikipedia's Open REST API (`en.wikipedia.org`).

If you locate an issue bypassing these policies (such as an XSS vulnerability), please bypass public issues and directly open a GitHub security advisory on this repository.

We will review the submission within 72 hours.
