<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('Asia/Kolkata');

require_once 'db.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


// Simple Router
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Helper to send JSON
function sendJson($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Auth Routes
if (strpos($request_uri, '/api/auth/signup') !== false && $method === 'POST') {
    require 'auth_signup.php';
} elseif (strpos($request_uri, '/api/auth/login') !== false && $method === 'POST') {
    require 'auth_login.php';
} elseif (strpos($request_uri, '/api/auth/forgot-password') !== false && $method === 'POST') {
    require 'auth_forgot_password.php';
} elseif (strpos($request_uri, '/api/auth/reset-password') !== false && $method === 'POST') {
    require 'auth_reset_password.php';
}

// Service Routes
elseif (strpos($request_uri, '/api/services/provider/') !== false && $method === 'GET') {
    // Extract provider ID
    $parts = explode('/', $request_uri);
    $providerId = end($parts);
    require 'get_services_by_provider.php';
} elseif (strpos($request_uri, '/api/services') !== false) {
    if ($method === 'POST')
        require 'create_service.php';
    if ($method === 'GET')
        require 'get_all_services.php';
}

// Slot Routes
elseif (strpos($request_uri, '/api/slots/provider/') !== false && $method === 'GET') {
    $parts = explode('/', $request_uri);
    $providerId = end($parts);
    require 'get_provider_slots.php';
} elseif (strpos($request_uri, '/api/slots/service/') !== false && $method === 'GET') {
    $parts = explode('/', $request_uri);
    $serviceId = end($parts);
    // Remove query params if any
    $serviceId = explode('?', $serviceId)[0];
    require 'get_slots_by_service.php';
} elseif (strpos($request_uri, '/api/slots') !== false && $method === 'POST') {
    require 'add_slot.php';
} elseif (strpos($request_uri, '/api/delete_slot') !== false && $method === 'POST') {
    require 'delete_slot.php';
}

// Booking Routes
elseif (strpos($request_uri, '/api/bookings/user/') !== false && $method === 'GET') {
    $parts = explode('/', $request_uri);
    $userId = end($parts);
    require 'get_user_bookings.php';
} elseif (strpos($request_uri, '/api/bookings/provider/') !== false && $method === 'GET') {
    $parts = explode('/', $request_uri);
    $providerId = end($parts);
    require 'get_provider_bookings.php';
} elseif (strpos($request_uri, '/api/bookings') !== false && $method === 'POST') {
    require 'create_booking.php';
} elseif (strpos($request_uri, '/api/cancel_booking') !== false && $method === 'POST') {
    require 'cancel_booking.php';
}

// Admin Routes
elseif (strpos($request_uri, '/api/admin/pending-providers') !== false && $method === 'GET') {
    require 'admin_pending.php';
} elseif (strpos($request_uri, '/api/admin/users') !== false && $method === 'GET') {
    require 'admin_users.php';
} elseif (strpos($request_uri, '/api/admin/bookings') !== false && $method === 'GET') {
    require 'admin_bookings.php';
} elseif (strpos($request_uri, '/api/admin/slots') !== false && $method === 'GET') {
    require 'admin_slots.php';
} elseif (strpos($request_uri, '/api/admin/approve-provider') !== false && $method === 'POST') {
    require 'admin_approve.php';
} else {
    sendJson(['message' => 'Not Found'], 404);
}
