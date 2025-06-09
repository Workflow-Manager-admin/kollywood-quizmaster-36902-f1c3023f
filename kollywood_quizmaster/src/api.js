//
// API Service Layer for TMDb integration (Kollywood QuizMaster)
//
// This module securely integrates with the TMDb API using an API key stored in
// an environment variable. DO NOT hard-code secrets or API keys directly—see dev notes below.
//
// Usage: Import functions (e.g. fetchKollywoodMovies) for quiz/game data.
//
// -----------------------------------------------------------------------------
// PUBLIC_INTERFACE
/**
 * Fetch popular or relevant Kollywood (Tamil) movies from TMDb.
 * @param {object} options Optional filters (page, year, etc).
 * @returns {Promise<object[]>} List of movie objects.
 */
export async function fetchKollywoodMovies(options = {}) {
  // Tamil's language code: "ta"
  // By default we use TMDb 'discover' API to filter by language & region if possible.
  const params = new URLSearchParams({
    api_key: getApiKey(),
    language: 'ta',
    sort_by: 'popularity.desc',
    include_adult: 'false',
    page: options.page || 1,
    ...options,
  });

  // Use discover API and filter by language, or with/without genre (as needed later)
  const url = `https://api.themoviedb.org/3/discover/movie?${params}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb Movies fetch failed: ${res.status}`);
  const data = await res.json();
  return data.results;
}

// PUBLIC_INTERFACE
/**
 * Fetch details for a single movie by TMDb movie ID
 * @param {number|string} movieId
 * @returns {Promise<object>}
 */
export async function fetchMovieDetails(movieId) {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    language: 'ta',
  });
  const url = `https://api.themoviedb.org/3/movie/${movieId}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb Details fetch failed: ${res.status}`);
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch credits (cast/crew) data for a specific movie
 * @param {number|string} movieId
 * @returns {Promise<object>} credits object with cast/crew arrays
 */
export async function fetchMovieCredits(movieId) {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    language: 'ta'
  });
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb Credits fetch failed: ${res.status}`);
  return await res.json();
}

// UTILITIES
/**
 * Get poster image URL for a movie or cast.
 * @param {string} path The poster_path or profile_path from TMDb API
 * @param {"w185"|"w342"|"original"} size Size key for TMDb images
 * @returns {string}
 */
// PUBLIC_INTERFACE
export function getTMDbImageUrl(path, size = "w342") {
  if (!path) return "";
  // Docs: https://developer.themoviedb.org/docs/image-basics
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/*
================================================================================
                   DEVELOPMENT & API KEY SETUP (IMPORTANT)
================================================================================

The TMDb API key is NOT committed to source files for security. Instead:
  - The key must be placed in an environment variable file named `.env` at the
    root of the frontend project (`kollywood_quizmaster/.env`).

    Example `.env` file content:
      REACT_APP_TMDB_API_KEY=5bc67d3b06aecbd18121a3cbbc16eb59

  - React automatically exposes variables starting with `REACT_APP_`.

  - Never commit your .env file or the API key to version control.

How it works:
  - The helper `getApiKey()` reads `process.env.REACT_APP_TMDB_API_KEY`
  - If not set, API calls will fail.

For production deploy, ensure the correct key is provided as an environment variable.

================================================================================
*/

function getApiKey() {
  const key = process.env.REACT_APP_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDb API key missing. Define REACT_APP_TMDB_API_KEY in a .env file at project root."
    );
  }
  return key;
}
