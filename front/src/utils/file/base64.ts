/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * img url to base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}

/**
 * 水印生成参数类
 */
export class Base64GenOpt {
  width = 150;
  height = 150;
  rotate: number = (-45 * Math.PI) / 180;
  translate = [-75, 25] as const;
  color: string | CanvasGradient | CanvasPattern = 'rgba(128,128,128,0.2)';
  font = '14px Microsoft YaHei';
  textAlign: CanvasTextAlign = 'center';
}

/**
 * base64生成器 - 生成水印base64
 * @param {Base64GenOpt} opt 生成配置
 * @returns { (str: string, subStr?: string) => string }
 */
export function base64Factory(
  opt?: Partial<Base64GenOpt>,
): (str: string, subStr?: string) => string {
  const _opt = Object.assign({}, new Base64GenOpt(), opt);

  return (str: string, subStr?: string) => {
    const { width, height, rotate, translate, color, font, textAlign } = _opt;
    const canvas = document.createElement('canvas');
    Object.assign(canvas, { width, height });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.rotate(rotate);
      ctx.translate(...translate);
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.fillText(str, width / 2, height / 2);
      if (subStr) ctx.fillText(subStr, width / 2, height / 2 + 20);
    }
    return canvas.toDataURL('image/png');
  };
}