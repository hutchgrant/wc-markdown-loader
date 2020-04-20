'use strict';

const frontMatter = require('front-matter');
const unified = require('unified');
const remarkParse = require('remark-parse');
const htmlStringify = require('remark-html');
const report = require('vfile-reporter');
const highlight = require('remark-highlight.js');

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
      const parser = unified()
        .use(remarkParse, settings)
        .use(highlight)
        .use(preset)
        .use(htmlStringify);

      convertedHtml = String(await parser.process(markdown.body));

      return resolve({ html: convertedHtml, attributes: markdown.attributes });
    } catch (err) {
      console.log(report(err));
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
