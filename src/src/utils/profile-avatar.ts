export const DEFAULT_PROFILE_AVATAR = 'https://avatars.matchapp.fr/defaults/default.jpg';

export function resolveProfileAvatar(avatar?: string | null): string {
  const normalized = typeof avatar === 'string' ? avatar.trim() : '';
  return normalized.length > 0 ? normalized : DEFAULT_PROFILE_AVATAR;
}
