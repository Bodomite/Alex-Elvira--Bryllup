<?php
// Lister gæsternes uploads, nyeste først.
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$dir = __DIR__ . '/' . MEDIA_DIR . '/';
$items = [];
if (is_dir($dir)) {
    foreach (scandir($dir) as $f) {
        if (!preg_match('/\.(jpe?g|png|gif|webp|heic|mp4|mov|webm)$/i', $f, $m)) continue;
        $parts = explode('_', pathinfo($f, PATHINFO_FILENAME));
        $author = str_replace('-', ' ', end($parts));
        $items[] = [
            'id' => $f,
            'url' => '/' . MEDIA_DIR . '/' . rawurlencode($f),
            'author' => $author,
            'type' => preg_match('/^(mp4|mov|webm)$/i', $m[1]) ? 'video' : 'image',
            'mtime' => filemtime($dir . $f),
        ];
    }
}
usort($items, fn($a, $b) => $b['mtime'] <=> $a['mtime']);
echo json_encode($items);
