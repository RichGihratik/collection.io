const { mkdir, copyFile, rm } = require('node:fs/promises');
const { exec } = require('child_process');
const { join } = require('path');

const schemeName = 'schema.prisma';
const prismaFolder = 'prisma';

const source = join(__dirname, prismaFolder);

const targets = [
  'auth',
  'packages/auth-guard'
];

function log(str) {
  console.log('\x1b[92m\x1b[1m%s\x1b[0m', str);
}

function drawLine() {
  log('======================================');
}

(async () => {
  for (const target of targets) {
    const targetDir = join(__dirname, '..', '..', target);

    const prismaDir = join(targetDir, prismaFolder);
    await rm(prismaDir, { recursive: true, force: true });
    await mkdir(prismaDir);

    await copyFile(join(source, schemeName), join(prismaDir, schemeName));
    log(`Schema for "${target}" created. Starting prisma generate...`);
    exec(`npx prisma generate`, { cwd: targetDir }, (error, stdout, stderr) => {
      drawLine();
      log(`Prisma generate results for "${target}":\n`);
      if (error) {
        console.log(`Error occured: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`Stderror: ${stderr}`);
        return;
      }
      console.log(stdout);
    });
  }
})();