import * as data from './portfolio_entries.json' with {type: 'json'};

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
}, false)

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