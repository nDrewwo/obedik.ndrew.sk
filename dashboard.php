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
    <title>Document</title>
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <div id="header">
        <h2>Ahoj, <?php echo $_SESSION['username']; ?>!</h2>
        <h2>Balance: <?php echo $_SESSION['balance']?>$</h2>
    </div>
    <div class="obedik">
        <button class="collapsible"><h1>25-04-2024</h1></button>
        <div class="content">
            <form action="processes/submit_process.php" method="post">
                <div class="toggle">
                    <button type="button" id="option1" class="toggle-btn"><h1>Choice1</h1></button>
                    <button type="button" id="option2" class="toggle-btn"><h1>Choice2</h1></button>
                </div>
                <input type="hidden" name="item">
                <button type="submit" class="submitBtn"><h1>Submit</h1></button>
            </form>
        </div>
    </div>
    <div class="bottomBtn"><a href="burza.php" class="href"><h1>Burza</h1></a></div>
    <?php
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {        // Element to show for admin role
        echo '<div class="bottomBtn"><a href="adminpanel.php" class="href"><h1>Admin Panel</h1></a></div>';
    }    
    ?>
    <script src="scripts/expand.js"></script>
    <script src="scripts/activebtn.js"></script>
    <script src="scripts/choicelogic.js"></script>
</body>
</html>