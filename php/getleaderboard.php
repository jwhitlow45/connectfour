<?php
include './dbconnect.php';

$conn = db_connect();

// Initialize the session
session_start();

// sql statement to get stats of a player
$sql = 'SELECT username, wins FROM stats ORDER BY wins DESC LIMIT 5';

if ($stmt = mysqli_prepare($conn, $sql)) {
    if (mysqli_stmt_execute($stmt)) {
        $top_users = [];
        $result = mysqli_stmt_get_result($stmt);
        while ($row = mysqli_fetch_row($result)) {
            array_push($top_users, ['username' => $row[0], 'wins' => $row[1]]);
        }
        $result = [
            'users' => $top_users
        ];
        echo json_encode($result);
    }
    mysqli_stmt_close($stmt);
}

?>