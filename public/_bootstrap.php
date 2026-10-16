<?php
// Fælles opsætning for alle PHP-endpoints.
// secrets.php genereres af GitHub Actions ud fra repository secrets og må ALDRIG committes.
require_once __DIR__ . '/secrets.php';

define('MEDIA_DIR', 'minder');          // gæsternes uploads (fotos/video)
define('HERO_DIR', 'forside_billeder'); // billeder til forsidens slideshow

function json_headers() {
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
}

function db() {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    } catch (Exception $e) {
        if (is_file(__DIR__ . '/db_config.php')) {
            $cfg = file_get_contents(__DIR__ . '/db_config.php');
            preg_match("/'DB_HOST',\s*'([^']*)'/", $cfg, $h);
            preg_match("/'DB_USER',\s*'([^']*)'/", $cfg, $u);
            preg_match("/'DB_PASSWORD',\s*'([^']*)'/", $cfg, $p);
            preg_match("/'DB_NAME',\s*'([^']*)'/", $cfg, $n);
            $conn = new mysqli($h[1] ?? 'localhost', $u[1] ?? '', $p[1] ?? '', $n[1] ?? '');
        } else {
            throw $e;
        }
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

function bearer_token() {
    $h = function_exists('apache_request_headers') ? apache_request_headers() : [];
    $auth = $h['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (preg_match('/Bearer\s(\S+)/', $auth, $m)) return $m[1];
    return $_REQUEST['password'] ?? '';
}

function require_admin() {
    if (!hash_equals(ADMIN_PASSWORD, (string) bearer_token())) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Uautoriseret adgang. Forkert kodeord.']);
        exit();
    }
}
