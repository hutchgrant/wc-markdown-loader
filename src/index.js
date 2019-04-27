'use strict';

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

  try {
    if (Object.keys(options).length > 0 && options.graph.length > 0) {
      elementLabel = await parser.parseElementLabel(options.graph, this.resourcePath);
    }
    const markdown = await parser.parse(content);
    const component = build(markdown, elementLabel);
    return callback(null, component);
  } catch (err) {
    return callback(err);
  }
};
