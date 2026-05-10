export const makePositionSticky = (element, top, topRule) => {
  window.addEventListener('scroll', () => {
    if (element.parentElement.getBoundingClientRect().top > top) {
      element.style.position = "absolute"
      element.style.top = "auto"
    } else {
      element.style.position = "fixed"
      element.style.top = topRule
    }
  }, false)
}