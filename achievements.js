import * as achievementsData from "./achievements.json" with {type: 'json'}

/**
 * @typedef {Object} Achievement
 * @property {string} name User-facing name of the achievement
 * @property {string} iconType Type of the icon, either "emoji" or "image"
 * @property {string} icon Achievement icon, either an emoji character or image URL depending on the iconType
 * @property {string[]} description List of individual lines of text in the description
 */

/**
 * Retrieves an array of achievement IDs from localStorage. If the array doesn't exist or is invalid, it initializes it
 * as an empty array.
 * @param {string} arrayName Name of the array in localStorage
 * @returns {*[]} Array from localStorage
 */
export const getAchievementsIDArray = (arrayName) => {
  let arrayData = localStorage.getItem(arrayName)
  if (!arrayData) {
    arrayData = []
    localStorage.setItem(arrayName, JSON.stringify([]))
  } else {
    try {
      arrayData = JSON.parse(arrayData)
      if (!Array.isArray(arrayData)) {
        throw new Error(`${arrayName} is not an array`)
      }
    } catch {
      arrayData = []
      localStorage.setItem(arrayName, JSON.stringify([]))
    }
  }
  return arrayData
}

/**
 * Gets an array of earned achievement IDs from localStorage. Initializes the array if it doesn't exist or is invalid.
 * @returns {string[]}
 */
export const getEarnedAchievementIDs = () => {
  return getAchievementsIDArray("achievements")
}

/**
 * Gets an array of read achievement IDs from localStorage. Initializes the array if it doesn't exist or is invalid.
 * @returns {string[]}
 */
export const getReadAchievementIDs = () => {
  return getAchievementsIDArray("readAchievements")
}

/**
 * Gets an array of new achievement IDs from localStorage. Initializes the array if it doesn't exist or is invalid.
 * @returns {string[]}
 */
export const getNewAchievementIDs = () => {
  return getAchievementsIDArray("newAchievements")
}

/**
 * Awards the user an achievement. Notifies the user and updates the achievements pane.
 * @param {string} achievementID
 * @param {function} [onEarn] Callback to run after achievement is earned
 */
export const earnAchievement = (achievementID, onEarn) => {
  let achievements = getEarnedAchievementIDs()
  if (!achievements.includes(achievementID)) {
    achievements.push(achievementID)
    localStorage.setItem("achievements", JSON.stringify(achievements))

    let newAchievementIDs = getNewAchievementIDs()
    newAchievementIDs.push(achievementID)
    localStorage.setItem("newAchievements", JSON.stringify(newAchievementIDs))
    const achievement = getAchievementFromID(achievementID)
    if (achievement && onEarn) {
      onEarn(getAchievementFromID(achievementID))
    } else if (!achievement) {
      console.debug(`Achievement with ID ${achievementID} not found in achievements.json.`)
    }
  }
}

/**
 * Checks if the user has earned a specific achievement.
 * @param {string} achievementID ID of the achievement
 * @returns {boolean}
 */
export const isAchievementEarned = (achievementID) => {
  let achievements = getEarnedAchievementIDs()
  return achievements.includes(achievementID)
}

/**
 * Retrieves achievement data from achievements.json based on the provided achievement ID.
 * @param achievementID
 * @returns {Achievement}
 */
export const getAchievementFromID = (achievementID) => {
  return achievementsData.default["achievements"].find(a => a.id === achievementID)
}