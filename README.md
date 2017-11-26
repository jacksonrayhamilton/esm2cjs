# esm2cjs

Easily compile ES modules to CommonJS modules with functionally equivalent
interfaces.

Given a file like `foo.mjs`:

```js
export default function foo () {}
```

Generates a file like `foo.js`:

```js
'use strict';
module.exports = function foo () {};
```

If that is your main module, in your `package.json`, you can do:

```json
{
  "main": "./foo"
}
```

Then, if Node supports modules and someone requires or imports your package,
then `foo.mjs` will be imported, and if Node doesn't support modules, then
`foo.js` will be imported instead.

What you're doing is shipping a native ES module (W00T the future is NOW) yet
still offering a fallback for not-yet-upgraded environments.

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

esm2cjs uses Babel 6 under the hood.  This means that if you want to use syntax
extensions (e.g. TC39 proposals, JSX, etc) in your code, you can do that by
adding a [`.babelrc`][] file to your project.

[`.babelrc`]: https://babeljs.io/docs/usage/babelrc/
