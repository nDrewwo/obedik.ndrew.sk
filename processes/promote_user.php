<?php
// File: processes/promote_user.php

include 'db_connection.php';

// Get the username from the form
$username = $_POST['username'];

// Prepare the SQL statement
$stmt = $db->prepare("UPDATE users SET role = 'admin' WHERE Username = ?");

// Bind the username to the prepared statement
$stmt->bind_param("s", $username);

// Execute the statement
if ($stmt->execute()) {
    echo "User promoted successfully.";
} else {
    echo "Error promoting user: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$db->close();
?>