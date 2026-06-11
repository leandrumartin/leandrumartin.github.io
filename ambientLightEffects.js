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
        setFlashlightStrength(sensor.illuminance)
        enableFlashlight()
        enableGlow()
      } else {
        disableFlashlight()
        disableGlow()
      }
    })
    sensor.addEventListener("error", () => {
      disableFlashlight()
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
  if (!document.querySelector("body").classList.contains("glow-mode")) {
    document.querySelector("body").classList.add("glow-mode")
  }
}

/**
 * Stops glow effect.
 */
const disableGlow = () => {
  if (document.querySelector("body").classList.contains("glow-mode")) {
    document.querySelector("body").classList.remove("glow-mode")
  }
}

/**
 * Handler for flashlight effect over cursor.
 */
const flashlightHandler = (() => {
  let rafId = 0
  let lastX = 0
  let lastY = 0

  return (event) => {
    lastX = event.clientX
    lastY = event.clientY

    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      rafId = 0
      document.documentElement.style.setProperty('--flashlight-x', `${lastX}px`)
      document.documentElement.style.setProperty('--flashlight-y', `${lastY}px`)
    })
  }
})()

/**
 * Starts flashlight effect around cursor.
 */
const enableFlashlight = () => {
  window.addEventListener("mousemove", flashlightHandler)
  document.querySelector("#flashlight-overlay").style.display = "block"
}

/**
 * Stops flashlight effect around cursor.
 */
const disableFlashlight = () => {
  window.removeEventListener("mousemove", flashlightHandler)
  document.querySelector("#flashlight-overlay").style.display = "none"
}

/**
 * Sets the strength of the cursor flashlight effect based on the illuminance.
 */
const setFlashlightStrength = (illuminance) => {
  window.requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--flashlight-strength', (1 - illuminance / nightThreshold).toString())
  })
}