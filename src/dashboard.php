<?php

session_start();

if(!isset($_SESSION['username'])){
    header("Location: login.php");
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
        <?php include 'processes/fetch_balance.php'; ?>
    </div>
    <?php include 'processes/luch_browse.php'; ?>
    <a href="burza.php" class="href"><div class="bottomBtn"><h1>Burza</h1></div></a>
    <?php
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {       
        echo '<a href="adminpanel.php" class="href"><div class="bottomBtn"><h1>Admin Panel</h1></div></a>';
    }    
    ?>
    <a href="processes/logout_process.php" class="href"><div class="bottomBtn "id="logout"><h1>Log Out</h1></div></a>
    <script src="scripts/expand.js"></script>
    <script src="scripts/activebtn.js"></script>
    <script src="scripts/choicelogic.js"></script>
</body>
</html>