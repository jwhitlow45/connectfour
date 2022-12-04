<?php

include './dbconnect.php';

$conn = db_connect();
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // determine which column needs to be updated
    $statement = '';
    if ($_GET['result'] == -1) $statement = 'draws=draws+1';
    else if ($_GET['result'] == 0) $statement = 'wins=wins+1';
    else if ($_GET['result'] == 1) $statement = 'losses=losses+1';

    $sql = 'UPDATE stats SET ' . $statement . ', time_played=time_played+? WHERE username = ?';
    if ($stmt = mysqli_prepare($conn, $sql)) {
        // Bind variables to the prepared statement as parameters
        mysqli_stmt_bind_param($stmt, "ss", $_GET['time'], $_SESSION['username']);

        // Attempt to execute the prepared statement
        if (!mysqli_stmt_execute($stmt)) {
            echo "Something went wrong. Please try again later.";
        }
    }
}

?>