window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
  document.body.style.setProperty('--scroll-full', Math.min(window.scrollY))
}, false)

if (Math.random() < 0.1) {
    let cookieNotice = document.createElement('div')
    cookieNotice.id = 'cookie-notice'
    cookieNotice.innerHTML = `
      <p>
        We do not use cookies to enhance your browsing experience. By clicking "OK," you consent to our non-use of cookies.
      </p>
      <button id="cookie-notice-dismiss" class="button" onclick="document.getElementById('cookie-notice').style.display='none'">OK</button>
    `
    document.body.appendChild(cookieNotice)
}