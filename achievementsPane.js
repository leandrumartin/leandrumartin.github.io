import {makePositionSticky} from "./stickyPosition.js"
import * as achievementsData from "./achievements.json" with {type: 'json'}
import {
  earnAchievement,
  isAchievementEarned,
  getReadAchievementIDs,
  getAchievementFromID,
  getNewAchievementIDs
} from "./achievements.js"
import {StandardTemplate} from "./standardTemplate.js"

/**
 * @typedef {Object} Achievement
 * @property {string} name User-facing name of the achievement
 * @property {string} iconType Type of the icon, either "emoji" or "image"
 * @property {string} icon Achievement icon, either an emoji character or image URL depending on the iconType
 * @property {string[]} description List of individual lines of text in the description
 */

let open = false
let achievementsButton = document.querySelector("#achievements-open-button")
let achievementsPane = document.querySelector("#achievements-pane")
let achievementsIcon = document.querySelector("#achievements-icon")
let soundEffect = new Audio("./sounds/tada.mp3")
let achievementDetailsDialog = document.querySelector("#achievement-details-container")
let achievementDetailsTitle = document.querySelector("#achievement-title")
let achievementDetailsIcon = document.querySelector("#achievement-icon")
let achievementDetailsDescription = document.querySelector("#achievement-description")
const achievementsList = document.querySelector("#achievements-list")
const achievementsMeter = document.querySelector("#achievements-meter")

/**
 * Flashes the achievements button if the pane is closed.
 */
const flashAchievementsOpenButton = () => {
  if (!open) {
    achievementsIcon.textContent = "❗"
    const achievementsOpenButton = document.querySelector("#achievements-open-button")
    achievementsOpenButton.classList.add("notification-flash")
    achievementsOpenButton.addEventListener("animationend", () => {
      achievementsOpenButton.classList.remove("notification-flash")
    }, {once: true})
  } else {
    console.debug("Achievements pane is already open; did not give notification flash")
  }
}

/**
 * Notifies the user of a new achievement.
 * @param {Achievement} achievement Object containing achievement data
 */
const notifyOfAchievement = (achievement) => {
  let entryElement = document.querySelector(`#achievement-${achievement.id}`)
  flashAchievementsOpenButton()
  if (entryElement) {
    entryElement.classList.add("notification-flash")
    entryElement.addEventListener("animationend", () => {
      entryElement.classList.remove("notification-flash")
    })
  }
  soundEffect.play().catch((error) => {
    console.debug("Achievement sound effect could not be played", error)
  })
}

/**
 * Updates the Achievements pane when a new achievement has been earned.
 * @param {Achievement} achievement Object containing achievement data
 */
export const updatePaneOnEarnAchievement = (achievement) => {
  let entryElement = document.querySelector(`#achievement-${achievement.id}`)

  notifyOfAchievement(achievement)
  fillAchievementItem(achievement, entryElement)
  iterateProgressMeter()

  let readAchievements = getReadAchievementIDs()
  if (!readAchievements.includes(achievement.id)) {
    entryElement.classList.add("achievement-unread")
  }

  if (open) {
    localStorage.setItem("newAchievements", JSON.stringify([]))
  }
}

class AchievementEntry extends StandardTemplate {
  constructor() {
    super()
  }

  connectedCallback() {
    super.createTemplate("achievement-entry-template")
  }
}

/**
 * Clears the achievement details modal back to its default placeholder content.
 */
const resetAchievementDetailsModal = () => {
  achievementDetailsTitle.innerText = "?"
  achievementDetailsIcon.innerHTML = '<span class="achievement-entry-icon">🔒</span>'
  achievementDetailsDescription.innerHTML = "<p>???</p>"
}

/**
 * Sets up icon based on whether it is an emoji or image file
 * @param {Achievement} achievement Object containing achievement data
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
 * @param {Achievement} achievement Object containing achievement data
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

/**
 * Iterates the achievement progress meter by one.
 */
const iterateProgressMeter = () => {
  achievementsMeter.setAttribute("value", achievementsMeter.value + 1)
  const achievementsProgressText = `${achievementsMeter.value}/${achievementsMeter.max}`
  achievementsMeter.innerText = achievementsProgressText
  achievementsMeter.title = achievementsProgressText
}

/**
 * Marks the achievements in the top row so their tooltips appear below them instead of above.
 */
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

customElements.define('achievement-entry', AchievementEntry)

achievementDetailsDialog.addEventListener("close", resetAchievementDetailsModal)

achievementsMeter.setAttribute("max", achievementsData.default["achievements"].length)

achievementsButton.addEventListener("click", () => {
  open = !open
  if (open) {
    achievementsButton.style.backgroundColor = "var(--bg-primary-color)"
    achievementsPane.style.transform = "none"
    achievementsIcon.textContent = "⬇️"
    localStorage.setItem("newAchievements", JSON.stringify([]))
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

// Add items to the achievements list for all available achievements
let readAchievements = getReadAchievementIDs()
achievementsData.default["achievements"].forEach(achievement => {
  const entryLI = document.createElement("li")
  entryLI.classList.add("achievement-entry", "button", "tooltip-activator")
  entryLI.id = `achievement-${achievement.id}`

  if (!readAchievements.includes(achievement.id) && isAchievementEarned(achievement.id)) {
    entryLI.classList.add("achievement-unread")
  }

  fillAchievementItem(achievement, entryLI)

  // Set up details modal when achievement is clicked
  entryLI.addEventListener("click", () => {
    if (achievement.id === "curiousKitty") earnAchievement("curiousKitty", updatePaneOnEarnAchievement)
    const updatedIcon = createIconElement(achievement)
    achievementDetailsTitle.innerText = isAchievementEarned(achievement.id) ? achievement.name : "?"
    achievementDetailsIcon.innerHTML = achievement.icon && updatedIcon.outerHTML
    achievementDetailsDescription.replaceChildren(
      ...(isAchievementEarned(achievement.id)
        ? achievement.description.map(paragraph => {
          const paragraphElement = document.createElement("p")
          paragraphElement.innerHTML = paragraph
          return paragraphElement
        })
        : ["???"]))
    achievementDetailsDialog.showModal()

    let readAchievements = getReadAchievementIDs()
    if (isAchievementEarned(achievement.id) && !readAchievements.includes(achievement.id)) {
      readAchievements.push(achievement.id)
      localStorage.setItem("readAchievements", JSON.stringify(readAchievements))
      entryLI.classList.remove("achievement-unread")
    }
  })

  const container = document.querySelector("#achievements-list")
  container.appendChild(entryLI)

  if (isAchievementEarned(achievement.id)) iterateProgressMeter(achievement)
})

// Run once after list is rendered
requestAnimationFrame(markTopRowAchievements)

window.addEventListener("resize", markTopRowAchievements)


getNewAchievementIDs().forEach((achievementID) => {
  const achievement = getAchievementFromID(achievementID)
  if (achievement) notifyOfAchievement(achievement)
})

let searchParams = new URLSearchParams(window.location.search)
if (searchParams.get("withAchievement") === "true") {
  earnAchievement("visitedWithAchievement", updatePaneOnEarnAchievement)
}