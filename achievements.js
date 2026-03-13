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

window.addEventListener('scroll', () => {
  let scrollTop = window.scrollY
  // Top of element is the parent element's top, plus the element's height, since the parent's height is 0 because the element is outside the normal flow
  let elementTop = achievementsPane.parentElement.getBoundingClientRect().top + achievementsPane.offsetHeight
  if (elementTop > scrollTop) {
    achievementsPane.style.position = "absolute"
    achievementsPane.style.top = "auto"
  } else {
    achievementsPane.style.position = "fixed"
    achievementsPane.style.top = "12.5vh"
  }
}, false)