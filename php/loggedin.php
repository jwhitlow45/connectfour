<?php
session_start();
if (isset($_SESSION['loggedin']))
    echo $_SESSION['loggedin'];
else echo 0;
?>