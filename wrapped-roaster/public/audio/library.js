const base = import.meta.env.BASE_URL;

export const AUDIO_LIBRARY = {
  HOME: [
    `${base}audio/jazz-home-1.mp3`,
    `${base}audio/jazz-home-2.mp3`,
    `${base}audio/jazz-home-3.mp3`,
    `${base}audio/jazz-home-4.mp3`
  ],
  LOADING: {
    [`${base}audio/jazz-home-1.mp3`]: `${base}audio/jazz-home-1-reverb.mp3`,
    [`${base}audio/jazz-home-2.mp3`]: `${base}audio/jazz-home-2-reverb.mp3`,
    [`${base}audio/jazz-home-3.mp3`]: `${base}audio/jazz-home-3-reverb.mp3`,
    [`${base}audio/jazz-home-4.mp3`]: `${base}audio/jazz-home-4-reverb.mp3`
  },
  SLIDES: [
    `${base}audio/jazz-slide-1.m4a`
  ]
};