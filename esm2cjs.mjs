#!/usr/bin/env node

import fs from 'fs';
import glob from 'glob';
import lodash from 'lodash';
var {uniq} = lodash;
import nopt from 'nopt';
import path from 'path';

import expose from './expose';
var {__dirname} = expose; // eslint-disable-line no-shadow

import dir from '@jacksonrayhamilton/babel-cli/lib/babel/dir';

var knownOpts = {
  'watch': Boolean,
};
var shortHands = {
  'w': ['--watch'],
};
var cliArgs = nopt(knownOpts, shortHands);

var configFileContents = '';
try {
  configFileContents = fs.readFileSync('.esm2cjs', 'utf8').trim();
} catch (e) {
  // Ignore.
}
var configFileGlobs = [];
if (configFileContents) {
  configFileGlobs.push(...configFileContents.split('\n'));
}

var errors = [];

var filenames = configFileGlobs.reduce(function (globbed, input) {
  var files = glob.sync(input);
  if (!files.length) files = [input];
  return globbed.concat(files);
}, []);

filenames = uniq(filenames);

filenames.forEach(function (filename) {
  if (!fs.existsSync(filename)) {
    errors.push(filename + " doesn't exist.");
  }
});

if (errors.length) {
  process.stderr.write(errors.join(' ') + '\n');
  process.exit(2);
}

var babelProgramOpts = {
  extends: path.join(__dirname, '.babelrc'),
};

var babelCliArgs = {
  outDir: '.',
  extensions: '.mjs'
};
if (cliArgs.watch) {
  babelCliArgs.watch = true;
}

dir(babelCliArgs, filenames, babelProgramOpts);
