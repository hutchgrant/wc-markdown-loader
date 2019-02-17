import { html, LitElement } from 'lit-element';

class HelloWorld extends LitElement {

  static get properties() {
    return {
      label: String
    };
  }

  render() {
    return html`
    <div>Hello ${this.label}</div>`;
  }
}

customElements.define('hello-world', HelloWorld);