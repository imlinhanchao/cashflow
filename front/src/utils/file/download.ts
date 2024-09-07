import type { AxiosResponse } from 'axios';
import { dataURLtoBlob, urlToBase64 } from './base64';

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * 通过api下载文件
 * @param {AxiosResponse} axiosResponse axios请求返回的二进制数据
 * @param {string | RegExp} filename 文件名 或 请求头中的文件名正则匹配规则
 * @example
  defHttp.post({ url,  data, responseType: 'blob'}, { nativeResponse: true })
  .then(res => downloadByAxios(res));
 */
export function downloadByAxios(axiosResponse: AxiosResponse, filename?: string | RegExp) {
  const { data, headers } = axiosResponse;
  const blobData = (data || axiosResponse) as BlobPart;

  const tmpFileName =
    typeof filename === 'string' ? filename : extractFilenameFromHeaders(headers, filename);
  const defaultFilename = tmpFileName || new Date().toLocaleDateString();

  downloadByData(blobData, defaultFilename);
}

/**
 * 从请求头中提取文件名
 * @param {AxiosResponse['headers']} headers 请求头
 * @param {RegExp} [pattern] 文件名正则匹配规则
 * @returns {string | undefined} 提取到的文件名
 */
function extractFilenameFromHeaders(
  headers: AxiosResponse['headers'],
  pattern = /filename\*?=([^;]+)/,
): string | undefined {
  const contentDisposition = headers['Content-Disposition'] || headers['content-disposition'] || '';
  const match = contentDisposition.match(pattern);

  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1].replace(/["']/g, '').trim());
    } catch (e) {
      console.error('Error decoding filename:', e);
    }
  }
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string;
  target?: TargetContext;
  fileName?: string;
}) {
  if (!url) return false;

  const a = document.createElement('a');
  a.href = url;
  target && (a.target = target);

  if (a.download != undefined) {
    a.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
  }

  a.click();

  /* if (document.createEvent) {
    const e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
    return true;
  } */
}

/**
 * 返回预览文件地址
 * @param url 文件绝对地址
 * @param fileName 文件名
 */
export function toFilePreviewUrl(url: string, fileName?: string) {
  return (
    `/div11oa/doc_preview/preview?originLink=${url}` + (fileName ? `&originName=${fileName}` : '')
  );
}