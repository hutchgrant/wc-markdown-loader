'use strict';

const fs = require('fs');
const path = require('path');
const build = require('../src/build.js');
const parser = require('../src/parser.js');

describe('Build Component', () => {
  let component = '';
  const mdFile = path.join(__dirname, '../demo/src/hello-world.md');

  beforeAll((done) => {
    fs.readFile(mdFile, 'utf8', (err, data) => {
      if (err) {
        return done(err);
      }

      const defaults = {
        label: 'testing',
        defaultDOM: true,
        defaultStyle: true,
        customStyle: ''
      };

      parser
        .parse(data)
        .then((html) => {
          component = build(html, defaults);
          done();
        })
        .catch(done);
    });
  });

  it('add LitElement import', () => {
    expect(component).toMatch(/import { LitElement, html } from 'lit-element';\n/);
  });

  it('add component imports', () => {
    expect(component).toMatch(/import Button from '.\/button.js';\n/);
    expect(component).toMatch(/import HelloWorld from '.\/hello-world.js';\n/);
  });

  it('exports the front-matter attributes', () => {
    expect(component).toMatch(/export const attributes = {"label":"hello"}/);
  });
});
