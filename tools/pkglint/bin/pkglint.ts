#!/usr/bin/env node
import path = require('path');
import yargs = require('yargs');
import { findPackageJsons, ValidationRule } from '../lib';

// tslint:disable:no-shadowed-variable
const argv = yargs
  .usage('$0 [directory]')
  .option('fix', { type: 'boolean', alias: 'f', desc: 'Fix package.json in addition to reporting mistakes'})
  .argv;

// Our version of yargs doesn't support positional arguments yet
argv.directory = argv._[0];

argv.directory = path.resolve(argv.directory || '.', process.cwd());

async function main(): Promise<void> {
  const ruleClasses = require('../lib/rules');
  const rules: ValidationRule[] = Object.keys(ruleClasses).map(key => new ruleClasses[key]()).filter(obj => obj instanceof ValidationRule);

  const pkgs = findPackageJsons(argv.directory);

  rules.forEach(rule => pkgs.filter(pkg => pkg.shouldApply(rule)).forEach(pkg => rule.prepare(pkg)));
  rules.forEach(rule => pkgs.filter(pkg => pkg.shouldApply(rule)).forEach(pkg => rule.validate(pkg)));

  if (argv.fix) {
    pkgs.forEach(pkg => pkg.applyFixes());
  }

  pkgs.forEach(pkg => pkg.displayReports(argv.directory));

  if (pkgs.some(p => p.hasReports)) {
    throw new Error('Some package.json files had errors');
  }
}

main().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
