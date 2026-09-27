import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'secretariat' | 'media' | 'kitchen'

type UserWithRole = {
  id?: number | string
  role?: Role
} | null

const hasRole = (user: unknown, roles: Role[]): boolean => {
  const role = (user as UserWithRole)?.role
  return role ? roles.includes(role) : false
}

/** Full administrators only. */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, ['admin'])

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => hasRole(user, ['admin'])

/** Administrators and church secretariat. */
export const isAdminOrSecretariat: Access = ({ req: { user } }) =>
  hasRole(user, ['admin', 'secretariat'])

/** Anyone who is allowed to manage content (bulletins, events, media). */
export const isContentEditor: Access = ({ req: { user } }) =>
  hasRole(user, ['admin', 'secretariat', 'media'])

export const isContentEditorFieldLevel: FieldAccess = ({ req: { user } }) =>
  hasRole(user, ['admin', 'secretariat', 'media'])

/** Administrators and the kitchen lead (kitchen ordering settings). */
export const isAdminOrKitchen: Access = ({ req: { user } }) =>
  hasRole(user, ['admin', 'kitchen'])

/** Administrators and the media team (site / live-stream settings). */
export const isAdminOrMedia: Access = ({ req: { user } }) => hasRole(user, ['admin', 'media'])

/** Administrators, or the logged-in user reading/updating their own record. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (hasRole(user, ['admin'])) return true
  const id = (user as UserWithRole)?.id
  if (id !== undefined) return { id: { equals: id } }
  return false
}

/** Any authenticated user. */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)
