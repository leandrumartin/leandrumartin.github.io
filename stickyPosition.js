/**
 * Adds a scroll event listener to an element to simulate sticky positioning, having it stick to some offset off the
 * top of the screen after scrolling past a certain point.
 * @param {HTMLElement} element The element to make sticky
 * @param {number} top The offset from the top of the window, in pixels, where the element should stick
 * @param {string} topRule The CSS rule to apply to the element's top property when it is in sticky mode (e.g. "15px")
 * @param [topCalculationCallback] A function to recalculate the top offset when the user scrolls, if the
 *   top offset is not constant. The function should return the new top offset in pixels.
 */
export const makePositionSticky = (element, top, topRule, topCalculationCallback) => {
  let isSticky = false
  const update = () => {
    if (topCalculationCallback) {
      top = topCalculationCallback()
    }

    if (element.parentElement.getBoundingClientRect().top > top) {
      if (isSticky) {
        element.style.position = "absolute"
        element.style.top = "auto"
        isSticky = false
      }
    } else if (!isSticky) {
      element.style.position = "fixed"
      element.style.top = topRule
      isSticky = true
    }
  }

  update()
  window.addEventListener('scroll', () => {
    update()
  }, {
    passive: true
  })
}