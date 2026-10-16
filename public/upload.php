<?php
// Upload af fotos/video: multipart { image, author }
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$dir = __DIR__ . '/' . MEDIA_DIR . '/';
if (!is_dir($dir)) mkdir($dir, 0755, true);

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Ingen fil modtaget eller upload-fejl.']);
    exit();
}

$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'mp4', 'mov', 'webm'];
$ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    echo json_encode(['success' => false, 'error' => 'Filtypen er ikke tilladt.']);
    exit();
}

$author = preg_replace('/[^a-zA-Z0-9æøåÆØÅ\s]/u', '', $_POST['author'] ?? '');
$author = trim($author) === '' ? 'Anonym' : trim($author);
$filename = time() . '_' . substr(bin2hex(random_bytes(3)), 0, 6) . '_' . preg_replace('/\s+/', '-', $author) . '.' . $ext;

if (move_uploaded_file($_FILES['image']['tmp_name'], $dir . $filename)) {
    echo json_encode(['success' => true, 'id' => $filename, 'url' => '/' . MEDIA_DIR . '/' . $filename]);
} else {
    echo json_encode(['success' => false, 'error' => 'Kunne ikke gemme filen.']);
}
