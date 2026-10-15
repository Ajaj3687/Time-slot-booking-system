<?php
// get_user_bookings.php
try {
    $sql = "SELECT b.id, b.status, b.booking_date, s.name as service_name, sl.start_time, sl.end_time 
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN slots sl ON b.slot_id = sl.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>