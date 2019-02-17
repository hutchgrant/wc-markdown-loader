---
label: 'hello'
imports:
  Button: './button.js'
  HelloWorld: './hello-world.js'
  CSS: 'prismjs/themes/prism-dark.css'
---
# Hello World

This is an example component

```render js
var test = 'test';
```

```render
<hello-world label="world"></hello-world>
<my-button label="Hello World"></my-button>

<!-- Override default prism theme <style>${CSS}</style>
```
