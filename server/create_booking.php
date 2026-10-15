<?php
// create_booking.php
$user_id = $input['user_id'];
$service_id = $input['service_id'];
$slot_id = $input['slot_id'];
$payment_method = $input['payment_method'];

try {
    $pdo->beginTransaction();

    // Lock Slot
    $stmt = $pdo->prepare("SELECT is_booked FROM slots WHERE id = ? FOR UPDATE");
    $stmt->execute([$slot_id]);
    $slot = $stmt->fetch();

    if (!$slot) {
        $pdo->rollBack();
        sendJson(['message' => 'Slot not found'], 404);
    }
    if ($slot['is_booked']) {
        $pdo->rollBack();
        sendJson(['message' => 'Slot already booked'], 409);
    }

    // Update Slot
    $stmt = $pdo->prepare("UPDATE slots SET is_booked = 1 WHERE id = ?");
    $stmt->execute([$slot_id]);

    // Create Booking
    $stmt = $pdo->prepare("INSERT INTO bookings (user_id, service_id, slot_id, status, payment_method) VALUES (?, ?, ?, 'confirmed', ?)");
    $stmt->execute([$user_id, $service_id, $slot_id, $payment_method]);

    $pdo->commit();
    sendJson(['message' => 'Booking confirmed successfully!'], 201);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJson(['error' => $e->getMessage()], 500);
}
?>