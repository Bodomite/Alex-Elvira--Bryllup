<?php
// Sletter en upload: POST JSON { id, author }. Kun tilladt hvis forfatteren matcher filnavnet.
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$id = basename($data['id'] ?? '');
$author = preg_replace('/\s+/', '-', trim($data['author'] ?? ''));
$path = __DIR__ . '/' . MEDIA_DIR . '/' . $id;

if ($id === '' || $author === '' || !is_file($path)) {
    echo json_encode(['success' => false, 'error' => 'Filen findes ikke.']);
    exit();
}
$parts = explode('_', pathinfo($id, PATHINFO_FILENAME));
if (end($parts) !== $author) {
    echo json_encode(['success' => false, 'error' => 'Du kan kun slette dine egne filer.']);
    exit();
}
echo json_encode(unlink($path) ? ['success' => true, 'message' => 'Filen er slettet.'] : ['success' => false, 'error' => 'Kunne ikke slette filen.']);
