<?php
// Application form endpoint: verifies reCAPTCHA v2 and sends two emails via Mailgun.
// Secrets are loaded from a file OUTSIDE the web root (never in the repo).
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed');
}

// --- config from .env (outside web root, never committed) ---
$envPath = '/etc/synchrozralok/.env';
if (!is_file($envPath)) {
    fail(500, 'Server nie je nakonfigurovaný.');
}
$cfg = parse_ini_file($envPath, false, INI_SCANNER_RAW);
if (!is_array($cfg)) {
    fail(500, 'Chyba konfigurácie.');
}

// --- read JSON body ---
$raw = file_get_contents('php://input');
$in = json_decode($raw, true);
if (!is_array($in)) {
    fail(400, 'Neplatné údaje.');
}

// --- honeypot: pretend success, send nothing ---
if (!empty($in['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// --- collect + validate fields ---
$clean = static function ($v): string {
    return trim(str_replace(["\r", "\n"], ' ', (string)($v ?? '')));
};
$dieta   = $clean($in['dieta_meno'] ?? '');
$datum   = $clean($in['datum'] ?? '');
$rodic   = $clean($in['rodic_meno'] ?? '');
$email   = $clean($in['email'] ?? '');
$telefon = $clean($in['telefon'] ?? '');
$token   = (string)($in['g-recaptcha-response'] ?? '');

if ($dieta === '' || $datum === '' || $rodic === '' || $email === '' || $telefon === '') {
    fail(422, 'Vyplňte prosím všetky polia.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Neplatný e-mail.');
}
if ($token === '') {
    fail(422, 'Chýba overenie reCAPTCHA.');
}

// --- verify reCAPTCHA v2 ---
$verify = json_decode((string)httpPost(
    'https://www.google.com/recaptcha/api/siteverify',
    [
        'secret'   => $cfg['RECAPTCHA_SECRET'],
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]
), true);
if (empty($verify['success'])) {
    fail(403, 'Overenie reCAPTCHA zlyhalo. Skúste znova.');
}

// --- send emails via Mailgun ---
$base   = rtrim($cfg['MAILGUN_BASE'], '/') . '/' . $cfg['MAILGUN_DOMAIN'] . '/messages';
$apiKey = $cfg['MAILGUN_API_KEY'];
$from   = $cfg['FROM_EMAIL'];
$club   = $cfg['CLUB_EMAIL'];

$esc = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

// 1) notification to the club (Reply-To = parent's e-mail)
$clubText = "Nová prihláška do klubu Synchro Žralok Bratislava\n\n"
    . "Meno dieťaťa: {$dieta}\n"
    . "Dátum narodenia: {$datum}\n\n"
    . "Meno rodiča: {$rodic}\n"
    . "E-mail: {$email}\n"
    . "Telefónne číslo: {$telefon}\n";
$ok1 = mailgunSend($base, $apiKey, [
    'from'         => $from,
    'to'           => $club,
    'subject'      => "Nová prihláška: {$dieta}",
    'text'         => $clubText,
    'h:Reply-To'   => $email,
]);

// 2) confirmation to the parent (Reply-To = club's gmail)
$clientText = "Dobrý deň,\n\n"
    . "ďakujeme za Vašu prihlášku do klubu Synchro Žralok Bratislava. "
    . "Vašu prihlášku sme prijali a naši tréneri Vás budú čoskoro kontaktovať.\n\n"
    . "Zadané údaje:\n"
    . "Meno dieťaťa: {$dieta}\n"
    . "Dátum narodenia: {$datum}\n"
    . "Meno rodiča: {$rodic}\n"
    . "Telefónne číslo: {$telefon}\n\n"
    . "S pozdravom,\ntím Synchro Žralok Bratislava";
$ok2 = mailgunSend($base, $apiKey, [
    'from'       => $from,
    'to'         => $email,
    'subject'    => 'Prijali sme Vašu prihlášku – SYNCHRO Žralok Bratislava',
    'text'       => $clientText,
    'h:Reply-To' => $club,
]);

if (!$ok1) {
    fail(502, 'E-mail sa nepodarilo odoslať. Skúste neskôr.');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);

// ---------- helpers ----------
function httpPost(string $url, array $fields): string {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($fields),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res === false ? '' : $res;
}

function mailgunSend(string $url, string $apiKey, array $fields): bool {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_USERPWD        => 'api:' . $apiKey,
        CURLOPT_POSTFIELDS     => $fields,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
    ]);
    $res  = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code >= 200 && $code < 300;
}
