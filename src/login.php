<?php
// Start the PHP session for user authentication
session_start();

// Include the database connection file
require_once('processes/db_connection.php');

// Initialize error message (optional)
$errorMessage = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  // Sanitize user input (improve based on specific needs)
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);

    // Validate username and password (improve based on your requirements)
    if (empty($username) || empty($password)) {
        $errorMessage = "Please enter both username and password.";
    } else {
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

            // Generate a 64-character hexadecimal token (optional)
            $token = bin2hex(random_bytes(32));
            $_SESSION['token'] = $token;

            header("Location: ../dashboard.php");
            exit();
        } else {
            $errorMessage = "Incorrect username or password.";
        }
        } else {
        $errorMessage = "User not found.";
        }
    }
}

// Close the database connection (assuming it's in your db_connection.php)
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Log in</title>
    <link rel="icon" href="assets/icon.png">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div id="content">
        <h2>Welcome Back!</h2>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <label for="username" class="sr-only">Username</label>
            <input type="text" name="username" id="username" placeholder="Username" required>

            <label for="password" class="sr-only">Password</label>
            <input type="password" name="password" id="password" placeholder="Password" required>

            <input type="submit" value="Login">

            <?php if (!empty($errorMessage)) { ?>
            <div class="error"><?php echo $errorMessage; ?></div>
            <?php } ?>
        </form>
    </div>
</body>
</html>
