import style from './style.css' with {type: 'css'};

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './style.css';

window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll', Math.min(0.9999, window.scrollY / window.innerHeight * 2))
}, false)

class PortfolioHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let template = document.getElementById("portfolio-header-template");
        let templateContent = template.content.cloneNode(true);

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(document.importNode(templateContent, true));

        shadowRoot.adoptedStyleSheets = [style];
        // shadowRoot.appendChild(link);
    }
}

customElements.define('portfolio-header', PortfolioHeader);