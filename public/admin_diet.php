<?php
// Admin-API for kosthensyn. Kræver "Authorization: Bearer <ADMIN_PASSWORD>".
require_once __DIR__ . '/_bootstrap.php';
json_headers();
require_admin();

try {
    $conn = db();
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $action = $_SERVER['REQUEST_METHOD'] === 'POST' ? ($data['action'] ?? '') : '';

    if ($action === 'update_note') {
        $id = intval($data['id'] ?? 0);
        $note = trim($data['note'] ?? '');
        if ($note === '') $note = null;
        $stmt = $conn->prepare('UPDATE gaeste_hensyn SET note = ? WHERE id = ?');
        $stmt->bind_param('si', $note, $id);
        $stmt->execute();
        echo json_encode(['success' => true, 'message' => 'Note opdateret succesfuldt.']);
    } elseif ($action === 'delete_entry') {
        $id = intval($data['id'] ?? 0);
        $stmt = $conn->prepare('DELETE FROM gaeste_hensyn WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(['success' => true, 'message' => 'Kosthensyn slettet succesfuldt.']);
    } elseif ($action === 'reset_all' && ($data['confirm'] ?? '') === 'SLET ALT') {
        // Engangsoprydning, fx før et nyt bryllup genbruger databasen.
        $conn->query('TRUNCATE TABLE gaeste_hensyn');
        echo json_encode(['success' => true, 'message' => 'Alle indmeldelser er slettet.']);
    } elseif ($action === 'cleanup_before' && !empty($data['date'])) {
        $stmt = $conn->prepare('DELETE FROM gaeste_hensyn WHERE oprettet_dato < ?');
        $stmt->bind_param('s', $data['date']);
        $stmt->execute();
        echo json_encode(['success' => true, 'deleted' => $stmt->affected_rows]);
    } else {
        $res = $conn->query('SELECT id, navn, hensyn, note, oprettet_dato FROM gaeste_hensyn ORDER BY oprettet_dato DESC');
        $rows = [];
        while ($row = $res->fetch_assoc()) {
            $row['formatted_date'] = date('d-m-Y H:i', strtotime($row['oprettet_dato']));
            $rows[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $rows]);
    }
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Databasefejl under admin-operation.']);
}
