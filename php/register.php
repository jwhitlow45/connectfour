<?php
include './dbconnect.php';

$conn = db_connect();

// empty values for username and password
$username = $password = $password_confirm = "";
$username_err = $password_err = $password_confirm_err = "";

// validate request method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // validate username
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter a username.";
    } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', trim($_POST["username"]))) { //alphanumeric regex that allows underscores
        $username_err = "Username can only contain letters, numbers, and underscores.";
    } else {
        // Prepare a select statement
        $sql = "SELECT id FROM users WHERE username = ?";
        if($stmt = mysqli_prepare($conn, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            // Set parameters
            $param_username = trim($_POST["username"]);
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                /* store result */
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){
                    $username_err = "This username is already taken.";
                } else{
                    $username = trim($_POST["username"]);
                }
            } else{
                echo json_encode("Something went wrong. Please try again later.");
            }
            // Close statement
            mysqli_stmt_close($stmt);
        }
    }

    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password.";     
    } elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "Password must have atleast 6 characters.";
    } else{
        $password = trim($_POST["password"]);
    }
    
    // Validate confirm password
    if(empty(trim($_POST["password-confirm"]))){
        $password_confirm_err = "Please confirm password.";     
    } else{
        $password_confirm = trim($_POST["password-confirm"]);
        if(empty($password_err) && ($password != $password_confirm)){
            $password_confirm_err = "Password did not match.";
        }
    }

    // Check input errors before inserting in database
    if(empty($username_err) && empty($password_err) && empty($password_confirm_err)){
        // Prepare an insert statement
        $sql_users = "INSERT INTO users (username, password) VALUES (?, ?)";
        $sql_stats = "INSERT INTO stats (username, wins, losses, draws, time_played) VALUES (?, 0, 0, 0, 0)";
        if(($stmt_users = mysqli_prepare($conn, $sql_users)) && ($stmt_stats = mysqli_prepare($conn, $sql_stats))) {
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt_users, "ss", $param_username, $param_password);
            mysqli_stmt_bind_param($stmt_stats, "s", $param_username);
            // Set parameters
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt_users) && mysqli_stmt_execute($stmt_stats)){
                // Redirect to login page
                echo json_encode("Succesfully created your account! Make sure to login!");
            } else {
                echo json_encode("Something went wrong. Please try again later.");
            }
            // Close statement
            mysqli_stmt_close($stmt_users);
            mysqli_stmt_close($stmt_stats);
        }
    } else {
        $error = '';
        // prioritize reporting of username error, then password errors
        if (!empty($username_err)) $error = $username_err;
        elseif (!empty($password_err)) $error = $password_err;
        elseif (!empty($password_confirm_err)) $error = $password_confirm_err;
        // redirect to account page using get request to report error
        echo json_encode($error);
    }
    // Close connection
    mysqli_close($conn);
}
