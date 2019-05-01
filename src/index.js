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

  if (Object.keys(options).length > 0 && options.graph) {
    // use preset graph
    const graph = JSON.parse(fs.readFileSync(options.graph, 'utf8'));

    elementLabel = graph.filter(page => page.filePath === this.resourcePath)[0].label;
  } else {
    // auto hash label
    const hash = crypto.createHash(labelHash.algo);

    hash.update(this.resourcePath || '');
    elementLabel = hash.digest('hex');
    const labelLength = elementLabel.length;
    elementLabel = elementLabel.substring(labelLength - labelHash.trim, labelLength);
  }
  parser.parse(content)
    .then(markdown => build(markdown, elementLabel))
    .then(component => callback(null, component))
    .catch(callback);
};
