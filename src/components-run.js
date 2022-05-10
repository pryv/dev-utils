#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');

const componentsPath = 'components';
const args = process.argv.slice(2);

if (args.length === 0) {
  logError('No command given');
  process.exit(1);
}

if (!fs.existsSync(componentsPath)) {
  logError(`${chalk.bold(componentsPath)} folder is missing`);
  process.exit(1);
}

let singleComponent = false;
if (process.env.COMPONENT && process.env.COMPONENT !== 'all') {
  singleComponent = process.env.COMPONENT;
}

let status = 0;
fs.readdirSync(componentsPath).forEach(function (name) {
  const subPath = path.join(componentsPath, name);
  if (!fs.existsSync(path.join(subPath, 'package.json'))) {
    return;
  }

  if (singleComponent && singleComponent !== name) {
    return;
  }

  console.log(`\n${chalk.green(formatHeading(name))}\n`);

  if (args.slice(1)[0] === 'mocha' && !singleComponent && !fs.existsSync(path.join(subPath, 'test'))) {
    console.log(`No ${chalk.bold('test')} folder, skipping`);
    return;
  }

  const res = childProcess.spawnSync(args[0], args.slice(1), {
    env: process.env,
    cwd: subPath,
    stdio: 'inherit'
  });

  if (res.error) {
    if (res.error.code === 'ENOENT') {
      logError(`Unknown command: ${args[0]}`);
    } else {
      logError(res.error);
    }
  }
  status += (res.status === null ? 1 : res.status);
});

process.exit(status);

function logError (message) {
  console.error(`${chalk.bold(chalk.red('Error'))}: ${message}`);
}

function formatHeading (text) {
  // = total available length - a space - the text
  const padLength = process.stdout.columns - 1 - text.length;
  return chalk.bold(text) + ' ' + '-'.repeat(padLength);
}
