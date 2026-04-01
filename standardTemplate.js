/**
 * Class representing a standard HTML template. Contains a method to link it to a template in the HTML, attach a shadow DOM, and link the CSS file.
 */
export class StandardTemplate extends HTMLElement {
  constructor() {
    super()
  }

  createTemplate(templateID) {
    let template = document.getElementById(templateID)
    let templateContent = template.content.cloneNode(true)

    const shadowRoot = this.attachShadow({mode: "open"})
    shadowRoot.appendChild(document.importNode(templateContent, true))

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = './style.css'
    shadowRoot.appendChild(link)
  }
}