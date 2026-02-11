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
    <portfolio-entry>
      ${project.link ?
        `<a slot="link" href="${project.link}">${project.title}</a>` :
        `<span slot="link">${project.title}</span>`
      }
      <img slot="screenshot"
           src="${project.screenshot}"
           class="screenshot-img"
           alt=""/>
      ${project.description.map(paragraph => `<p slot="description">${paragraph}</p>`).join("")}
      ${project.github ?
        `<p slot="github-link" class="github-link">
            <a href="${project.github}"
            >View on GitHub
                <span class="github-link-image"></span>
            </a>
        </p>` :
        ""
      }
      <ul slot="technologies" class="technologies-icons">
         ${project.technologies
            .map(
              tech =>
                `<li><img src="${tech.icon}" alt="" /><span>${tech.name}</span></li>`
            )
            .join("")
          }
      </ul>
    </portfolio-entry>

      <!-- ${project.screenshot ?
        `<div class="portfolio-entry-item portfolio-screenshot">
          <img src="${project.screenshot}" alt="" />
        </div>` :
        ""
    } -->
  `;

    collaborativeProjects.appendChild(entryDiv);
})