# esm2cjs

Easily compile ES modules to CommonJS modules with functionally equivalent
interfaces.

Given a file like `foo.mjs`:

```js
export default function foo () {}
```

Generate a file like `foo.js`:

```js
'use strict';
function foo () {}
module.exports = foo;
```

If that is your main module, in your `package.json`, you can do:

```json
{
  "main": "./foo"
}
```

Then, if Node supports modules and someone imports your package, then `import
'foo'` will load `foo.mjs`, and if Node doesn't support modules, then
`require('foo')` will load `foo.js` instead.

Now you can distribute a native ES module _and_ offer a fallback for
not-yet-upgraded, CommonJS-only environments.

## Usage

Install it: `npm i -D esm2cjs`

Run it: `npx esm2cjs`

Continuously rebuild: `npx esm2cjs --watch` (shorthand: `npx esm2cjs -w`)

Call it in your package's `prepare` task so it always runs right before you
publish a release, ensuring that your ".js" files are up-to-date with your
".mjs" files:

```
{
  "scripts": {
    "prepare": "esm2cjs"
  }
}
```

You can specify which files will be compiled by adding a `.esm2cjs` file to your
package root.  This file contains a newline-delimited list of file globs, e.g. a
`.esm2cjs` file like:

```
*.mjs
bin/cli.mjs
```

Would compile this directory:

```
directory/
├── index.mjs
└── bin/
    └── cli.mjs
```

Into this:

```
directory/
├── index.js
├── index.mjs
└── bin/
    ├── cli.js
    └── cli.mjs
```

## Extending

esm2cjs uses Babel 6 under the hood, so if you want to use syntax extensions
(e.g. TC39 proposals, JSX, etc) in your code, you can do that by adding a
[`.babelrc`][] file to your project.

[`.babelrc`]: https://babeljs.io/docs/usage/babelrc/
