import {earnAchievement} from "../achievements.js"

document.querySelector("#goose").addEventListener("click", () => {
  new Audio('/sounds/honk.mp3').play().catch((error) => {
    console.debug("Honk sound effect could not be played", error)
  })
  earnAchievement("sillyGoose")
})