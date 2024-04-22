<?php
  // Database connection details (replace with your actual credentials)
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "cafeteria_db";

  // Create connection
  $conn = mysqli_connect($servername, $username, $password, $dbname);

  // Check connection
  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }

  // SQL query to get upcoming lunches (modify for your timeframe)
  $sql = "SELECT * FROM lunches WHERE DATE >= CURDATE() ORDER BY DATE ASC"; // Adjust for desired timeframe
  $result = mysqli_query($conn, $sql);

  while ($lunchRow = mysqli_fetch_assoc($result)) {
    // Extract data from current lunch entry
    $lunchDate = $lunchRow['DATE'];
    $choice1 = $lunchRow['Choice1'];
    $choice2 = $lunchRow['Choice2'];

    // Build obed div HTML dynamically
    $obedDiv = "<div class=\"obed\">
                  <h1 class=\"date\">$lunchDate</h1>
                  <form action=\"processes/submit_process.php\" method=\"post\">
                  <div class=\"toggle\">
                    <button type=\"button\" id=\"option1\" class=\"toggle-btn\"><h1>$choice1</h1></button>
                    <h1>|</h1>
                    <button type=\"button\" id=\"option2\" class=\"toggle-btn\"><h1>$choice2</h1></button>
                  </div>
                  <input type=\"hidden\" name=\"item\">  <button type=\"submit\"><h1>Submit</h1></button>
                </form>
                
                </div>";

    // Echo the constructed obed div
    echo $obedDiv;
  }

  mysqli_close($conn);
  ?>