<?php
// cancel_booking.php

if (!isset($input['booking_id'])) {
    sendJson(["error" => "Booking ID required"], 400);
}

$booking_id = $input['booking_id'];

$stmt = $pdo->prepare("SELECT b.slot_id, s.start_time FROM bookings b JOIN slots s ON b.slot_id = s.id WHERE b.id = ?");
$stmt->execute([$booking_id]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if ($booking) {
    $start_time = strtotime($booking['start_time']);
    $current_time = time();
    
    if ($current_time >= $start_time) {
        sendJson(["error" => "Cannot cancel a booking after the service start time"], 400);
    }

    $stmt = $pdo->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?");
    $stmt->execute([$booking_id]);
    
    $stmt = $pdo->prepare("UPDATE slots SET is_booked = 0 WHERE id = ?");
    $stmt->execute([$booking['slot_id']]);
    
    sendJson(["message" => "Booking cancelled successfully"]);
} else {
    sendJson(["error" => "Booking not found"], 404);
}
?>
