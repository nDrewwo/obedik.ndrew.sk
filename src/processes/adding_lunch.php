<?php

session_start();

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
      die("CSRF Token Validation Failed");
  }
} 


// Get form data (assuming successful form submission)
$date = $_POST['date'];
$choice1 = $_POST['choice1'];
$choice2 = $_POST['choice2'];

// Create SQL statement to insert data
$sql = "INSERT INTO lunches (DATE, Choice1, Choice2) VALUES ('$date', '$choice1', '$choice2')";

// Execute the query and handle potential errors
if (mysqli_query($conn, $sql)) {
  header("Location: ../dashboard.php");
} else {
  echo "Error: " . mysqli_error($conn);
}

// Close database connection (assuming it's in a separate file)
mysqli_close($conn);

?>
