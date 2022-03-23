let arrTabClass = document.querySelectorAll('.tab');
let logInButton = document.querySelector('.login');
let signUpButton = document.querySelector('.signup');
let arrLevelClass = document.querySelectorAll('.level');

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
