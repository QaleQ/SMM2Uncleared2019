const arrTabClass = document.querySelectorAll('.tab');
const logInButton = document.querySelector('#login');
const signUpButton = document.querySelector('#signup');
const arrLevelClass = document.querySelectorAll('.level');

let currentExpandedLevel;

for (let div of arrTabClass) {
  div.addEventListener('click', () => {
    changeActiveTab(div);
  })
}

logInButton.addEventListener('click', () => {
  window.location.replace('./login')
})

signUpButton.addEventListener('click', () => {
  window.location.replace('./signup')
})

function changeActiveTab(newTab) {
  for (let div of arrTabClass) {
    if (div == newTab) {
      div.classList.add('active-tab');
      continue;
    }
    div.classList.remove('active-tab');
  }
}
