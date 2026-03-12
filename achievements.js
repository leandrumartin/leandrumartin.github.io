let open = false
let achievementsButton = document.querySelector("#achievements-open-button")
let achievementsPane = document.querySelector("#achievements-pane")

achievementsButton.addEventListener("click", () => {
  open = !open
  if (open) {
    achievementsButton.style.backgroundColor = "var(--bg-primary-color)"
    achievementsPane.style.transform = "none"
  } else {
    achievementsButton.style.backgroundColor = "unset"
    achievementsPane.style.transform = "translateX(calc(-100% + var(--button-width) + var(--pane-border) - var(--pane-margin)))"
  }
})