<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="icon" href="assets/icon.png">
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <div id="header">
        <h2>Ahoj, <?php echo $_SESSION['username']; ?>!</h2>
        <h2>Balance: <?php echo $_SESSION['balance']?>$</h2>
    </div>
    <?php include 'processes\luch_browse.php'; ?>
    <div class="bottomBtn"><a href="burza.php" class="href"><h1>Burza</h1></a></div>
    <?php
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {       
        echo '<div class="bottomBtn"><a href="adminpanel.php" class="href"><h1>Admin Panel</h1></a></div>';
    }    
    ?>
    <script src="scripts/expand.js"></script>
    <script src="scripts/activebtn.js"></script>
    <script src="scripts/choicelogic.js"></script>
</body>
</html>