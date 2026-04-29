# Security Policy

We take the security of this project seriously. This document explains which versions are currently supported and how to report security vulnerabilities safely.

## Supported Versions

Only the latest stable version of this project is actively supported with security updates.

| Version | Supported |
| ------- | --------- |
| Latest / Main Branch | ✅ |
| Older Versions | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

Please do **not** open a public GitHub issue for security problems. Instead, report the vulnerability privately by contacting the project maintainer.

### How to Report

Please include the following information:

- A clear description of the vulnerability
- Steps to reproduce the issue
- The affected file, feature, or component
- Possible impact of the vulnerability
- Screenshots, logs, or proof-of-concept if available

### Response Timeline

We will try to respond as soon as possible.

| Action | Expected Time |
| ------ | ------------- |
| Initial response | Within 3–5 days |
| Vulnerability review | Within 7 days |
| Fix or mitigation plan | Depending on severity |
| Public disclosure | After a fix is available |

## Security Best Practices

To help keep this project secure:

- Do not commit API keys, passwords, tokens, or private credentials.
- Store sensitive values in environment variables.
- Keep dependencies updated.
- Validate all user inputs.
- Avoid unsafe scripts or untrusted third-party code.
- Use HTTPS when deploying the project.
- Review uploaded files, media, and external links before using them.
- Follow secure coding practices when adding new features.

## Private Data and Credentials

This project should never expose:

- API keys
- Access tokens
- Database passwords
- Private URLs
- User personal data
- Admin credentials
- Secret environment variables

If any sensitive data is accidentally exposed, rotate the affected credentials immediately and remove them from the repository history if needed.

## Vulnerability Handling

If a reported vulnerability is accepted, we will:

1. Confirm the issue.
2. Assess the severity.
3. Create a fix or mitigation.
4. Test the fix.
5. Release the security update.
6. Credit the reporter if they want to be credited.

If a report is declined, we will explain why it does not qualify as a security vulnerability.

## Responsible Disclosure

Please give us reasonable time to investigate and fix the vulnerability before publicly sharing any details.

We appreciate responsible security research and contributions that help keep this project safe.
