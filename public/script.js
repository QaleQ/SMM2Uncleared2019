const tabsArr = {
  "overview": document.querySelector('#overview'),
  "levels": document.querySelector('#levels'),
  "filter": document.querySelector('#filter'),
  "login": document.querySelector('#login'),
  "signup": document.querySelector('#signup'),
}

const classLevelArr = document.querySelectorAll('.level');

let currentExpandedLevel;

for (let tab in tabsArr) {
  tabsArr[tab].addEventListener('click', () => {
    window.location.replace(`./${tab}`)
  })
  if (`/${tab}` !== window.location.pathname) continue;
  tabsArr[tab].classList.add('active-tab')
}

// tabsArr.login.addEventListener('click', () => {
//   window.location.replace('./login')
// })

// tabsArr.signup.addEventListener('click', () => {
//   window.location.replace('./signup')
// })
