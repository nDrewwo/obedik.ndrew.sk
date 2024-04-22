<?php

// Start a session if not already started
session_start();

// Check if RFID is present in session
if (!isset($_SESSION['user_rfid'])) {
  die("Error: RFID not found in session");
}

$rfid = $_SESSION['user_rfid'];
$choice = (int)$_POST['item']; // Cast item value to integer

// Database connection details (replace with your actual details)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cafeteria_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Prepare a SQL statement to check for existing record
$sql_check = "SELECT OID FROM orders WHERE Date = ? AND RFID = ?";
$stmt_check = $conn->prepare($sql_check);

// Get current date
$date = date('Y-m-d');

// Bind parameters to the check statement
$stmt_check->bind_param("ss", $date, $rfid);

// Execute check statement
$stmt_check->execute();

$result = $stmt_check->get_result(); // Get results from check

// If a record exists, update the choice
if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $oid = $row['OID']; // Get existing order ID

  // Prepare update statement
  $sql_update = "UPDATE orders SET CHOICE = ? WHERE OID = ?";
  $stmt_update = $conn->prepare($sql_update);

  // Bind parameters to the update statement
  $stmt_update->bind_param("ii", $choice, $oid);

  // Execute update statement
  if ($stmt_update->execute()) {
    echo '<meta http-equiv="refresh" content="2; url=../sexydash.php">';
  } else {
    echo "Error updating choice: " . $stmt_update->error;
  }

  // Close update statement
  $stmt_update->close();
} else {
  // No existing record, insert a new one

  // Prepare insert statement (same as before)
  $sql = "INSERT INTO orders (Date, RFID, CHOICE) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);

  // Bind parameters to the insert statement
  $stmt->bind_param("sss", $date, $rfid, $choice);

  // Execute insert statement
    if ($stmt->execute()) {
    echo '<meta http-equiv="refresh" content="2; url=../sexydash.php">';
    } else {
    echo "Error: " . $stmt->error;
    }

  // Close insert statement
  $stmt->close();
}

// Close check statement and connection
$stmt_check->close();
$conn->close();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Spravovávam...</h1>
</body>
<style>
    @import url('https://fonts.googleapis.com/css?family=Press+Start+2P:400,700&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Press Start 2P';
        scroll-behavior: smooth;
        color: #fff;
        background-color: #60695C;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
</html>
