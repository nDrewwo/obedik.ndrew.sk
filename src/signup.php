<?php
session_start();

// Include database connection file
require_once('processes/db_connection.php');  // Replace 'db_connect.php' with your actual file

// Function to sanitize user input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Initialize error message
$errorMessage = "";

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  // Sanitize user data
    $rfid = sanitizeInput($_POST['rfid']);
    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);

  // Check RFID validation
    if (strlen($rfid) != 8 || !ctype_xdigit($rfid)) {
        $errorMessage .= "Invalid RFID format. Must be 8 characters hexadecimal. <br>";
    } else {
        // Check for existing RFID in database
        $sql = "SELECT * FROM users WHERE RFID = '$rfid'";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
        $errorMessage .= "This RFID is already registered. <br>";
        }
    }

    // Check for existing username in database
    $sql = "SELECT * FROM users WHERE Username = '$username'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        $errorMessage .= "Username already exists. Please choose another. <br>";
    }

    // Check password strength (optional, improve based on your needs)
    if (strlen($password) < 8) {
        $errorMessage .= "Password must be at least 8 characters long. <br>";
    }

    // If no errors, proceed with registration
    if (empty($errorMessage)) {
        // Hash password using a strong algorithm (e.g., password_hash)
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert user data into database
        $sql = "INSERT INTO users (RFID, Username, Password) VALUES ('$rfid', '$username', '$hashedPassword')";
        if (mysqli_query($conn, $sql)) {
        // Registration successful, redirect to login page (or display success message)

        //set session variables before redirecting
        $_SESSION['username'] = $username;
        $_SESSION['user_rfid'] = $row['RFID']; // Retrieve RFID from the row
        $_SESSION['role'] = $row['role']; // Retrieve role from the row

        // Generate a 64-character hexadecimal token (optional)
        $token = bin2hex(random_bytes(32));
        $_SESSION['token'] = $token;

        header("Location: dashboard.php");
        } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
    }

// Close connection (assuming it's in your db_connect.php)
mysqli_close($conn);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign up</title>
    <link rel="stylesheet" href="css/form.css">
</head>
<body>
    <div id="content">
        <h2>Create your account</h2>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <label for="rfid" class="sr-only">RFID</label>
            <input type="rfid" name="rfid" id="rfid" placeholder="RFID" required>

            <label for="username" class="sr-only">Username</label>
            <input type="text" name="username" id="username" placeholder="Username" required>

            <label for="password" class="sr-only">Password</label>
            <input type="password" name="password" id="password" placeholder="Password" required>

            <input type="submit" value="Sign up">
            <?php if (!empty($errorMessage)) { ?>
            <div class="error"><?php echo $errorMessage; ?></div>
            <?php } ?>
        </form>
        <p>Already have an account? <a href="login.php" class="href">Log in</a></p>
    </div>
</body>
</html>
