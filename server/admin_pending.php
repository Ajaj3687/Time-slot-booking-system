<?php
// admin_pending.php
try {
    $stmt = $pdo->query("SELECT id, name, email, mobile, created_at FROM users WHERE role = 'provider' AND is_approved = 0");
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>