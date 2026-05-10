/**
 * Adds a scroll event listener to an element to simulate sticky positioning, having it stick to some offset off the
 * top of the screen after scrolling past a certain point.
 * @param element {HTMLElement} The element to make sticky
 * @param top {int} The offset from the top of the window, in pixels, where the element should stick
 * @param topRule {string} The CSS rule to apply to the element's top property when it is in sticky mode (e.g. "15px")
 */
export const makePositionSticky = (element, top, topRule) => {
  window.addEventListener('scroll', () => {
    if (element.parentElement.getBoundingClientRect().top > top) {
      element.style.position = "absolute"
      element.style.top = "auto"
    } else {
      element.style.position = "fixed"
      element.style.top = topRule
    }
  }, {
    passive: true
  })
}