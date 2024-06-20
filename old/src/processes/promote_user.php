<?php
// Start the session
session_start();

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
        die("CSRF Token Validation Failed");
    }
} 

    // Get the username from the form
    $username = $_POST['username'];

    include 'db_connection.php';

    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE users SET role='admin' WHERE Username=?");

    // Bind the parameters
    $stmt->bind_param("s", $username);

    // Execute the statement
    $stmt->execute();

    // Close the statement and the connection
    $stmt->close();
    $conn->close();
}
?>