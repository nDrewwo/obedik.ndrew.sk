<?php
session_start();

// Connect to the database
$conn = new mysqli("localhost", "root", "", "cafeteria_db");

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get user input from the login form
$username = $_POST['username'];
$password = $_POST['password'];

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
    $_SESSION['balance'] = $row['Balance']; // Retrieve balance from the row
    header("Location: ../sexydash.php");
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
