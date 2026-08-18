/**
 * Utility to extract YouTube Playlist ID or Video ID from various URL formats.
 */

export interface ParsedYouTubeTarget {
  type: 'playlist' | 'video' | 'invalid';
  id: string;
}

export function parseYouTubeUrl(urlOrId: string): ParsedYouTubeTarget {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return { type: 'invalid', id: '' };
  }

  const trimmed = urlOrId.trim();

  // Direct Playlist ID pattern (usually starts with PL, RD, UU, FL, OLAK, etc.)
  if (/^(PL|RD|UU|FL|OLAK|CL)[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  // Direct Video ID pattern (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  try {
    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);

    // Check for "list" query parameter in any youtube URL (e.g. youtube.com/playlist?list=... or watch?v=...&list=...)
    const listParam = urlObj.searchParams.get('list');
    if (listParam) {
      return { type: 'playlist', id: listParam };
    }

    // Check for "v" query parameter (standard video watch link)
    const videoParam = urlObj.searchParams.get('v');
    if (videoParam) {
      return { type: 'video', id: videoParam };
    }

    // Check for short youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      const pathId = urlObj.pathname.replace(/^\//, '');
      if (pathId) {
        return { type: 'video', id: pathId };
      }
    }

    // Check for embed links /embed/VIDEO_ID or /embed/videoseries?list=PLAYLIST_ID
    if (urlObj.pathname.includes('/embed/')) {
      const parts = urlObj.pathname.split('/embed/');
      if (parts[1]) {
        return { type: 'video', id: parts[1].split('?')[0] };
      }
    }
  } catch (e) {
    // If URL parsing fails, regex fallback for list=...
    const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (listMatch && listMatch[1]) {
      return { type: 'playlist', id: listMatch[1] };
    }

    const videoMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
    if (videoMatch && videoMatch[1]) {
      return { type: 'video', id: videoMatch[1] };
    }
  }

  return { type: 'invalid', id: '' };
}
