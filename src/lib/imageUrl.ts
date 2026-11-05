export function getResponsiveImageUrl(url: string, width: number) {
  if (!url.includes('drive.google.com/thumbnail')) return url;

  const imageUrl = new URL(url);
  imageUrl.searchParams.set('sz', `w${Math.max(1, Math.round(width))}`);
  return imageUrl.toString();
}

export function getResponsiveImageSrcSet(url: string, widths: number[]) {
  if (!url.includes('drive.google.com/thumbnail')) return undefined;

  return widths
    .map((width) => `${getResponsiveImageUrl(url, width)} ${Math.max(1, Math.round(width))}w`)
    .join(', ');
}
