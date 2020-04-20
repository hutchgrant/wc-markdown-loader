'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('../src/parser.js');

describe('Parse Markdown', () => {
  let mdExample = '';
  const mdFile = path.join(__dirname, '../demo/src/hello-world.md');

  beforeAll((done) => {
    fs.readFile(mdFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }

      mdExample = data;
      done();
    });
  });

  it('extracts front matter from markdown', () => {
    const result = parser.parseFrontMatter(mdExample);
    expect(result).toHaveProperty('attributes');
    expect(result).toHaveProperty('body');
  });

  it('front matter attributes should contain imports object', () => {
    const result = parser.parseFrontMatter(mdExample);
    expect(result.attributes).toHaveProperty('imports');
    expect(result.attributes.imports).toBeInstanceOf(Object);
    expect(result.attributes.imports).toEqual({ Button: './button.js', HelloWorld: './hello-world.js' });
  });

  it('parses markdown with live code blocks', () => {
    parser.parse(mdExample).then((result) => {
      expect(result.html).toMatch(/<hello-world label="world"><\/hello-world>\s*<my-button label="Hello World"><\/my-button>\s*/);
    });
  });

  it('parses markdown and created valid html for JSX', () => {
    parser.parse('![](myImage.png)').then((result) => {
      expect(result.html).toEqual('<p><img src=\"myImage.png\"></p>\n');
    });
  });

  it('provides the front-matter attributes', () => {
    parser.parse(mdExample).then((result) => {
      expect(result.attributes).toHaveProperty('label', 'hello');
    });
  });
});

describe('Syntax Highlighting', () => {
  let codeExample = '';
  const mdFile = path.join(__dirname, '../demo/src/code_example.md');

  beforeAll((done) => {
    fs.readFile(mdFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }

      codeExample = data;
      done();
    });
  });

  it('example code blocks have run and source code', async () => {
    const result = await parser.parse(codeExample);

    expect(result.html).toMatch('<pre><code class="hljs language-js">example</code></pre>');
  });
});
