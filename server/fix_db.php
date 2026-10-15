<?php
require 'db.php';

try {
    // Add column
    $pdo->exec("ALTER TABLE slots ADD COLUMN service_id INT NOT NULL AFTER provider_id");
    echo "Column 'service_id' added successfully.<br>";

    // Add foreign key
    $pdo->exec("ALTER TABLE slots ADD CONSTRAINT fk_slots_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE");
    echo "Foreign key constraint added successfully.<br>";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>