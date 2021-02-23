#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

const algorithms = crypto.getHashes();
const [, , algorithm, ...filepaths] = process.argv;

if (!algorithms.includes(algorithm)) {
  console.error('Algorithm not supported. Available algorithms:\n');
  algorithms.forEach((algo) => {
    console.error(`  - ${algo}`);
  });
  process.exit(1);
}

if (filepaths.length === 0) {
  console.error('Not pass files for hash');
  process.exit(1);
}

filepaths.forEach((filepath) => {
  if (!fs.existsSync(filepath)) {
    console.log(`${algorithm}sum: ${filepath}: No such file or directory`);
    return;
  }

  if (fs.lstatSync(filepath).isDirectory()) {
    console.log(`${algorithm}sum: ${filepath}: Is a directory`);
    return;
  }

  const hash = crypto.createHash(algorithm);
  const file = fs.createReadStream(filepath);

  file.on('end', () => {
    hash.end();

    console.log(`${hash.digest('hex')}  ${filepath}`);
  });

  file.pipe(hash);
});
