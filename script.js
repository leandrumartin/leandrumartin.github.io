import {earnAchievement} from './achievements.js'

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
  document.body.style.setProperty('--scroll-full', Math.min(window.scrollY))
  if (window.scrollY >= document.body.scrollHeight - window.innerHeight) {
    earnAchievement("scrolledToBottom")
  }
}, false)

const date = new Date()
if (Math.random() < 0.1 || (date.getMonth() === 3 && date.getDate() === 1)) {
  let cookieNotice = document.createElement('div')
  cookieNotice.id = 'cookie-notice'
  cookieNotice.className = 'overlay'
  cookieNotice.innerHTML = `
    <p>
      We do not use cookies to enhance your browsing experience. By clicking "OK," you consent to our non-use of cookies.
    </p>
    <button id="cookie-notice-dismiss" class="button" onclick="document.getElementById('cookie-notice').style.display='none'">OK</button>
  `
  document.body.appendChild(cookieNotice)
}

window.addEventListener("deviceorientation", (event) => {
  let topLink = document.querySelector("#top-link")
  topLink.style.transform = `rotate(${-event.gamma}deg)`
})