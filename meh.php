<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Dashboard</title>
    <link rel="stylesheet" href="css/dash.css">
</head>
<body>
    <h2>Welcome, <?php echo $_SESSION['username']; ?>!</h2>
    <p>This is your dashboard.</p>
    <a href="logout.php" class="href">Logout</a>
    <form action="submit_choice.php" method="post">
            <input type="hidden" name="rfid" value="<?php echo $_SESSION['user_rfid']; ?>">

            <label for="food_choice">Select your food choice:</label>
            <select id="food_choice" name="food_choice" required>
                <option value="">-- Please select --</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
        <button type="submit">Submit Choice</button>
    </form>
</body>
</html>
