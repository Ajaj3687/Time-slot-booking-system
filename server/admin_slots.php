<?php
// admin_slots.php
try {
    $sql = "SELECT sl.id, sl.start_time, sl.end_time, sl.is_booked,
                   s.name as service_name, 
                   p.name as provider_name, p.email as provider_email
            FROM slots sl
            JOIN services s ON sl.service_id = s.id
            JOIN users p ON sl.provider_id = p.id
            ORDER BY sl.start_time DESC";
    $stmt = $pdo->query($sql);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>
