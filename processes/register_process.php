<?php
// Connect to the database
$conn = new mysqli("localhost", "root", "", "cafeteria_db");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user input from the form 
$rfid = $_POST['rfid'];
$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

// Insert data into the 'users' table
$sql = "INSERT INTO users (rfid, username, password) VALUES ('$rfid','$username', '$password')";
$result = $conn->query($sql);

// Close the database connection
$conn->close();

// Redirect to a landing page
header("Location: dashboard.php");
exit();
?>
