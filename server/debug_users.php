<?php
require 'db.php';
$stmt = $pdo->query('SELECT email, password FROM users ORDER BY id DESC LIMIT 5');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
