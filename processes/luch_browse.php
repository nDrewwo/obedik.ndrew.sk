<?php

include 'db_connection.php';

// SQL query to fetch lunches
$sql = "SELECT * FROM lunches";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // Loop through each lunch
  while($row = $result->fetch_assoc()) {
    // Extract lunch data
    $date = $row["DATE"]; // Assuming a "date" column exists
    $choice1 = $row["Choice1"]; // Assuming a "choice1" column exists
    $choice2 = $row["Choice2"]; // Assuming a "choice2" column exists
  
  // Build the HTML structure for each lunch
  echo "<div class='obedik'>";
  echo "  <button class='collapsible'><h1>" . $date . "</h1></button>";
  echo "  <div class='content'>";
  echo "    <form action='processes/submit_process.php' method='post'>";
  echo "      <div class='toggle'>";
  echo "        <button type='button' class='toggle-btn option1'><h1>" . $choice1 . "</h1></button>";
  echo "        <button type='button' class='toggle-btn option2'><h1>" . $choice2 . "</h1></button>";
  echo "      </div>";
  echo "      <input type='hidden' name='token' value='" . $_SESSION['token'] . "'>";
  echo "      <input type='hidden' name='date' value='" . $date . "'>"; // Corrected line
  echo "      <input type='hidden' name='item' value=''>";  // Corrected line
  echo "      <button type='submit' class='submitBtn'><h1>Submit</h1></button>";
  echo "    </form>";
  echo "  </div>";
  echo "</div>";
  }
} else {
  echo '<h1 style="color: #f3f4f5;">No results found.</h1>';
}

$conn->close();

?>
