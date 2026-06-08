export const POSTER_FALLBACK = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500';

export const getPosterSrc = (item) => {
  const src = item?.poster || item?.imagen_url;
  return src && String(src).trim() ? src : POSTER_FALLBACK;
};

export const handlePosterError = (event) => {
  if (event.target.src !== POSTER_FALLBACK) {
    event.target.src = POSTER_FALLBACK;
  }
};
