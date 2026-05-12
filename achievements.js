import * as achievementsData from "./achievements.json" with {type: 'json'}

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

export const getEarnedAchievementIDs = () => {
  return getAchievementsIDArray("achievements")
}

export const getReadAchievementIDs = () => {
  return getAchievementsIDArray("readAchievements")
}

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
    if (onEarn) onEarn(getAchievementFromID(achievementID))
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

export const getAchievementFromID = (achievementID) => {
  return achievementsData.default["achievements"].find(a => a.id === achievementID)
}