const logout_button = document.getElementById('logout');
logout_button.addEventListener('click', logout);

function configureLoginPage() {
  fetch('../php/loggedin.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    if (json == 0) {
      // show forms for registration and login if user is not logged in
      showForms();
    } else if (json == 1) {
      // show user stats if user is logged in
      displayUserStats();
    }
  }).catch((err) => {
    console.error(err);
  });
}

function showForms() {
  const forms = document.getElementsByClassName('loggedout');
  for (let form of forms)
    form.hidden = 0;
}

function getUsername() {
  return fetch('../php/getusername.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    return json;
  }).catch((err) => {
    console.error(err);
  });
}

async function displayUserStats() {
  // show user stats
  const user_stats = document.getElementsByClassName('user-stats');
  for (let stat of user_stats) stat.hidden = 0;

  const user_welcome = document.getElementById('user-welcome');
  const user_wins = document.getElementById('user-wins');
  const user_losses = document.getElementById('user-losses');
  const user_draws = document.getElementById('user-draws');
  const user_time_played = document.getElementById('user-time-played');

  user_welcome.placeholder = await getUsername();
  let stats = await getStats();
  // display user stats
  user_wins.placeholder = 'Wins: ' + stats['wins'];
  user_losses.placeholder = 'Losses: ' + stats['losses'];
  user_draws.placeholder = 'Draws: ' + stats['draws'];
  
  // calculate time in hour-minute-second format and display to user
  let seconds = stats['time_played'];
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  user_time_played.placeholder = `Time: ${hours}h${minutes}m${seconds}s`;
}

async function logout() {
  await fetch('../php/logout.php', {
    method: 'GET'
  });
  location.reload();
}

function getStats() {
  return fetch('../php/getstats.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    return json;
  }).catch((err) => {
    console.error(err);
  });
}

configureLoginPage();