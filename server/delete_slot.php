<?php
// delete_slot.php

if (!isset($input['slot_id'])) {
    sendJson(["error" => "Slot ID required"], 400);
}

$slot_id = $input['slot_id'];

$stmt = $pdo->prepare("SELECT start_time FROM slots WHERE id = ?");
$stmt->execute([$slot_id]);
$slot = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$slot) {
    sendJson(["error" => "Slot not found"], 404);
}

$start_time = strtotime($slot['start_time']);
$current_time = time();

if ($current_time >= $start_time) {
    sendJson(["error" => "Cannot delete a slot after its start time"], 400);
}

$stmt = $pdo->prepare("DELETE FROM slots WHERE id = ?");
if ($stmt->execute([$slot_id])) {
    sendJson(["message" => "Slot deleted successfully"]);
} else {
    sendJson(["error" => "Failed to delete slot"], 500);
}
?>
