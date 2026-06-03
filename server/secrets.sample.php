<?php
// Copy to /etc/synchrozralok/secrets.php on the server (chmod 600, owner www-data).
// NEVER commit the real file.
return [
    // Google reCAPTCHA v2 — Secret key (server-side)
    'recaptcha_secret' => 'PASTE_RECAPTCHA_SECRET',

    // Mailgun (EU region for a .sk sending domain)
    'mailgun_api_key'  => 'PASTE_MAILGUN_PRIVATE_API_KEY',
    'mailgun_domain'   => 'mg.synchrozralok.sk',
    'mailgun_base'     => 'https://api.eu.mailgun.net/v3', // US: https://api.mailgun.net/v3

    // Addresses
    'club_email'       => 'synchro.zralok.bratislava@gmail.com',
    'from_email'       => 'SYNCHRO Žralok <prihlasky@mg.synchrozralok.sk>',
];
