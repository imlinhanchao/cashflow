import * as fs from 'fs';
import * as path from 'path';
import * as fetch from 'node-fetch';

export function downloadByUrl(url: string, saveDir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then(res => {
      if (!res.ok) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusText}`));
      }

      const contentDisposition = res.headers.get('content-disposition');
      const filename = contentDisposition && contentDisposition.match(/filename="*([^";]+)"*;*/)?.[1];

      const filePath = path.join(saveDir, filename && decodeURIComponent(filename) || `file-${Date.now()}`);

      const dest = fs.createWriteStream(filePath);
      res.body.pipe(dest);
      res.body.on('error', reject);
      dest.on('finish', () => {
        resolve(filePath);
      });
      dest.on('error', reject);
    })
    .catch(reject);
  });
}

export const configPath = path.resolve(__dirname, '../../config.json');

export function hasConfigFile() {
  return fs.existsSync(configPath);
}