<?php
session_start();

// Connect to the database
include 'db_connection.php';

// Get user input from the login form
$username = $_POST['username'];
$password = $_POST['password'];

$token = bin2hex(random_bytes(32)); // Generate a 64-character hexadecimal token

// Retrieve user data from the 'users' table
$sql = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();

  // Verify the password using password_verify()
  if (password_verify($password, $row['Password'])) {
    // Password is correct, set session variables and redirect
    $_SESSION['username'] = $username;
    $_SESSION['user_rfid'] = $row['RFID']; // Retrieve RFID from the row
    $_SESSION['role'] = $row['role']; // Retrieve role from the row
    $_SESSION['token'] = $token;
    header("Location: ../dashboard.php");
    exit();
  } else {
    // Incorrect password
    echo "Incorrect password";
  }
} else {
  // User not found
  echo "User not found";
}

// Close the database connection
$conn->close();

?>
