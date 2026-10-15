<?php
// get_services_by_provider.php
try {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE provider_id = ?");
    $stmt->execute([$providerId]);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>