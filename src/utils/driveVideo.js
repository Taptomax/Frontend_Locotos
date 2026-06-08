export const isDriveUrl = (url = '') => url.includes('drive.google.com');

export const getDriveFileId = (url = '') => {
  if (!url) return null;

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  const idParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return idParam ? idParam[1] : null;
};

/** Convierte enlaces /view o /edit de Drive al formato /preview para iframe embebido. */
export const getDriveEmbedUrl = (url = '') => {
  const fileId = getDriveFileId(url);
  if (!fileId) return url;

  const resourceKey = url.match(/[?&]resourcekey=([^&]+)/i)?.[1];
  const base = `https://drive.google.com/file/d/${fileId}/preview`;
  return resourceKey ? `${base}?resourcekey=${resourceKey}` : base;
};

export const normalizeDriveTrailerUrl = (url = '') => {
  if (!isDriveUrl(url)) return url;
  return getDriveEmbedUrl(url);
};

export const getDriveStreamUrl = (url = '') => {
  const fileId = getDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
