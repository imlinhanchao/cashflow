import type { ErrorMessageMode } from '#/axios';
import { useMessage } from '@/hooks/web/useMessage';
import { useUserStoreWithOut } from '@/store/modules/user';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error!;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      userStore.setToken(undefined);
      errMessage = msg || '401';
      break;
    case 403:
      errMessage = '403';
      break;
    // 404请求不存在
    case 404:
      errMessage = '404';
      break;
    case 405:
      errMessage = '405';
      break;
    case 408:
      errMessage = '408';
      break;
    case 500:
      errMessage = '500';
      break;
    case 501:
      errMessage = '501';
      break;
    case 502:
      errMessage = '502';
      break;
    case 503:
      errMessage = '503';
      break;
    case 504:
      errMessage = '504';
      break;
    case 505:
      errMessage = '505';
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: 'Error', content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}
