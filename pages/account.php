<!DOCTYPE html>
<html>
  <head>
    <meta lang="en">
    <meta charset="utf-8">
    <link rel="stylesheet" href="./css/account.css">
    <link rel="stylesheet" href="./../index.css">
    <title>Connect 4 - Account</title>
  </head>
  <body>
    <div id="title">Account</div>
    <form action="./../php/login.php" class="loggedout" method="POST" hidden="1">
      <table id="menu">
        <tr><td><input name="username" type="text" class="menu-button" placeholder="username"></td></tr>
        <tr><td><input name="password" type="password" class="menu-button" placeholder="password"></td></tr>
        <tr><td><input type="submit" value="Login" class="menu-button"></input></td></tr>
      </table>
    </form>
    <form action="./../php/register.php" class="loggedout" method="POST" hidden="1">
      <table id="menu" class="register">
        <tr><td><input name="username" type="text" class="menu-button" placeholder="username"></td></tr>
        <tr><td><input name="password" type="password" class="menu-button" placeholder="password"></td></tr>
        <tr><td><input name="password-confirm" type="password" class="menu-button" placeholder="confirm password"></td></tr>
        <tr><td><input type="submit" value="Register" class="menu-button"></input></td></tr>
      </table>
    </form>
    <form class="user-stats" hidden="1">
      <table id="menu">
        <tr><td><input id="user-welcome" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-wins" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-losses" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-draws" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-time-played" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="logout" class="menu-button loggedin" readonly="readonly" placeholder="Logout"></td></tr>
      </table>
    </form>
    <div><a href="../index.html"><img id="back-button" src="../img/back.webp"></a></div>
    <?php
      session_start();
      function alertString($message) {
        return '<script>alert("' . $message . '")</script>';
      }
      if (isset($_GET['message'])) {
        if ($_GET['message'] == 'success')
          echo alertString('Your account has been registerd!');
        elseif ($_GET['message'] == 'failure')
          echo alertString($_GET['error']);
      }
    ?>
    <script src="./js/account.js"></script>
  </body>
</html>