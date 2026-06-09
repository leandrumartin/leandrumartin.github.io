const nightThreshold = 300

/**
 * Starts listener for ambient light sensor to attach glow effects to DOM elements.
 */
export const startAmbientLightEffects = () => {
  if ("AmbientLightSensor" in window) {
    const sensor = new AmbientLightSensor()
    sensor.addEventListener("reading", () => {
      if (sensor.illuminance <= nightThreshold) {
        enableGlow()
      } else {
        disableGlow()
      }
    })
    sensor.start()
  }
}

const enableGlow = () => {
  document.querySelector("body").classList.add("glow-mode")
}

const disableGlow = () => {
  document.querySelector("body").classList.remove("glow-mode")
}