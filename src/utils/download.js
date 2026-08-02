import { toPng } from 'html-to-image';

export async function downloadBanner(element) {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
  });

  const link = document.createElement('a');
  link.download = `certificate-cover-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
