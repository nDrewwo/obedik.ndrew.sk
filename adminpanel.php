<?php
    session_start();
    if(!($_SESSION['role'] === 'admin')){
        header("Location: dashboard.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="icon" href="assets/icon.png">
    <link rel="stylesheet" href="css/adminpanel.css">
</head>
<body>
    <h2>Pridávanie Obedov</h2>
    <form action="processes/adding_lunch.php" method="post">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
        <label for="date">Date</label><input type="date" id="date" name="date" required>  
        <label for="choice1">Choice 1</label><input type="text" name="choice1" id="choice1" placeholder="Choice 1" required>
        <label for="choice2">Choice 2</label><input type="text" name="choice2" id="choice2" placeholder="Choice 2" required>
        <input type="submit" value="Submit">
    </form>
    <h2>Promote Usera</h2>
    <form action="processes/promote_user.php" method="post">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
        <label for="username">Username</label><input type="text" id="username" name="username" placeholder="Username">
        <input type="submit" value="Submit">
    </form>
</body>
</html>