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
 * Awards the user an achievement. Notifies the user and updates the achievements pane.
 * @param achievementID
 */
export const earnAchievement = (achievementID) => {
  let achievements = getAchievements()
  if (!achievements.includes(achievementID)) {
    achievements.push(achievementID)
    localStorage.setItem("achievements", JSON.stringify(achievements))

    // Notify user
    if (!open) {
      achievementsIcon.textContent = "❗"
    }
    soundEffect.play()
    const achievementsOpenButton = document.querySelector("#achievements-open-button")
    achievementsOpenButton.classList.add("achievement-flash")
    achievementsOpenButton.addEventListener("animationend", () => {
      achievementsOpenButton.classList.remove("achievement-flash")
    })

    fillAchievementItem(achievementsData.default["achievements"].find(a => a.id === achievementID), document.querySelector(`#achievement-${achievementID}`))
  }
}

/**
 * Checks if the user has earned a specific achievement.
 * @param achievementID String ID of the achievement
 * @returns {boolean}
 */
export const isAchievementEarned = (achievementID) => {
  let achievements = getAchievements()
  return achievements.includes(achievementID)
}

/**
 * Sets up icon based on whether it is an emoji or image file
 * @param achievement Object containing achievement data
 * @returns {HTMLSpanElement | HTMLImageElement} Element containing achievement icon
 */
const createIconElement = (achievement) => {
  let icon = document.createElement("span")
  icon.innerHTML = "🔒" // default
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
  return icon
}

/**
 * Fills the achievement item in the achievement pane list with the appropriate data.
 * @param achievement Object containing achievement data
 * @param entryLiElement The <li> element to contain the data
 */
const fillAchievementItem = (achievement, entryLiElement) => {
  const icon = createIconElement(achievement)

  entryLiElement.innerHTML = `
    <achievement-entry>
      <span slot="title" class="achievement-entry-title tooltip">${isAchievementEarned(achievement.id) ? achievement.name : "?"}</span>
      ${achievement.icon && icon.outerHTML}
    </achievement-entry>
  `
}

// Add items to the achievements list for all available achievements
achievementsData.default["achievements"].forEach(achievement => {
  const entryLI = document.createElement("li")
  entryLI.classList.add("achievement-entry", "button", "tooltip-activator")
  entryLI.id = `achievement-${achievement.id}`

  fillAchievementItem(achievement, entryLI)

  // Set up details modal when achievement is clicked
  const detailsModal = document.querySelector("#achievement-details-container")
  entryLI.addEventListener("click", (e) => {
    const updatedIcon = createIconElement(achievement)
    detailsModal.querySelector("#achievement-title").innerText = isAchievementEarned(achievement.id) ? achievement.name : "?"
    detailsModal.querySelector("#achievement-icon").innerHTML = achievement.icon && updatedIcon.outerHTML
    detailsModal.querySelector("#achievement-description").innerHTML = isAchievementEarned(achievement.id) ? achievement.description : "???"
    detailsModal.showModal()
  })

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