import * as achievementsData from "./achievements.json" with {type: 'json'}

export const getEarnedAchievementIDs = () => {
  let achievements = localStorage.getItem("achievements")
  if (!achievements) {
    achievements = []
    localStorage.setItem("achievements", JSON.stringify([]))
  } else {
    try {
      achievements = JSON.parse(achievements)
      if (!Array.isArray(achievements)) {
        throw new Error("achievements is not an array")
      }
    } catch {
      achievements = []
      localStorage.setItem("achievements", JSON.stringify([]))
    }
  }
  return achievements
}

export const getReadAchievementIDs = () => {
  let readAchievements = localStorage.getItem("readAchievements")
  if (!readAchievements) {
    readAchievements = []
    localStorage.setItem("readAchievements", JSON.stringify([]))
  } else {
    try {
      readAchievements = JSON.parse(readAchievements)
      if (!Array.isArray(readAchievements)) {
        throw new Error("readAchievements is not an array")
      }
    } catch {
      readAchievements = []
      localStorage.setItem("readAchievements", JSON.stringify([]))
    }
  }
  return readAchievements
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