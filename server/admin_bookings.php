<?php
// admin_bookings.php
try {
    $sql = "SELECT b.id, b.status, b.booking_date, b.payment_method, 
                   s.name as service_name, 
                   sl.start_time, sl.end_time, sl.id as slot_id,
                   u.name as customer_name, u.email as customer_email, u.mobile as customer_mobile,
                   p.name as provider_name, p.email as provider_email
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN slots sl ON b.slot_id = sl.id
            JOIN users u ON b.user_id = u.id
            JOIN users p ON s.provider_id = p.id
            ORDER BY b.booking_date DESC";
    $stmt = $pdo->query($sql);
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>
