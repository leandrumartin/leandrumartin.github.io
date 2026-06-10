const nightThreshold = 300

/**
 * Starts listener for ambient light sensor to attach glow effects to DOM elements.
 */
export const startAmbientLightEffects = () => {
  if ("AmbientLightSensor" in window) {
    const sensor = new AmbientLightSensor()
    sensor.addEventListener("reading", () => {
      if (sensor.illuminance <= nightThreshold) {
        enableSpotlight()
        enableGlow()
      } else {
        disableSpotlight()
        disableGlow()
      }
    })
    sensor.start()
  }
}

/**
 * Starts glow effect.
 */
const enableGlow = () => {
  document.querySelector("body").classList.add("glow-mode")
}

/**
 * Stops glow effect.
 */
const disableGlow = () => {
  document.querySelector("body").classList.remove("glow-mode")
}

/**
 * Handler for spotlight effect over cursor.
 */
const spotlightHandler = (event) => {
  document.documentElement.style.setProperty('--spotlight-x', event.clientX.toString() + 'px')
  document.documentElement.style.setProperty('--spotlight-y', event.clientY.toString() + 'px')
}

/**
 * Starts spotlight effect around cursor.
 */
const enableSpotlight = () => {
  window.addEventListener("mousemove", spotlightHandler)
  document.querySelector("#spotlight-overlay").style.display = "block"
}

/**
 * Stops spotlight effect around cursor.
 */
const disableSpotlight = () => {
  window.removeEventListener("mousemove", spotlightHandler)
  document.querySelector("#spotlight-overlay").style.display = "none"
}
