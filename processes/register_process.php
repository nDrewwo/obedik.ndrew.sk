<?php

include 'db_connection.php';

// Start the session if it hasn't already started
session_start();

// Get user input from the form 
$rfid = $_POST['rfid'];
$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

// Check if RFID or username already exists
$sql_check = "SELECT * FROM users WHERE rfid='$rfid' OR username='$username'";
$check_result = $conn->query($sql_check);

if ($check_result->num_rows > 0) {
    // RFID or username already exists
    $_SESSION['error'] = "RFID or username already exists!";
     header("Location: ../signup.php"); // Replace with your registration form page
    exit();
} else {
    // Insert data into the 'users' table
    $sql = "INSERT INTO users (rfid, username, password) VALUES ('$rfid','$username', '$password')";
    $result = $conn->query($sql);

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
            $_SESSION['user_rfid'] = $rfid;

            // Redirect to a landing page (sexydash.php)
            header("Location: ../dashboard.php");
            exit();
        } else {
            // Handle error retrieving balance (optional)
            echo "Error retrieving balance! Please contact admin.";
        }
    } else {
        // Handle error inserting data (optional)
        echo "Error inserting data! Please contact admin.";
    }
}