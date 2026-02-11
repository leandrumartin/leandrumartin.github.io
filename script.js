import * as data from './portfolio_entries.json' with {type: 'json'};
import style from './style.css' with {type: 'css'};

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './style.css';

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
  document.body.style.setProperty('--scroll-full', Math.min(window.scrollY))
}, false)

if (Math.random() < 0.1) {
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

class PortfolioEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let template = document.getElementById("portfolio-entry-template");
        let templateContent = template.content.cloneNode(true);

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(document.importNode(templateContent, true));

        shadowRoot.adoptedStyleSheets = [style];
        // shadowRoot.appendChild(link);
    }
}

customElements.define('portfolio-entry', PortfolioEntry);

const collaborativeProjects = document.getElementById('collaborative-projects');
const individualProjects = document.getElementById('individual-projects');

data.default.collaborativeProjects.forEach((project) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("portfolio-entry");

    entryDiv.innerHTML = `
    <div class="portfolio-header-section">
      <div class="portfolio-entry-item portfolio-header">
        <h3>
          ${project.link ?
        `<a href="${project.link}">${project.title}</a>` :
        project.title
    }
        </h3>
      </div>
      ${project.screenshot ?
        `<div class="portfolio-entry-item portfolio-screenshot">
          <img src="${project.screenshot}" alt="" />
        </div>` :
        ""
    }
    </div>
    <div class="portfolio-description portfolio-entry-item">
      ${project.description.map(paragraph => `<p>${paragraph}</p>`).join("")}
      ${project.github ?
        `<p class="github-link">
      <a href="${project.github}">View on GitHub</a>
    </p>` :
        ""
    }
      <ul class="technologies-icons">
        ${project.technologies
        .map(
            tech =>
                `<li><img src="${tech.icon}" alt="" /><span>${tech.name}</span></li>`
        )
        .join("")}
      </ul>
    </div>
  `;

    collaborativeProjects.appendChild(entryDiv);
})