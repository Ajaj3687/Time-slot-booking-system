<?php
// admin_users.php
try {
    $stmt = $pdo->query("SELECT id, name, email, mobile, role, is_approved FROM users");
    sendJson($stmt->fetchAll());
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>