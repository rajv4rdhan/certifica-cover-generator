export function fitLogo(wrapElement, imgElement, scale) {
  if (!imgElement.naturalWidth || !imgElement.naturalHeight) return;

  const boxW = wrapElement.clientWidth;
  const boxH = wrapElement.clientHeight;
  const ratio = imgElement.naturalWidth / imgElement.naturalHeight;

  let w = boxW;
  let h = w / ratio;

  if (h > boxH) {
    h = boxH;
    w = h * ratio;
  }

  w *= scale;
  h *= scale;

  imgElement.style.width = `${w}px`;
  imgElement.style.height = `${h}px`;
}
