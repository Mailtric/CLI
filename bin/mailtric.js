#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
\x1b[1m\x1b[Mailtric CLI\x1b[0m \x1b[90mv${pkg.version}\x1b[0m
${pkg.description}

\x1b[1mUsage:\x1b[0m
  $ mailtric [command] [options]

\x1b[1mCommands:\x1b[0m
  hello [name]       Print a welcome greeting from Mailtric
  version            Show CLI version
  help               Display this help message

\x1b[1mOptions:\x1b[0m
  -v, --version      Show CLI version
  -h, --help         Display this help message

\x1b[90mRepository: https://github.com/Mailtric/CLI\x1b[0m
`);
}

function printVersion() {
  console.log(pkg.version);
}

function printHello(name) {
  const target = name ? name : 'World';
  console.log(`\x1b[32m✔\x1b[0m Hello, ${target}! Welcome to \x1b[1m\x1b[36mMailtric\x1b[0m.`);
}

const command = args[0];

if (!command) {
  printHello();
  console.log(`\nRun \x1b[36mmailtric --help\x1b[0m to view available commands.`);
} else if (command === 'help' || args.includes('-h') || args.includes('--help')) {
  printHelp();
} else if (command === 'version' || args.includes('-v') || args.includes('--version')) {
  printVersion();
} else if (command === 'hello') {
  printHello(args[1]);
} else {
  console.error(`\x1b[31mError:\x1b[0m Unknown command "${command}"`);
  console.log(`Run \x1b[36mmailtric --help\x1b[0m to view available commands.`);
  process.exit(1);
}
