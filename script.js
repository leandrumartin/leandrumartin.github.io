window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
  document.body.style.setProperty('--scroll-full', Math.min(window.scrollY))
}, false)

