<?php
// Modtager kosthensyn fra gæster: POST JSON { name, details }
require_once __DIR__ . '/_bootstrap.php';
json_headers();

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$name = trim($data['name'] ?? '');
$details = trim($data['details'] ?? '');

if ($name === '' || $details === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Venligst udfyld alle felter.']);
    exit();
}

try {
    $conn = db();
    $conn->query("CREATE TABLE IF NOT EXISTS gaeste_hensyn (
        id INT AUTO_INCREMENT PRIMARY KEY,
        navn VARCHAR(255) NOT NULL,
        hensyn TEXT NOT NULL,
        note TEXT NULL DEFAULT NULL,
        oprettet_dato TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $stmt = $conn->prepare('INSERT INTO gaeste_hensyn (navn, hensyn) VALUES (?, ?)');
    $stmt->bind_param('ss', $name, $details);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    if (defined('NOTIFY_EMAIL') && NOTIFY_EMAIL !== '') {
        $subject = '=?UTF-8?B?' . base64_encode("Nyt kosthensyn indmeldt: $name") . '?=';
        $message = "Hej,\n\nDer er indmeldt et nyt kosthensyn på bryllupssiden.\n\nNavn: $name\nKosthensyn: $details\n\nVenlig hilsen\nBryllupssiden";
        $headers = "From: Elvira & Alexander <no-reply@majkjaer.dk>\r\n"
                 . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
        @mail(NOTIFY_EMAIL, $subject, $message, $headers);
    }

    echo json_encode(['success' => true, 'message' => 'Kosthensyn registreret succesfuldt.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Der opstod en fejl på serveren.']);
}
