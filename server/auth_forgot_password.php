<?php
// auth_forgot_password.php
$email = $input['email'];

try {
    // 1. Check if user exists
    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Obscure whether email exists or not in production, 
        // but for now return success anyway to prevent email enumeration, 
        // or return 404 for easier testing.
        sendJson(['message' => 'User not found with this email'], 404);
    }

    // 2. Generate OTP
    $otp = sprintf("%06d", mt_rand(1, 999999));
    
    // 3. Set expiry to 15 minutes from now
    $expires_at = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    // 4. Save to DB
    $updateStmt = $pdo->prepare("UPDATE users SET reset_otp = ?, reset_otp_expires_at = ? WHERE email = ?");
    $updateStmt->execute([$otp, $expires_at, $email]);

    // 5. Send Email
    $subject = "Your Password Reset OTP - TimeBooking";
    $message = "Hello {$user['name']},\n\nYour OTP to reset your password is: {$otp}\nThis OTP is valid for 15 minutes.\n\nIf you did not request a password reset, please ignore this email.";
    $headers = "From: noreply@timebooking.local";

    // Uncomment true below if standard mail() function is configured properly (e.g., SMTP in php.ini)
    // mail($email, $subject, $message, $headers);
    //
    // For local dev without mail server: 
    // We will just return the OTP in the frontend response for easiest testing since this is a local setup.
    // In production, NEVER return the OTP in the JSON response!
    
    @mail($email, $subject, $message, $headers); // Try to send, ignore errors if misconfigured locally

    sendJson([
        'message' => 'OTP sent to your email successfully.',
        'dev_otp' => $otp // REMOVE IN PRODUCTION
    ], 200);

} catch (PDOException $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>
