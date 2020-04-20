'use strict';

const fs = require('fs');
const crypto = require('crypto');
const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');
const build = require('./build.js');
const parser = require('./parser.js');
const schema = require('./options.json');

/**
 * Main function
 * @param   {String}  content   Markdown file content
 */
module.exports = async function loader(content) {
  const callback = this.async();
  const options = getOptions(this) || {};
  const labelHash = {
    algo: 'sha256',
    trim: 15
  };
  let elementLabel = '';

  validateOptions(schema, options, 'wc-markdown-loader');
  const { graph, shadowRoot, preset, defaultStyle, customStyle } = options;

  if (Object.keys(options).length > 0 && graph) {
    // use preset graph
    const presetGraph = JSON.parse(fs.readFileSync(graph, 'utf8'));

    elementLabel = presetGraph.filter(page => page.filePath === this.resourcePath)[0].label;
  } else {
    // auto hash label
    const hash = crypto.createHash(labelHash.algo);

    hash.update(this.resourcePath || '');
    elementLabel = hash.digest('hex');
    const labelLength = elementLabel.length;
    elementLabel = elementLabel.substring(labelLength - labelHash.trim, labelLength);
  }


  const defaults = {
    label: elementLabel,
    defaultDOM: shadowRoot,
    preset,
    defaultStyle,
    customStyle
  };

  parser.parse(content, preset)
    .then(markdown => build(markdown, defaults))
    .then(component => callback(null, component))
    .catch(callback);
};
