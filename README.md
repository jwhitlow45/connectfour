# Connect Four
## Installation
* Start XAMPP, and ensure Apache and MySQL servers are both running their respective servers
* Copy the entire `connectfour/`  folder into the root of Apache's configured host location
* Create a file named `dbcredentials.ini` at `connectfour/php/` containing the following:
    ```
    # username and password must be changed to match your database credentials
    # default MySQL port is 3306, but this may vary between systems
    server=localhost
    username=<your-db-username>
    password=<your-db-password>
    dbname=connectfour
    port=3306
    ```
* Visit `localhost/connectfour` in your browser
* All databases will be created (if they do not already exist) upon registration, login, or visiting the 'Leaderboards' page.
## Timeline
* Git history can be found [here](https://github.com/jwhitlow45/connectfour/commits/main)

| Week        | Description |
| ----------- | ----------- |
| 10/17/2022  | Create main connect four game and add options to change colors and board size. Create menus and their themes. |
| 11/14/2022  | Implement 'flip' superpower and add menu animations. Move database credentials to gitignored ini file to prevent leaking credentials to github.  |
| 11/28/2022  | Add login system, registration system, stat tracking, leaderboard, help page, and contact page. Implement database fault tolerance. |
