<?php
// CSV-eksport af kosthensyn: export_diet.php?password=...
require_once __DIR__ . '/_bootstrap.php';

if (!hash_equals(ADMIN_PASSWORD, (string) ($_GET['password'] ?? ''))) {
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    echo '<h2>Adgang nægtet!</h2>';
    exit();
}

$conn = db();
$res = $conn->query('SELECT navn, hensyn, note, oprettet_dato FROM gaeste_hensyn ORDER BY oprettet_dato DESC');

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="bryllup_allergier_og_kosthensyn_' . date('Y-m-d') . '.csv"');
echo "\xEF\xBB\xBF"; // BOM så dansk Excel viser æøå korrekt

$out = fopen('php://output', 'w');
fputcsv($out, ['Gæstens Navn', 'Allergier & Kosthensyn', 'Note', 'Indmeldt Dato'], ';');
while ($row = $res->fetch_assoc()) {
    fputcsv($out, [$row['navn'], $row['hensyn'], $row['note'], date('d-m-Y H:i', strtotime($row['oprettet_dato']))], ';');
}
fclose($out);
$conn->close();
