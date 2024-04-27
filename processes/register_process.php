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

// ** Start the session if it hasn't already started **
session_start();

// Check if insert was successful
if ($result) {
  // Retrieve user data from the 'users' table for balance
  $sql_balance = "SELECT Balance FROM users WHERE username='$username'";
  $balance_result = $conn->query($sql_balance);

  if ($balance_result->num_rows > 0) {
    $row_balance = $balance_result->fetch_assoc();
    $balance = $row_balance['Balance'];

    // Store username, rfid and balance in session variables
    $_SESSION['username'] = $username;
    $_SESSION['rfid'] = $rfid;
    $_SESSION['balance'] = $balance;

    // Redirect to a landing page (sexydash.php)
    header("Location: ../dashboard.php");
    exit();
  } else {
    // Handle error retrieving balance (optional)
    echo "Error retrieving balance! Please contact admin.";
  }
} else {
  // Handle insertion error (optional)
  echo "Error creating user! Please try again.";
}

// Close the database connection
$conn->close();
