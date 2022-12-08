<?php
include './dbconnect.php';


// Initialize the session
session_start();

function getTopUsers($category) {
    $conn = db_connect();
    $sql = 'SELECT username, ' . $category . ' FROM stats ORDER BY ' . $category . ' DESC LIMIT 5';

    if ($stmt = mysqli_prepare($conn, $sql)) {
        $top_users = [];
        if (mysqli_stmt_execute($stmt)) {
            $result = mysqli_stmt_get_result($stmt);
            while ($row = mysqli_fetch_row($result)) {
                array_push($top_users, ['username' => $row[0], 'value' => $row[1]]);
            }
        }
        mysqli_stmt_close($stmt);
        return $top_users;
    }
}

$categories = ['wins', 'losses', 'draws', 'time_played'];
$leaderboards = [];
foreach ($categories as $cat) {
    $leaderboards[$cat] = getTopUsers($cat);
}

echo json_encode($leaderboards);

?>