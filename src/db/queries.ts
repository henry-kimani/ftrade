import { allowedUsers, Role } from "@/db/schema";
import { db } from "@/db/dbConn";
import { eq, sql } from "drizzle-orm";

/* Check if the user is in the allowed_users table */
type UserId = { id: string; };
type Email = { email: string };
type Search = UserId | Email;

export async function isAllowedUser(key: Search) {

  if ("id" in key) {
    const result = await db.execute(sql<{exists: boolean}>`
      SELECT EXISTS(
        SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.id} = ${key.id}
      )
    `);
    return result[0].exists;
  } else {
    const result = await db.execute(sql<{exists: boolean}>`
      SELECT EXISTS(
        SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.email} = ${key.email}
      )
    `); 
    return result[0].exists as boolean;
  }
}


/* Get the role of the current user */
export async function getUserRole(userId: string) {
  const userRole = await db.select({
    role: allowedUsers.role
  }).from(allowedUsers).where(eq(allowedUsers.id, userId))

  if (userRole) return userRole[0].role;
}


/* check if a use is an admin */
export async function isUserAdmin(userId: string) {
  const result = await db.execute(sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.id} = ${userId} AND ${allowedUsers.role} = 'admin'
    )
  `);

  return result[0].exists as boolean;
}


/* Get all the users in the allowed_users table*/
export async function getAllowedUsers() {
  return await db.select({
    id: allowedUsers.id,
    email: allowedUsers.email,
    role: allowedUsers.role
  }).from(allowedUsers);
}


/* Update a user's role */
export async function updateUserRole(userId: string, role: Role) {
  return db
    .update(allowedUsers)
    .set({ role: role })
    .where(eq(allowedUsers.id, userId));
}
