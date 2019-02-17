import { html, LitElement } from 'lit-element';
import './hello-world.md';
import './goodbye-world.md';

class AppComponent extends LitElement {

  render() {
    return html`
      <wc-md-hello></wc-md-hello>
      <wc-md-goodbye></wc-md-goodbye>
    `;
  }
}

customElements.define('eve-app', AppComponent);