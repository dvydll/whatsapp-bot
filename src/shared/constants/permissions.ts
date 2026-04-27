// Permission levels
export const Permissions = {
  PUBLIC: 0,
  PREMIUM: 1,
  MODERATOR: 2,
  ADMIN: 3,
  OWNER: 4,
} as const;

export type PermissionLevel = typeof Permissions[keyof typeof Permissions];