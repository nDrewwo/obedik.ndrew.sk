<?php

// Start a session if not already started
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
      die("CSRF Token Validation Failed");
  }
}

// Check if RFID is present in session
if (!isset($_SESSION['user_rfid'])) {
  die("Error: RFID not found in session");
}

$rfid = $_SESSION['user_rfid'];
$choice = (int)$_POST['item']; // Cast item value to integer

include 'db_connection.php';

// Prepare a SQL statement to check for existing record
$sql_check = "SELECT OID, CHOICE FROM orders WHERE Date = ? AND RFID = ?";
$stmt_check = $conn->prepare($sql_check);

$date = $_POST['date'] ?? date('Y-m-d'); // Use the posted date if available, otherwise use today's date

// Bind parameters to the check statement
$stmt_check->bind_param("ss", $date, $rfid);

// Execute check statement
$stmt_check->execute();

$result = $stmt_check->get_result(); // Get results from check

// If a record exists, update the choice
if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $oid = $row['OID']; // Get existing order ID

  // If unassigning an order, increment balance by 2
  if ($choice == 0 && $row['CHOICE'] != 0) {
    $sql_balance = "UPDATE users SET Balance = Balance + 2 WHERE RFID = ?";
    $stmt_balance = $conn->prepare($sql_balance);
    $stmt_balance->bind_param("s", $rfid);
    $stmt_balance->execute();
    $stmt_balance->close();
  }

  // If assigning an order when it was previously unassigned, decrement balance by 2
  if ($choice != 0 && $row['CHOICE'] == 0) {
    $sql_balance = "UPDATE users SET Balance = Balance - 2 WHERE RFID = ?";
    $stmt_balance = $conn->prepare($sql_balance);
    $stmt_balance->bind_param("s", $rfid);
    $stmt_balance->execute();
    $stmt_balance->close();
  }

  // Prepare update statement
  $sql_update = "UPDATE orders SET CHOICE = ? WHERE OID = ?";
  $stmt_update = $conn->prepare($sql_update);

  // Bind parameters to the update statement
  $stmt_update->bind_param("ii", $choice, $oid);

  // Execute update statement
  if ($stmt_update->execute()) {
    echo '<meta http-equiv="refresh" content="2; url=../dashboard.php">';
  } else {
    echo "Error updating choice: " . $stmt_update->error;
  }

  // Close update statement
  $stmt_update->close();
} else {
  // No existing record, insert a new one

  // Decrement balance by 2
  $sql_balance = "UPDATE users SET Balance = Balance - 2 WHERE RFID = ?";
  $stmt_balance = $conn->prepare($sql_balance);
  $stmt_balance->bind_param("s", $rfid);
  $stmt_balance->execute();
  $stmt_balance->close();

  // Prepare insert statement (same as before)
  $sql = "INSERT INTO orders (Date, RFID, CHOICE) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);

  // Bind parameters to the insert statement
  $stmt->bind_param("sss", $date, $rfid, $choice);

  // Execute insert statement
  if ($stmt->execute()) {
    echo '<meta http-equiv="refresh" content="2; url=../dashboard.php">';
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

<!-- Rest of your HTML code -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Spracovávam...</h1>
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