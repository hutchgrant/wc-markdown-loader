Web Component Markdown Loader
==================

[![npm version](https://img.shields.io/npm/v/wc-markdown-loader.svg)](https://www.npmjs.com/package/wc-markdown-loader)
[![build status](https://travis-ci.com/hutchgrant/wc-markdown-loader.svg?branch=master)](https://travis-ci.com/hutchgrant/wc-markdown-loader)
[![dependencies Status](https://david-dm.org/hutchgrant/wc-markdown-loader/status.svg)](https://david-dm.org/hutchgrant/wc-markdown-loader)
[![devDependencies Status](https://david-dm.org/hutchgrant/wc-markdown-loader/dev-status.svg)](https://david-dm.org/hutchgrant/wc-markdown-loader?type=dev)

Webpack loader that parses markdown files and converts them to Web Components.
It will also parse FrontMatter to import dependencies and render components
along with it’s source code.

This loader is a modified fork from [javiercf/react-markdown-loader](https://github.com/javiercf/react-markdown-loader) and can easily be used in conjunction with [Create-Evergreen-App](https://github.com/ProjectEvergreen/create-evergreen-app). It's still in the early stages and contributions are welcome.

## Install

```bash
npm i --save-dev wc-markdown-loader
npm i prismjs
```

Prism is required within your application for syntax highlighting. By default, we're using the twilight theme. You can override that as well.

## Usage

In the FrontMatter you should import the components you want to render
with the component name as a key and it's path as the value.  Use the label key to indicate the unique name you want to register the markdown files as which you can then load in your app as `<wc-md-hello />` for example.

```markdown
---
label: 'hello'
imports:
  Button: './button.js'
  HelloWorld: './hello-world.js'
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

class AppComponent extends LitElement {

  render() {
    return html`
      <wc-md-hello></wc-md-hello>
    `;
  }
}

customElements.define('eve-app', AppComponent);
```

## Advanced Options

### LightDOM

If you want to disable shadowRoot and instead heave your markdown component render in the root node, you can add the following to your webpack config.

*webpack.config.js*
```js
module: {
  rules: [
    {
      test: /\.md$/,
      loader: 'wc-markdown-loader',
      options: {
        shadowRoot: false
      }
    }
  ]
}
```

This is if you need to manipulate this component from a parent component etc.

### Custom Style

If you want to set a global custom style to use for your markdown components, you can do so from your webpack config. Keep in mind that this is relative to the working directory. You may need to use a `path.join(__dirname, 'mypath/mypath.css')`.  The example below demonstrates a prism theme from `node_modules/prismjs/themes/`.

*webpack.config.js*
```js
module: {
  rules: [
    {
      test: /\.md$/,
      loader: 'wc-markdown-loader',
      options: {
        defaultStyle: false,
        customStyle: 'prismjs/themes/prism-funky.css'
      }
    }
  ]
}
```

**note**: You can toggle the defaultStyle as well, it will have a lower specificity than the customStyle.

### Graph

If you want to pre-scaffold an application with a graph of all md files paths and add your own generated labels(removing the need to cite label in each of the file's front-matter), you can create a graph array, write the serialized json to a cache file, then add the path of that .json file to the options of the loader e.g.

graph.json file:

```js
[
  {
    "filePath": "/home/user/workspace/app/src/pages/mypage.md"
    "label": "some-generated-label-asjhfkawa"
  },
  {
    "filePath": "/home/user/workspace/app/src/pages/myotherpage.md"
    "label": "some-generated-label-jkhkdsfskwad"
  }
]
```


*webpack.config.js*
```js
module: {
  rules: [
    {
      test: /\.md$/,
      loader: 'wc-markdown-loader',
      options: {
        graph: path.join(__dirname, 'graph.json')
      }
    }
  ]
}
```

Note: this is overridden if a .md file contains the label variable, at the top, in front-matter.

Markdown pages that do not contain a `label` front-matter variable, and without any graph added to loader options, will be defined using the last 15 characters of a sha256 hash of the file's resource path, as well as prepended with wc-md-. e.g. `<wc-md-4e53214c7f8108e></wc-md-4e53214c7f8108e>`.

**All compiled md component labels are automatically prefixed with `wc-md-`  for example: `<wc-md-hello-world></wc-md-hello-world>`**

This advanced usage is useful for example if you need to know the element name for a [lit-redux-route](https://github.com/fernandopasik/lit-redux-router) and don't want to pre-label every single md file.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

## License

MIT (c) 2019