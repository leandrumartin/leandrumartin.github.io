import * as data from './portfolio_entries.json' with {type: 'json'}
import {StandardTemplate} from "./standardTemplate.js"

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
          `<li class="tooltip-activator tooltip-below"><img src="${tech.icon}" alt="${tech.name}" /><span class="tooltip" popover="hint">${tech.name}</span></li>`
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

/**
 * Adds event listeners to elements with tooltips.
 * @param {HTMLElement} tooltipActivator Element with an associated tooltip to add the listeners to
 * @param {HTMLElement} tooltip The element acting as the tooltip
 */
const addPopoverEventListeners = (tooltipActivator, tooltip) => {
  tooltipActivator.addEventListener("mouseover", () => {
    tooltip.showPopover({source: tooltipActivator})
  })

  tooltipActivator.addEventListener("mouseout", () => {
    tooltip.hidePopover()
  })

  tooltipActivator.addEventListener("focus", () => {
    tooltip.showPopover({source: tooltipActivator})
  })

  tooltipActivator.addEventListener("blur", () => {
    tooltip.hidePopover()
  })
}

document.querySelectorAll(".tooltip-activator").forEach((activator) => {
  const tooltip = activator.querySelector(".tooltip")
  addPopoverEventListeners(activator, tooltip)
  console.log(activator, tooltip)
})
