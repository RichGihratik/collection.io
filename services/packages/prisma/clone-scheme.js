const { mkdir, copyFile, rm } = require('node:fs/promises');
const { exec } = require('child_process');
const { join } = require('path');

const schemeName = 'schema.prisma';
const prismaFolder = 'prisma';

const source = join(__dirname, prismaFolder);

const targets = [
  'auth'
].map((target) => join(__dirname, '..', '..', target));

(async () => {
  for (const target of targets) {
    const prismaDir = join(target, prismaFolder); 

    await rm(prismaDir, { recursive: true, force: true });
    await mkdir(prismaDir);

    copyFile(join(source, schemeName), join(prismaDir, schemeName));
    exec(`npx prisma generate`, { cwd: target }, (error, stdout, stderr) => {
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