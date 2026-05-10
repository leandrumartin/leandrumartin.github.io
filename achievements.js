import {StandardTemplate} from "./standardTemplate.js"
import * as achievementsData from "./achievements.json" with {type: 'json'}
import {makePositionSticky} from "./stickyPosition.js"

let open = false
let achievementsButton = document.querySelector("#achievements-open-button")
let achievementsPane = document.querySelector("#achievements-pane")
let achievementsIcon = document.querySelector("#achievements-icon")
let soundEffect = new Audio("./sounds/tada.mp3")
let achievementDetailsDialog = document.querySelector("#achievement-details-container")
let achievementDetailsTitle = document.querySelector("#achievement-title")
let achievementDetailsIcon = document.querySelector("#achievement-icon")
let achievementDetailsDescription = document.querySelector("#achievement-description")

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

makePositionSticky(
  achievementsPane,
  0.125 * document.documentElement.clientHeight - parseFloat(getComputedStyle(achievementsPane).getPropertyValue('--pane-margin')),
  "calc(12.5vh - var(--pane-margin))",
  () => 0.125 * document.documentElement.clientHeight - parseFloat(getComputedStyle(achievementsPane).getPropertyValue('--pane-margin'))
)

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
 * Clears the achievement details modal back to its default placeholder content.
 */
const resetAchievementDetailsModal = () => {
  achievementDetailsTitle.innerText = "?"
  achievementDetailsIcon.innerHTML = '<span class="achievement-entry-icon">🔒</span>'
  achievementDetailsDescription.innerHTML = "<p>???</p>"
}

achievementDetailsDialog.addEventListener("close", resetAchievementDetailsModal)

/**
 * Awards the user an achievement. Notifies the user and updates the achievements pane.
 * @param {string} achievementID
 */
export const earnAchievement = (achievementID) => {
  let achievements = getAchievements()
  if (!achievements.includes(achievementID)) {
    achievements.push(achievementID)
    localStorage.setItem("achievements", JSON.stringify(achievements))

    let entryElement = document.querySelector(`#achievement-${achievementID}`)

    // Notify user
    if (!open) {
      achievementsIcon.textContent = "❗"
      const achievementsOpenButton = document.querySelector("#achievements-open-button")
      achievementsOpenButton.classList.add("notification-flash")
      achievementsOpenButton.addEventListener("animationend", () => {
        achievementsOpenButton.classList.remove("notification-flash")
      })

    }
    entryElement.classList.add("notification-flash")
    entryElement.addEventListener("animationend", () => {
      entryElement.classList.remove("notification-flash")
    })
    soundEffect.play()

    fillAchievementItem(achievementsData.default["achievements"].find(a => a.id === achievementID), entryElement)

    iterateProgressMeter()
  }
}

/**
 * Checks if the user has earned a specific achievement.
 * @param {string} achievementID ID of the achievement
 * @returns {boolean}
 */
export const isAchievementEarned = (achievementID) => {
  let achievements = getAchievements()
  return achievements.includes(achievementID)
}

/**
 * Sets up icon based on whether it is an emoji or image file
 * @param {Object} achievement Object containing achievement data
 * @param {string} achievement.id Achievement ID
 * @param {string} achievement.name User-facing name of the achievement
 * @param {string} achievement.iconType Type of the icon, either "emoji" or "image"
 * @param {string} achievement.icon Achievement icon, either an emoji character or image URL depending on the iconType
 * @param {string[]} achievement.description List of individual lines of text in the description
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
        icon.alt = achievement.name
        break
    }
  }
  icon.setAttribute("slot", "icon")
  icon.classList.add("achievement-entry-icon")
  return icon
}

/**
 * Fills the achievement item in the achievement pane list with the appropriate data.
 * @param {Object} achievement Object containing achievement data
 * @param {string} achievement.id Achievement ID
 * @param {string} achievement.name User-facing name of the achievement
 * @param {string} achievement.iconType Type of the icon, either "emoji" or "image"
 * @param {string} achievement.icon Achievement icon, either an emoji character or image URL depending on the iconType
 * @param {string[]} achievement.description List of individual lines of text in the description
 * @param {HTMLLIElement} entryLiElement The <li> element to contain the data
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

const achievementsMeter = document.querySelector("#achievements-meter")
achievementsMeter.setAttribute("max", achievementsData.default["achievements"].length)

/**
 * Iterates the achievement progress meter by one.
 */
const iterateProgressMeter = () => {
  achievementsMeter.setAttribute("value", achievementsMeter.value + 1)
  const achievementsProgressText = `${achievementsMeter.value}/${achievementsMeter.max}`
  achievementsMeter.innerText = achievementsProgressText
  achievementsMeter.title = achievementsProgressText
}

// Add items to the achievements list for all available achievements
achievementsData.default["achievements"].forEach(achievement => {
  const entryLI = document.createElement("li")
  entryLI.classList.add("achievement-entry", "button", "tooltip-activator")
  entryLI.id = `achievement-${achievement.id}`

  fillAchievementItem(achievement, entryLI)

  // Set up details modal when achievement is clicked
  entryLI.addEventListener("click", () => {
    if (achievement.id === "curiousKitty") earnAchievement("curiousKitty")
    const updatedIcon = createIconElement(achievement)
    achievementDetailsTitle.innerText = isAchievementEarned(achievement.id) ? achievement.name : "?"
    achievementDetailsIcon.innerHTML = achievement.icon && updatedIcon.outerHTML
    achievementDetailsDescription.replaceChildren(
      ...isAchievementEarned(achievement.id)
        ? achievement.description.map(paragraph => {
          const paragraphElement = document.createElement("p")
          paragraphElement.innerHTML = paragraph
          return paragraphElement
        })
        : "???")
    achievementDetailsDialog.showModal()
  })

  const container = document.querySelector("#achievements-list")
  container.appendChild(entryLI)

  if (isAchievementEarned(achievement.id)) iterateProgressMeter(achievement)
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

let searchParams = new URLSearchParams(window.location.search)
if (searchParams.get("withAchievement") === "true") {
  earnAchievement("visitedWithAchievement")
}