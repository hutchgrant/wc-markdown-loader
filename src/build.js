'use strict';

const camelize = require('camelize');
const except = require('except');

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Builds the LitElement Web Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */

module.exports = function build(markdown, defaults) {
  const { defaultDOM, defaultStyle, customStyle, label } = defaults;
  const imports = markdown.attributes.imports || {};
  const js = markdown.html;

  let doImports = 'import { LitElement, html } from \'lit-element\';\n';
  const lightDOM = `
  createRenderRoot() {
    return this;
  }`;

  if (customStyle) {
    doImports += `import custom from '${customStyle}';\n`;
  }

  if (defaultStyle) {
    doImports += 'import css from \'prismjs/themes/prism-twilight.css\';\n';
  }

  const style = `
  <style>
  ${defaultStyle ? '${css}' : ''}
  ${customStyle ? '${custom}' : ''}
  </style>
  `;

  const frontMatterAttributes = except(markdown.attributes, 'imports');

  // eslint-disable-next-line no-restricted-syntax
  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`;
    }
  }

  return `
${doImports}

export const attributes = ${JSON.stringify(camelize(frontMatterAttributes))};
class Component extends LitElement {
  render(){
    return html \`
      ${style}
      <div>
        ${js}
      </div>
      \`;
  }
  ${defaultDOM === false ? lightDOM : ''}
};
customElements.define('wc-md-${markdown.attributes.label || label}', Component);
`;
};
