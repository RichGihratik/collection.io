import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { mkdir, writeFile } from 'node:fs/promises';

const path = join(__dirname, '../data');

@Injectable()
export class DirectoryService {
  async updateFile(fileName: string, data: string) {
    const filePath = join(path, fileName);
    await mkdir(path, { recursive: true });
    await writeFile(filePath, data);
  }

  formatJson(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }
}
