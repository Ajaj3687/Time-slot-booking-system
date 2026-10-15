<?php
// auth_login.php
$identifier = $input['identifier'];
$password = $input['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR mobile = ?");
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['message' => 'User not found'], 404);
    }

    if ($password !== $user['password']) { // Use password_verify in prod
        sendJson(['message' => 'Invalid credentials'], 401);
    }

    if ($user['role'] === 'provider' && $user['is_approved'] == 0) {
        sendJson(['message' => 'Account pending approval'], 403);
    }

    unset($user['password']); // Don't send password back
    sendJson(['message' => 'Login successful', 'user' => $user]);

} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>