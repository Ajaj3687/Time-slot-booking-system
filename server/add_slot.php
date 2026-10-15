<?php
// add_slot.php
$provider_id = $input['provider_id'];
$service_id = $input['service_id'];
$start_time = $input['start_time'];
$end_time = $input['end_time'];

try {
    $stmt = $pdo->prepare("INSERT INTO slots (provider_id, service_id, start_time, end_time, is_booked) VALUES (?, ?, ?, ?, 0)");
    $stmt->execute([$provider_id, $service_id, $start_time, $end_time]);
    sendJson(['message' => 'Slot added successfully'], 201);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>