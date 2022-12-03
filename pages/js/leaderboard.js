function getTopUsers() {
  return fetch('../php/getleaderboard.php', {
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

async function populateLeaderboard() {
  const leaderboard_html = document.getElementById('menu');
  let leaderboard = await getTopUsers()
  for (let user of leaderboard['users']) {
    // populate stats
    const stat = document.createElement('input')
    stat.classList.add('menu-button');
    stat.readOnly = 'readonly';
    stat.placeholder = user['wins'] + ' - ' + user['username'];

    const data_html = document.createElement('td');
    data_html.appendChild(stat);
    const row_html = document.createElement('tr');
    row_html.appendChild(data_html);
    leaderboard_html.appendChild(row_html);
  }
}

/* <tr><td><input id="user-wins" class="menu-button loggedin" readonly="readonly"></td></tr> */
populateLeaderboard()