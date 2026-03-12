let open = false
let achievementsPane = document.querySelector("#achievements-pane");

document.querySelector("#achievements-open-button").addEventListener("click", () => {
  open = !open
  console.log(open)
  if (open) {
    achievementsPane.style.transform = "none"
  } else {
    achievementsPane.style.transform = "translateX(calc(-100% + 2em + 2px))"
  }
})