import { html, LitElement } from 'lit-element';

class GoodbyeWorld extends LitElement {

  static get properties() {
    return {
      label: String
    };
  }

  render() {
    return html`<div>Goodbye ${this.label}</div>`;
  }
}

customElements.define('goodbye-world', GoodbyeWorld);