// SVG-based data URI for default avatar (user icon)
export const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjYwIiByPSI0MCIgZmlsbD0iIzY2NjY2NiIvPgo8cGF0aCBkPSJNIDUwIDE0MCBDIDUwIDEyMCA3MCAxMDAgMTAwIDEwMCBDIDEzMCAxMDAgMTUwIDEyMCAxNTAgMTQwIEwgMTUwIDE2MCBMIDUwIDE2MCBaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg==';

// SVG-based data URI for default cover image
export const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI0MzIiIHZpZXdCb3g9IjAgMCAxMjgwIDQzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNDMyIiBmaWxsPSIjMjIyMjIyIi8+Cjwvc3ZnPg==';

export function getAvatarUrl(avatarUrl) {
  return avatarUrl || DEFAULT_AVATAR;
}

export function getCoverImageUrl(coverUrl) {
  return coverUrl || DEFAULT_COVER;
}
