<?php
require 'db.php';

try {
    // Add columns for OTP
    $pdo->exec("ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10) NULL AFTER password, ADD COLUMN reset_otp_expires_at DATETIME NULL AFTER reset_otp");
    echo "Columns 'reset_otp' and 'reset_otp_expires_at' added successfully.<br>";
} catch (PDOException $e) {
    if ($e->errorInfo[1] == 1060) {
        // 1060 is Duplicate column name
        echo "Columns already exist.<br>";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
?>
