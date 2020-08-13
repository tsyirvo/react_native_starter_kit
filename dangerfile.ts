/* eslint-disable import/no-extraneous-dependencies */

import { danger, warn, schedule } from 'danger';
import todos from 'danger-plugin-todos';
import jest from 'danger-plugin-jest';
import includes from 'lodash/includes';
import * as fs from 'fs';
// @ts-expect-error
import recurseSync from 'recursive-readdir-sync';

/* ***** *****  Danger setup  ***** ***** */

const { pr } = danger.github;
const modified = danger.git.modified_files;
const created = danger.git.created_files;

/* ***** *****  Custom matchers  ***** ***** */

const typescriptReactOnly = (file: string) => includes(file, '.tsx');
const filesOnly = (file: string) =>
  fs.existsSync(file) && fs.lstatSync(file).isFile();
const configOnlyFilter = (filename: string) =>
  includes(filename, 'detoxrc') ||
  includes(filename, 'eslint') ||
  includes(filename, 'pretierrc') ||
  includes(filename, 'travis') ||
  includes(filename, '.babel.config') ||
  includes(filename, 'commitlint') ||
  includes(filename, 'dangerFile') ||
  includes(filename, 'jest.config') ||
  includes(filename, 'tsconfig');
const componentsOnlyFilter = (filename: string) =>
  includes(filename, 'src/components') &&
  !includes(filename, '__stories__') &&
  !includes(filename, '__tests__') &&
  !includes(filename, '__mocks__') &&
  typescriptReactOnly(filename);
const breakingOnlyFilter = (filename: string) =>
  includes(filename, 'src/ios') ||
  includes(filename, 'src/android') ||
  includes(filename, 'package.json');

const allSrcFiles = recurseSync('./src');
const allStoryFiles = allSrcFiles.filter(
  (f: string) => f.includes('__stories__/') && f.includes('.story.')
);
const prFiles = modified.concat(created).filter(filesOnly);

/* ***** *****  Utils  ***** ***** */

const getFilesName = (filenames: string[]) =>
  filenames.map((f: string) => {
    const match = f.match(/([^/\\]+\.\w+)$/);
    const name = match && match[1].split('.')[0];

    if (!name || name.length === 0) {
      return null;
    }
    return name;
  });

/* ***** *****  Check for jest errors  ***** ***** */

jest();

/* ***** *****  Check for specific keywords  ***** ***** */

// Using schedule because this is an async task
schedule(
  todos({
    ignore: ['CHANGELOG.md', /tests/, /stories/],
    keywords: ['TODO', 'FIXME', 'TO-DO', 'TO-FIX'],
  })
);

/* ***** *****  Ask for a title & description  ***** ***** */

if (pr.body.length < 10) {
  warn('Please include a description of your PR changes.');
}

/* ***** *****  Check if tests have been forgotten  ***** ***** */

const prSrcChanges = prFiles.some((p) => includes(p, 'src/'));
const prTestChanges = prFiles.some((p) => includes(p, '__tests__/'));

if (prSrcChanges && !prTestChanges) {
  warn(
    'This PR does not include changes to tests, even though it affects app code.'
  );
}

/* ***** *****  Check if stories have been forgotten  ***** ***** */

const prComponents = prFiles.filter(componentsOnlyFilter);
const allStoryNames = getFilesName(allStoryFiles);
const prComponentNames = getFilesName(prComponents);

const prComponentsHaveStories = prComponentNames.every((comp) => {
  return allStoryNames.includes(comp);
});

if (!prComponentsHaveStories) {
  warn("It seems that some modified components don't have stories associated.");
}

/* ***** *****  Warn about config changes  ***** ***** */

const prConfigFiles = prFiles.filter(configOnlyFilter);

if (prConfigFiles) {
  warn(
    `Beware, ${
      prConfigFiles.length === 1
        ? 'a configuration file has'
        : 'some configuration files have'
    } been modified.`
  );
}

/* ***** *****  Warn about potentially CodePush incompatible changes   ***** ***** */

const potentialBreak = prFiles.filter(breakingOnlyFilter);

if (potentialBreak) {
  warn(
    'Beware, native files or the package.json have been modified. This may break future CodePush updates. Please add a flag to this PR to prevent failed releases.'
  );
}