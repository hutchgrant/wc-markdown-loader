import { html, LitElement } from 'lit-element';

class ButtonComponent extends LitElement {

  static get properties() {
    return {
      label: String
    };
  }
  render() {
    return html `<button>${this.label}</button>`;
  }
}

customElements.define('my-button', ButtonComponent);