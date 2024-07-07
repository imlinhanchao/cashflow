import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';
import * as fetch from 'node-fetch';
import { parse } from 'content-disposition';
export function extractZip(zipPath: string, password: string, extractPath: string): Promise<string[]> {
  return unzipper.Open.file(zipPath).then(async (d) => {
    return (await Promise.all(d.files.filter(f => f.type == "File").map((file) => 
        new Promise((resolve: (p: string) => void, reject) => {
          const savePath = extractPath + "/" + file.pathBuffer;
          fs.mkdirSync(path.dirname(savePath), { recursive: true });
          file.stream(password)
              .pipe(fs.createWriteStream(savePath))
              .on('finish', () => resolve(savePath))
              .on('error', reject);
        })
      ))).filter((path) => path && typeof path == 'string');
  });
}

export function downloadByUrl(url: string, saveDir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then(res => {
      if (!res.ok) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusText}`));
      }

      const contentDisposition = res.headers.get('content-disposition');
      let filename = contentDisposition && contentDisposition.match(/filename="*([^";]+)"*;*/)?.[1];

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