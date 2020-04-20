/* eslint-disable no-async-promise-executor */
'use strict';

const frontMatter = require('front-matter');
const htmlRehype = require('rehype-stringify');
const raw = require('rehype-raw');
const rehypePrism = require('@mapbox/rehype-prism');
const remarkParse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const report = require('vfile-reporter');
const unified = require('unified');

/**
 * Parse Markdown to HTML
 * @param   {MarkdownObject} markdown - Markdown attributes and body
 * @returns {HTMLObject}                HTML and imports
 */
function parseMarkdown(markdown, preset = {}) {
  return new Promise(async (resolve, reject) => {
    let convertedHtml;
    const settings = preset.settings ? preset.settings : {};

    try {
      unified()
        .use(remarkParse, settings)
        .use(remark2rehype, { allowDangerousHtml: true })
        .use(raw)
        .use(rehypePrism)
        .use(preset)
        .use(htmlRehype)
        .process(markdown.body, (err, file) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(report(err));
          }
          convertedHtml = String(file);
        });

      return resolve({ html: convertedHtml, attributes: markdown.attributes });
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * Extract FrontMatter from markdown
 * and return a separate object with keys
 * and a markdown body
 * @param   {String} markdown - Markdown string to be parsed
 * @returns {MarkdownObject}    Markdown attributes and body
 */
function parseFrontMatter(markdown) {
  return frontMatter(markdown);
}

/**
 * Parse markdown, extract the front matter
 * and return the body and imports
 * @param  {String} markdown - Markdown string to be parsed
 * @returns {HTMLObject}       HTML and imports
 */
function parse(markdown, preset) {
  return parseMarkdown(parseFrontMatter(markdown), preset);
}

module.exports = {
  parse,
  parseFrontMatter,
  parseMarkdown
};
