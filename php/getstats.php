<?php
include './dbconnect.php';

$conn = db_connect();

// Initialize the session
session_start();

// sql statement to get stats of a player
$sql = 'SELECT * FROM stats WHERE username=?';

if ($stmt = mysqli_prepare($conn, $sql)) {
    // Bind variables to the prepared statement as parameters
    mysqli_stmt_bind_param($stmt, "s", $username);
    // Set parameters
    $username = $_SESSION['username'];
    if (mysqli_stmt_execute($stmt)) {
        mysqli_stmt_bind_result($stmt, $username, $wins, $losses, $draws, $time_played);
        mysqli_stmt_fetch($stmt);
        $result = [
            'username' => $username,
            'wins' => $wins,
            'losses' => $losses,
            'draws' => $draws,
            'time_played' => $time_played
        ];
        echo json_encode($result);
    }
    mysqli_stmt_close($stmt);
}

?>