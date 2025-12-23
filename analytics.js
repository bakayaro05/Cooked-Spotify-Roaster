export function getPlaylistStats(tracks) {
  const trackCount = tracks.length;

  const totalDurationMs = tracks.reduce(
    (sum, t) => sum + (t.duration_ms || 0),
    0
  );

  const avgPopularity =
    tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) /
    trackCount || 0;

  return {
    trackCount,
    totalMinutes: Math.round(totalDurationMs / 60000),
    avgPopularity: Math.round(avgPopularity)
  };
}


export function getTopArtist(tracks) {
  const artistCount = {};

  tracks.forEach(track => {
    track.artists.forEach(artist => {
      artistCount[artist.name] =
        (artistCount[artist.name] || 0) + 1;
    });
  });

  return Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}


export function getTopGenre(tracks, artistGenres) {
  const genreScore = {};
  console.log("tracks:", tracks);

  tracks.forEach(track => {
    track.artists.forEach(artist => {
      const genres = artistGenres[artist.id] || [];
      genres.forEach(genre => {
        genreScore[genre] = (genreScore[genre] || 0) + 1;
      });
    });
  });

  return Object.entries(genreScore)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
}

export function getHiddenGem(tracks) {
  const gem = tracks
    .filter(t => typeof t.popularity === "number")
    .sort((a, b) => a.popularity - b.popularity)[0];

  if (!gem) return null;

  return {
    name: gem.name,
    artist: gem.artists.map(a => a.name).join(", "),
    popularity: gem.popularity,
    spotifyUrl: gem.external_urls?.spotify
  };
}


export function getPlaylistVibe(tracks, topGenre) {
  const avgDuration =
    tracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0) /
    tracks.length || 0;

  const avgPopularity =
    tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) /
    tracks.length || 0;

  if (avgPopularity > 75) return "Main Character Energy";
  if (avgDuration > 240000) return "Chill & Atmospheric";
  if (topGenre.includes("rock")) return "High Energy";
  if (topGenre.includes("lo-fi") || topGenre.includes("ambient"))
    return "Late Night Focus";

  return "Eclectic Mix";
}

