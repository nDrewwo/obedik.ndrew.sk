<?php session_start()?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="css/sexydash.css">
</head>
<body>
  <div id="infocontainer">
    <h1>Ahoj  <?php echo $_SESSION['username']; ?>!</h1>
    <h1>Balance: <?php echo $_SESSION['balance']?>$</h1>
  </div>
  <?php include 'processes/lunches_process.php'; ?>
  <script src="scripts/activebtn.js"></script>
  <script src="scripts/choicelogic.js"></script>
</body>
</html>
