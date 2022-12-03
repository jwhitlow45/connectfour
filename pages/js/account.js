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
  const user_stats = document.getElementsByClassName('user-stats');
  for (let stat of user_stats) stat.hidden = 0;
  const user_welcome = document.getElementById('user-welcome');
  user_welcome.placeholder = await getUsername();
}

async function logout() {
  await fetch('../php/logout.php', {
    method: 'GET'
  });
  location.reload();
}

configureLoginPage();