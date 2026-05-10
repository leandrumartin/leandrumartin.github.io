import * as data from './portfolio_entries.json' with {type: 'json'}
import {earnAchievement} from './achievements.js'
import {StandardTemplate} from "./standardTemplate.js"

let searchParams = new URLSearchParams(window.location.search)
if (searchParams.get("withAchievement") === "true") {
  earnAchievement("visitedWithAchievement")
}

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

class PortfolioEntry extends StandardTemplate {
  constructor() {
    super()
  }

  connectedCallback() {
    super.createTemplate("portfolio-entry-template")
  }
}

customElements.define('portfolio-entry', PortfolioEntry)

/**
 * Parses projects from the JSON and add them to the container.
 * @param {string} projects Key of the projects in the JSON
 * @param {HTMLElement} container Element to add the projects to
 */
const addProjects = (projects, container) => {
  data.default[projects].forEach((project, index) => {
    const entryDiv = document.createElement("div")
    entryDiv.classList.add("portfolio-entry")

    entryDiv.innerHTML = `
      <portfolio-entry>
        ${project.link ?
          `<a slot="link" href="${project.link}">${project.title}</a>` :
          `<span slot="link">${project.title}</span>`
        }
        ${project.screenshot && `
          <div slot="screenshot" class="portfolio-entry-item portfolio-screenshot opens-modal" style="display: none;">
            <img src="${project.screenshot}"
                 class="screenshot-img"
                 alt=""
                 onload="this.parentElement.style.display = 'block'"
                 />
          </div>
        `}
        ${project.description.map(paragraph => `<p slot="description">${paragraph}</p>`).join("")}
        ${project.github && `
          <p slot="github-link" class="github-link">
            <a href="${project.github}"
            >View on GitHub
                <span class="github-link-image"></span>
            </a>
          </p>
        `}
        <ul slot="technologies" class="technologies-icons">
        ${project.technologies
          .map(
            tech =>
              `<li class="tooltip-activator tooltip-below"><img src="${tech.icon}" alt="${tech.name}" /><span class="tooltip">${tech.name}</span></li>`
          )
          .join("")
        }
        </ul>
      </portfolio-entry>
    `

    if (index > 0) {
      container.appendChild(document.createElement("hr"))
    }
    container.appendChild(entryDiv)
  })
}

const collaborativeProjects = document.getElementById('collaborative-projects')
addProjects("collaborativeProjects", collaborativeProjects)
const individualProjects = document.getElementById('inserted-individual-projects')
addProjects("individualProjects", individualProjects)

document.querySelectorAll(".screenshot-img").forEach((img) => {
  const screenshotModal = document.querySelector("#expanded-screenshot-container")

  const imgElement = document.createElement("img")
  imgElement.src = img.src

  img.addEventListener("click", (e) => {
    screenshotModal.querySelector("#expanded-screenshot").replaceChildren(imgElement)
    screenshotModal.showModal()
  })
})

window.addEventListener("deviceorientation", (event) => {
  let topLink = document.querySelector("#top-link")
  topLink.style.transform = `rotate(${-event.gamma}deg)`
})