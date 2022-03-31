const tabsArr = {
  "overview": document.querySelector('#overview'),
  "levels": document.querySelector('#levels'),
  "filter": document.querySelector('#filter'),
  "login": document.querySelector('#login'),
  "signup": document.querySelector('#signup'),
  "logout": document.querySelector('#logout'),
  "user": document.querySelector('#user')
}

const classLevelArr = document.querySelectorAll('.level');
let currentExpandedLevel;

for (let tab in tabsArr) {
  if (!tabsArr[tab]) continue;
  let tabUrl = `/${tab}`;
  tabsArr[tab].addEventListener('click', () => {
    window.location.replace(tabUrl);
  })
  if (tabUrl !== window.location.pathname) continue;
  tabsArr[tab].classList.add('active-tab');
}

for (let level of classLevelArr) {
  level.addEventListener('click', () => {
    expandLevel(level, currentExpandedLevel);
  })
}

function expandLevel(newLevel, oldLevel = null) {
  if (newLevel === oldLevel) return;
  let childNode = newLevel.querySelector('#expandable');
  childNode.classList.add('expand')
  if (oldLevel)
    oldLevel.querySelector('#expandable').classList.remove('expand');
  currentExpandedLevel = newLevel;
}
