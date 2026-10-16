<?php
// Henter ønsker automatisk fra Ønskeskyen (GoWish) og cacher dem i 10 minutter.
// Brug: wishlist.php?id=<wishlistId>
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$id = preg_replace('/[^A-Za-z0-9]/', '', $_GET['id'] ?? '');
if ($id === '') { echo json_encode(['success' => false, 'error' => 'Mangler id']); exit(); }

$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = "$cacheDir/wishlist_$id.json";
if (is_file($cacheFile) && time() - filemtime($cacheFile) < 600) {
    readfile($cacheFile);
    exit();
}

$query = 'query getWishlist($id: ID!) { wishlist(id: $id) { id title description wishes(input: {cursor: 0, limit: 200}) { data { id title description price currency photos url quantity } totalCount } } }';
$payload = json_encode(['query' => $query, 'variables' => ['id' => $id]]);

$ch = curl_init('https://api.gowish.com/graphql');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Origin: https://onskeskyen.dk'],
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$json = json_decode($resp, true);
$wl = $json['data']['wishlist'] ?? null;
if ($code !== 200 || !$wl) {
    // Fald tilbage til gammel cache hvis Ønskeskyen ikke svarer
    if (is_file($cacheFile)) { readfile($cacheFile); exit(); }
    echo json_encode(['success' => false, 'error' => 'Kunne ikke hente ønskesedlen.']);
    exit();
}

$wishes = array_map(fn($w) => [
    'id' => $w['id'],
    'title' => $w['title'],
    'description' => $w['description'],
    'price' => $w['price'],
    'currency' => $w['currency'],
    'image' => $w['photos'][0] ?? null,
    'quantity' => $w['quantity'] ?? null,
    'link' => "https://onskeskyen.dk/da/wishlists/$id/wish/{$w['id']}",
], $wl['wishes']['data'] ?? []);

$out = json_encode(['success' => true, 'title' => $wl['title'], 'wishes' => $wishes]);
@file_put_contents($cacheFile, $out);
echo $out;
