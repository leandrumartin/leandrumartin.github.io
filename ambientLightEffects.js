const nightThreshold = 300

/**
 * Starts listener for ambient light sensor to attach glow effects to DOM elements.
 */
export const startAmbientLightEffects = () => {
  if (!window.isSecureContext || !("AmbientLightSensor" in window)) return

  try {
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
    sensor.addEventListener("error", () => {
      disableSpotlight()
      disableGlow()
    })
    sensor.start()
  } catch {
    // Sensor blocked/unavailable at runtime (e.g., permission denied)
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
const spotlightHandler = (() => {
  let rafId = 0
  let lastX = 0
  let lastY = 0

  return (event) => {
    lastX = event.clientX
    lastY = event.clientY

    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      rafId = 0
      document.documentElement.style.setProperty('--spotlight-x', `${lastX}px`)
      document.documentElement.style.setProperty('--spotlight-y', `${lastY}px`)
    })
  }
})()

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
