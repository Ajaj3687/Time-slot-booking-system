<?php
// auth_reset_password.php
$email = $input['email'];
$otp = $input['otp'];
$new_password = $input['new_password'];

try {
    $stmt = $pdo->prepare("SELECT id, reset_otp, reset_otp_expires_at FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['message' => 'Invalid email or OTP.'], 400);
    }

    if ($user['reset_otp'] !== $otp) {
        sendJson(['message' => 'Invalid OTP.'], 400);
    }

    if (strtotime($user['reset_otp_expires_at']) < time()) {
        sendJson(['message' => 'OTP has expired. Please request a new one.'], 400);
    }

    // OTP is valid, update the password and clear OTP
    $updateStmt = $pdo->prepare("UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires_at = NULL WHERE email = ?");
    $updateStmt->execute([$new_password, $email]);

    sendJson(['message' => 'Password reset successful. You can now login.'], 200);

} catch (PDOException $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>
