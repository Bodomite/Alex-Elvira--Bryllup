<?php
// Lister billeder til forsidens slideshow (mappen forside_billeder/).
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$dir = __DIR__ . '/' . HERO_DIR . '/';
$files = [];
if (is_dir($dir)) {
    foreach (scandir($dir) as $f) {
        if (preg_match('/\.(jpe?g|png|webp)$/i', $f)) $files[] = $f;
    }
}
natsort($files);
echo json_encode(array_values(array_map(fn($f) => '/' . HERO_DIR . '/' . rawurlencode($f), $files)));
