import {StandardTemplate} from "./standardTemplate.js"
import * as achievementsData from "./achievements.json" with {type: 'json'}

let open = false
let achievementsButton = document.querySelector("#achievements-open-button")
let achievementsPane = document.querySelector("#achievements-pane")
let achievementsIcon = document.querySelector("#achievements-icon")
let soundEffect = new Audio("./sounds/tada.mp3")

achievementsButton.addEventListener("click", () => {
  open = !open
  if (open) {
    achievementsButton.style.backgroundColor = "var(--bg-primary-color)"
    achievementsPane.style.transform = "none"
    achievementsIcon.textContent = "⬇️"
  } else {
    achievementsButton.style.backgroundColor = "unset"
    achievementsPane.style.transform = "translateX(calc(-100% + var(--button-width) + var(--pane-border) - var(--pane-margin)))"
    achievementsIcon.textContent = "⬆️"
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
    achievementsPane.style.top = "calc(12.5vh - var(--pane-margin))"
  }
}, false)

const getAchievements = () => {
  let achievements = localStorage.getItem("achievements")
  if (!achievements) {
    achievements = []
    localStorage.setItem("achievements", JSON.stringify([]))
  } else {
    achievements = JSON.parse(achievements)
  }
  return achievements
}

class AchievementEntry extends StandardTemplate {
  constructor() {
    super()
  }

  connectedCallback() {
    super.createTemplate("achievement-entry-template")
  }
}

customElements.define('achievement-entry', AchievementEntry)

/**
 * Creates and inserts an achievement into the achievements pane.
 * @param name Name of the achievement to add
 */
const createAchievementItem = (name) => {

}

export const earnAchievement = (achievement) => {
  let achievements = getAchievements()
  if (!achievements.includes(achievement)) {
    achievements.push(achievement)
    localStorage.setItem("achievements", JSON.stringify(achievements))
    if (!open) {
      achievementsIcon.textContent = "❗"
    }
    soundEffect.play()
    console.log(`Achievement earned: ${achievement}`)
    const achievementListItem = document.createElement("div")
    achievementListItem.classList.add("achievement-item")
  }
}

export const isAchievementEarned = (achievement) => {
  let achievements = getAchievements()
  return achievements.includes(achievement)
}

achievementsData.default["achievements"].forEach(achievement => {
  const entryLI = document.createElement("li")
  entryLI.classList.add("achievement-entry", "button")

  let icon = document.createElement("span")
  icon.innerHTML = "🔒"
  if (isAchievementEarned(achievement.id)) {
    switch (achievement.iconType) {
      case "emoji":
        icon = document.createElement("span")
        icon.innerHTML = achievement.icon
        break
      case "image":
        icon = document.createElement("img")
        icon.src = achievement.icon
        break
    }
  }
  icon.setAttribute("slot", "icon")
  icon.classList.add("achievement-entry-icon")

  entryLI.innerHTML = `
    <achievement-entry>
      <span slot="title" class="achievement-entry-title">${isAchievementEarned(achievement.id) ? achievement.name : "?"}</span>
<!--      <span slot="description">${isAchievementEarned(achievement.id) ? achievement.description : "???"}</span>-->
      ${achievement.icon && icon.outerHTML}
    </achievement-entry>
  `

  const container = document.querySelector("#achievements-list")
  container.appendChild(entryLI)
})


const achievementsList = document.querySelector("#achievements-list")

const markTopRowAchievements = () => {
  const entries = Array.from(achievementsList.querySelectorAll("li.achievement-entry"))
  if (!entries.length) return

  // Find the smallest rendered top position (first grid row)
  const topMost = Math.min(...entries.map(entry => entry.offsetTop))

  for (const entry of entries) {
    // Tolerance helps avoid sub-pixel rounding issues
    const isTopRow = Math.abs(entry.offsetTop - topMost) < 2
    entry.classList.toggle("tooltip-below", isTopRow)
  }
}

// Run once after list is rendered
requestAnimationFrame(markTopRowAchievements)


window.addEventListener("resize", markTopRowAchievements)