const arrTabs = {
  "overview": document.querySelector('#overview'),
  "uploaded-courses": document.querySelector('#uploaded-courses'),
  "liked-courses": document.querySelector('#liked-courses'),
  "login": document.querySelector('#login'),
  "signup": document.querySelector('#signup'),
}

const arrLevelClass = document.querySelectorAll('.level');

let currentExpandedLevel;

for (let tab in arrTabs) {
  if (`/${tab}` !== window.location.pathname) continue;
  arrTabs[tab].classList.add('active-tab')
  break;
}

arrTabs.login.addEventListener('click', () => {
  window.location.replace('./login')
})

arrTabs.signup.addEventListener('click', () => {
  window.location.replace('./signup')
})
