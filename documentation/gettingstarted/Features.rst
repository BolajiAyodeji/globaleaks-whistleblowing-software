Features
========

User Features
-------------

- Multi-user system with customizable user roles (whistleblower, recipient, administrator)
- Entirely manageable from a web administration interface
- Support for `more than 90 languages <https://www.transifex.com/otf/globaleaks>`_ with support for Right-to-Left (RTL)
- Let whistleblowers decide if and when to confidentially declare their identity
- Exchange multimedia files with whistleblower
- Secure management of files' access and visualization
- Chat with Whistleblower to discuss the report
- Unique 16-digit receipt for the whistleblower to log back in anonymously
- Simple recipient interface for receiving and analyzing reports
- Support for the categorization of the reports with labels
- Support for the user search of reports
- Support for assigning and creating case management statuses
- Customizable look and feel (logo, colour, styles, font, text)
- Define multiple reporting channels (e.g. per-topic, per-department)
- Create and manage multiple whistleblowing site (e.g for subsidiaries or third party clients)
- Advanced questionnaire builder
- Whistleblowing system statistics

Legal Features
--------------

- Designed in adherence to `ISO 37002:2021 <https://www.iso.org/standard/65035.html>`_ and `EU Directive 2019/1937 <https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32019L1937>`_ recommendations for whistleblowing compliance
- Bidirectional anonymous communication (comments/messages)
- Customizable case management workflow (statuses/sub-statuses)
- Whistleblower identity conditional reporting workflow
- Manage conflict of interest in the reporting workflow
- Custodian functionality to authorize access to whistleblower identity
- GDPR privacy by design and by default
- GDPR configurable data retention policies
- GDPR compliant subscriber module for new users of SaaS services
- No logs of IP addresses
- Audit log
- Integratable with existing enterprise case management platform
- Free Software OSI Approved `AGPL 3.0 License <https://github.com/globaleaks/GlobaLeaks/blob/main/LICENSE>`_

Security Features
-----------------

- Designed in adherence to `ISO 27001:2022 <https://www.iso.org/standard/82875.html>`_, `CSA STAR <https://cloudsecurityalliance.org/star>`_ and `OWASP <https://owasp.org/>`_ recommendations for security compliance
- Full data encryption of whistleblower reports and recipient communication
- Digital anonymity support with `Tor <https://www.torproject.org/>`_ integration
- Built-in HTTPS support with `TLS 1.3 <https://tools.ietf.org/html/rfc8446>`_ standard (`SSLabs A+ <https://www.ssllabs.com/ssltest/analyze.html?d=try.globaleaks.org>`_ rating)
- Automatic free digital certificate enrollment (`Let’s Encrypt <https://letsencrypt.org/>`_)
- Multiple penetration tests with full public reports
- Two-Factor authentication (2FA) support compliant with standard `TOTP RFC 6238 <https://tools.ietf.org/html/rfc6238>`_
- Integrated network sandboxing with iptables
- Integrated application sandboxing with `AppArmor <http://wiki.apparmor.net/>`_
- Complete protection against automated submissions (spam prevention)
- Subject to continuous peer-review and periodic security audits
- PGP support for encrypted email notifications and encrypted file downloads
- Does not leave traces in browser cache

Technical Features
------------------
- Multi-site support enabling to run multiple virtual site on the same setup
- Responsive user interfaces made with `Boostrap <https://getbootstrap.com/>`_ CSS Framework
- Designed in adherence to `Directive (EU) 2019/882 <https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A32019L0882>`_, `Directive (EU) 2016/2102 <https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A32016L2102>`_, `ETSI EN 301 549 <https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf>`_, `W3C WCAG 2.2 <https://www.w3.org/TR/WCAG22/>`_ and `WAI-ARIA 2.2 <https://www.w3.org/TR/wai-aria-1.2/>`_ recommendations for accessibility compliance
- Automated Software Quality Measurement and Continuous Integration Testing
- Long-Term Support plan (LTS)
- Built with lightweight framework technologies (`Angular <https://angular.dev/>`_ and `Python Twisted <https://twisted.org/>`_)
- Integrated `SQLite <https://sqlite.org>`_ database
- Automatic setup of `Tor Onion Services Version 3 <https://www.torproject.org/>`_
- Support for self-service signup for whistleblowing SaaS service setup
- Support for Linux operating system (`Debian <https://www.debian.org/>`_/`Ubuntu <https://ubuntu.com/>`_)
- Debian packaging with repository for update/upgrades
- Fully self-contained application
- Easy integration of the platform with existing websites
- Built and packaged with `reproducibility <https://en.wikipedia.org/wiki/Reproducible_builds>`_ in mind
- Rest API
