let arrTabClass = document.querySelectorAll('.tab');
let arrLevelClass = document.querySelectorAll('.level')

let currentExpandedLevel;

for (let div of arrTabClass) {
  div.addEventListener('click', () => {
    changeActiveTab(div);
  })
  console.log(div)
}


function changeActiveTab(newTab) {
  for (let div of arrTabClass) {
    if (div == newTab) {
      div.classList.add('tab-selected');
      continue;
    }
    div.classList.remove('tab-selected');
  }
}
