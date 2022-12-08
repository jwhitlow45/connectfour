function getTopUsers() {
  return fetch('../php/getleaderboardinit.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).catch((err) => {
    console.error(err);
  });
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

async function createLeaderboardEntry(username, current_username, value, category) {
  const stat = document.createElement('input')
  stat.classList.add('menu-button');
  stat.classList.add('leaderboard-entry');
  stat.readOnly = 'readonly';
  const leaderboard_html = document.getElementById('menu');

  stat.placeholder = value + ' - ' + username;
  if (username == current_username) {
    stat.style.backgroundColor = 'yellow';
  }

  const data_html = document.createElement('td');
  data_html.appendChild(stat);
  const row_html = document.createElement('tr');
  row_html.appendChild(data_html);

  const category_div = document.getElementById(category.replace('_', '-') + '-container');
  category_div.appendChild(row_html);
}

async function populateLeaderboard() {

  function createHeader(title) {
    const stat = document.createElement('input')
    stat.id = (title.replace(' ', '-') + '-header');
    stat.classList.add('menu-button');
    stat.classList.add('leaderboard-header');
    stat.setAttribute('ascend', '0');
    stat.readOnly = 'readonly';
    const leaderboard_html = document.getElementById('menu');
  
    stat.placeholder = title;
        
    const data_html = document.createElement('td');
    data_html.appendChild(stat);
    const row_html = document.createElement('tr');
    row_html.appendChild(data_html);
    leaderboard_html.appendChild(row_html);

    const category_div = document.createElement('div');
    category_div.id = title.replace(' ', '-') + '-container';
    leaderboard_html.appendChild(category_div);
  }

  function createHeaderEventListeners() {
    // add appropriate event listeners to leaderboard headers
    const leaderboard_headers = document.getElementsByClassName('leaderboard-header');
    for (let header of leaderboard_headers) {
      let category = header.placeholder;
      category = category.toLowerCase().replace(' ', '-'); // format to match category
      header.addEventListener('click', function() { toggleCategorySort(category) });
    }
  }
  
  const categories = ['wins', 'losses', 'draws', 'time_played'];

  let current_username = await getUsername();
  let leaderboard = await getTopUsers()
  for (let cat of categories) {
    createHeader(cat.replace('_', ' '));
    for (let user of leaderboard[cat]) {

      let value;

      // if current category is time played then format to hour-min-sec time
      if (cat ==  categories[3]) {
        let seconds = user['value'];
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        value = `${hours}h${minutes}m${seconds}s`
      } else {
        value = user['value'];
      }

      await createLeaderboardEntry(user['username'], current_username, value, cat);
    }
  }

  createHeaderEventListeners();
}

async function sortCategory(category, isAscend) {
  let formData = new FormData();
  formData.append('category', category);
  formData.append('ascend', isAscend);

  let results = await fetch('../php/getleaderboardcategory.php', {
    method: 'POST',
    body: formData
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).catch((err) => {
    console.error(err);
  });

  category = category.replace('_', '-');
  const category_container = document.getElementById(category + '-container');
  category_container.innerHTML = '';

  for (let result of results) {
    createLeaderboardEntry(result['username'], await getUsername(), result['value'], category);
  }
}

async function toggleCategorySort(category) {
  let header = document.getElementById(category + '-header');
  let ascend = parseInt(header.getAttribute('ascend'));

  category = category.replace('-', '_');
  if (ascend) {
    await sortCategory(category, 0);
    header.setAttribute('ascend', '0');
  } else {
    await sortCategory(category, 1);
    header.setAttribute('ascend', '1');
  }
}

populateLeaderboard()
