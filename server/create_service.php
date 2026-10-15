<?php
// create_service.php
$provider_id = $input['provider_id'];
$name = $input['name'];
$description = $input['description'];
$price = $input['price'];
$category = $input['category'];

try {
    $stmt = $pdo->prepare("INSERT INTO services (provider_id, name, description, price, category) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$provider_id, $name, $description, $price, $category]);
    sendJson(['message' => 'Service created successfully'], 201);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
?>