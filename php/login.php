<?php

include './dbconnect.php';

$conn = db_connect();

// Initialize the session
session_start();

// redirect to account page if logged in
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: ../pages/account.php?message=loggedin");
    exit;
}

// Define variables and initialize with empty values
$username = $password = "";
$username_err = $password_err = $login_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if username is empty
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter username.";
    } else {
        $username = trim($_POST["username"]);
    }

    // Check if password is empty
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validate credentials
    if (empty($username_err) && empty($password_err)) {
        // Prepare a select statement
        $sql = "SELECT id, username, password FROM users WHERE username = ?";
        echo $sql;
        if ($stmt = mysqli_prepare($conn, $sql)) {
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Set parameters
            $param_username = $username;

            // Attempt to execute the prepared statement
            if (mysqli_stmt_execute($stmt)) {
                // Store result
                mysqli_stmt_store_result($stmt);

                // Check if username exists, if yes then verify password
                if (mysqli_stmt_num_rows($stmt) == 1) {
                    // Bind result variables
                    mysqli_stmt_bind_result($stmt, $id, $username, $hashed_password);
                    if (mysqli_stmt_fetch($stmt)) {
                        if (password_verify($password, $hashed_password)) {
                            // Password is correct, so start a new session
                            session_start();

                            // Store data in session variables
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;
                            // Redirect user to account page
                            header('location: ../pages/account.php?message=loggedin');
                        } else {
                            // Password is not valid, display a generic error message
                            $login_err = "Invalid username or password.";
                        }
                    }
                } else {
                    // Username doesn't exist, display a generic error message
                    $login_err = "Invalid username or password.";
                }
            } else {
                $error = 'Something went wrong. Please try again later.';
                header('location: ../pages/account.php?message=failure&error=' . $error);
            }

            // Close statement
            mysqli_stmt_close($stmt);
        }
    }

    // check for errors
    $error = '';
    if (!empty($username_err)) $error = $username_err;
    elseif (!empty($password_err)) $error = $password_err;
    elseif (!empty($login_err)) $error = $login_err;

    // report error if one occured
    if (!empty($error))
        header('location: ../pages/account.php?message=failure&error=' . $error);

    // Close connection
    mysqli_close($conn);
}
?>