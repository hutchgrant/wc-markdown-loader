'use strict';

const fs = require('fs');
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
  let elementLabel = '';

  validateOptions(schema, options, 'wc-markdown-loader');

  if (Object.keys(options).length > 0 && options.graph.length > 0) {
    const graph = JSON.parse(fs.readFileSync(options.graph, 'utf8'));
    elementLabel = graph.filter(page => page.filePath === this.resourcePath)[0].label;
  }
  parser.parse(content)
    .then(markdown => build(markdown, elementLabel))
    .then(component => callback(null, component))
    .catch(callback);
};
