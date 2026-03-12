let open = false
let achievementsPane = document.querySelector("#achievements-pane");

document.querySelector("#achievements-open-button").addEventListener("click", () => {
  open = !open
  console.log(open)
  if (open) {
    achievementsPane.style.left = 0
  } else {
    achievementsPane.style.left = "calc(-100%)"
  }
})