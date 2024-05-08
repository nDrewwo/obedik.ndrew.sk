<?php

include 'db_connection.php';

$sql = "SELECT Balance FROM users WHERE Username = ?";
$stmt = $conn->prepare($sql); 
$stmt->bind_param("s", $username); // "s" indicates the variable type is string

$username = $_SESSION['username']; // Replace with your session variable
$stmt->execute();

$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
  echo "<h2>Balance: " . $row["Balance"] . "$</h2>";
}

$conn->close();
?>