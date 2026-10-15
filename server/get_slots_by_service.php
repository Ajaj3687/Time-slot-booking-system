<?php
// get_slots_by_service.php
try {
    $stmt = $pdo->prepare("SELECT * FROM slots WHERE service_id = ? AND is_booked = 0 ORDER BY start_time ASC");
    $stmt->execute([$serviceId]);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>