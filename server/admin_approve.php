<?php
// admin_approve.php
$providerId = $input['providerId'];
try {
    $stmt = $pdo->prepare("UPDATE users SET is_approved = 1 WHERE id = ?");
    $stmt->execute([$providerId]);
    sendJson(['message' => 'Provider approved successfully']);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>