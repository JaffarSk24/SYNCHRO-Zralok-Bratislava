<?php
// Returns only the PUBLIC reCAPTCHA site key (read from the server .env).
// No secret values are ever exposed here.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$envPath = '/etc/synchrozralok/.env';
$siteKey = '';
if (is_file($envPath)) {
    $cfg = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($cfg) && !empty($cfg['RECAPTCHA_SITE_KEY'])) {
        $siteKey = (string)$cfg['RECAPTCHA_SITE_KEY'];
    }
}
echo json_encode(['recaptchaSiteKey' => $siteKey], JSON_UNESCAPED_UNICODE);
