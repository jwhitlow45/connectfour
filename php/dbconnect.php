<?php

function db_connect() {
    $db_params = parse_ini_file('/opt/lampp/htdocs/csci130/connectfour/php/dbcredentials.ini');

    define('DB_SERVER', $db_params['server']);
    define('DB_USERNAME', $db_params['username']);
    define('DB_PASSWORD', $db_params['password']);
    define('DB_NAME', $db_params['dbname']);
    define('DB_PORT', $db_params['port']);

    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);
    // flag false connection
    if ($conn == false) { die("ERROR: Could not connect. " . mysqli_connect_error()); }

    return $conn;
}

?>