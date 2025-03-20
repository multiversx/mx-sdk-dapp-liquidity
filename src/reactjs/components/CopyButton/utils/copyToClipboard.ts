import { safeDocument, safeWindow } from '../../../constants';

function fallbackCopyTextToClipboard(text: string) {
  let success = false;

  const textArea = safeDocument.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  safeDocument.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    safeDocument.execCommand('copy');
    success = true;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  safeDocument.body.removeChild(textArea);

  return success;
}

export async function copyTextToClipboard(text: string) {
  let success = false;

  if (!safeWindow.navigator.clipboard) {
    success = fallbackCopyTextToClipboard(text);
  } else {
    success = await safeWindow.navigator.clipboard.writeText(text).then(
      function done() {
        return true;
      },
      function error(err) {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    );
  }

  return success;
}
