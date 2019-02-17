Web Component Markdown Loader
==================

[![npm version](https://img.shields.io/npm/v/wc-markdown-loader.svg)](https://www.npmjs.com/package/wc-markdown-loader)
[![build status](https://travis-ci.org/hutchgrant/wc-markdown-loader.svg?branch=master)](https://travis-ci.org/javiercf/wc-markdown-loader)
[![dependencies Status](https://david-dm.org/hutchgrant/wc-markdown-loader/status.svg)](https://david-dm.org/javiercf/wc-markdown-loader)
[![devDependencies Status](https://david-dm.org/hutchgrant/wc-markdown-loader/dev-status.svg)](https://david-dm.org/hutchgrant/wc-markdown-loader?type=dev)

Webpack loader that parses markdown files and converts them to Web Components.
It will also parse FrontMatter to import dependencies and render components
along with it’s source code.

This loader is a modified fork from [javiercf/react-markdown-loader](https://github.com/javiercf/react-markdown-loader) and can easily be used in conjunction with [Create-Evergreen-App](https://github.com/ProjectEvergreen/create-evergreen-app)

## Usage

In the FrontMatter you should import the components you want to render
with the component name as a key and it's path as the value.  Use the label key to indicate the unique name you want to register the markdown files as which you can then load in your app as `<wc-md-hello />` for example.

```markdown
---
label: 'hello'
imports:
  Button: './button.js'
  GoodbyeWorld: './hello-world.js'
```

*webpack.config.js*
```js
module: {
  loaders: [
    {
      test: /\.md$/,
      loader: 'wc-markdown-loader'
    }
  ]
}
```

*hello-world.js*
```js
import { html, LitElement } from 'lit-element';

class HelloWorld extends LitElement {

  static get properties() {
    return {
      label: String
    };
  }
  render() {
    return html `<div>Hello ${this.label}</div>`;
  }
}

customElements.define('hello-world', HelloWorld);

```
In the markdown File add the *render* tag to code fenceblocks you want the
loader to compile as Components this will output the rendered component.

*hello-world.md*

<pre>

---
label: 'hello'
imports:
  HelloWorld: './hello-world.js'
---
# Hello World

This is an example component rendered from markdown

```render
&lt;hello-world label="world"&gt;&lt;/hello-world&gt;
```

This is an example code block rendered with syntax highlighter

```render html
&lt;!-- This will only render in prism syntax highlighter -->
&lt;!-- You can override this style, see ./demo/hello-world.md --&gt;
&lt;hello-world label="world"&gt;&lt;/hello-world&gt;
```

</pre>

*app.js*

The component you want to render your new markdown webcomponent

```js
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
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

## License

MIT (c) 2019
