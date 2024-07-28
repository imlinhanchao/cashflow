import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';

export function extract(zipPath: string, password: string, extractPath: string): Promise<string[]> {
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

