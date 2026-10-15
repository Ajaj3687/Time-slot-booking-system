<?php
// get_provider_slots.php
try {
    $stmt = $pdo->prepare("SELECT * FROM slots WHERE provider_id = ? ORDER BY start_time DESC");
    $stmt->execute([$providerId]);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>