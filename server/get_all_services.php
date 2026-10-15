<?php
// get_all_services.php
try {
    $stmt = $pdo->query("SELECT s.*, u.name as provider_name FROM services s JOIN users u ON s.provider_id = u.id WHERE u.is_approved = 1");
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>