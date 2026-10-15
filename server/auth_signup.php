<?php
// auth_signup.php
$name = $input['name'];
$email = $input['email'];
$mobile = $input['mobile'];
$password = $input['password']; // In real app, password_hash($password, PASSWORD_DEFAULT)
$role = $input['role'];
$is_approved = ($role === 'provider') ? 0 : 1;

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, mobile, password, role, is_approved) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $mobile, $password, $role, $is_approved]);

    $msg = ($role === 'provider') ? 'Signup successful. Wait for Admin approval.' : 'Signup successful';
    sendJson(['message' => $msg], 201);
} catch (PDOException $e) {
    if ($e->errorInfo[1] == 1062) {
        sendJson(['message' => 'User already exists'], 400);
    }
    sendJson(['error' => $e->getMessage()], 500);
}
?>