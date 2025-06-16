import { pgEnum, pgPolicy, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const roles = pgEnum('role', ['none', 'viewer', 'admin']);

export const viewerRole = roles.enumValues[1];
export const adminRole = roles.enumValues[2];

export const allowedUsers = pgTable('allowed_users', {
  id: uuid()
    .references(() => authUsers.id, { onDelete: 'cascade', onUpdate: 'cascade'})
    .notNull()
    .primaryKey(),
  email: varchar({ length: 50 }).unique().notNull(),
  role: roles().notNull().default("none")
  }, (table) => [
    pgPolicy('Only an auth user with role viewer and admin can view', {
      to: authenticatedRole,
      for: 'select',
      using: sql`(SELECT ${table.role} FROM  allowed_users WHERE ${table.id} = ${authUid}) >= 'viewer'`,
    }),
    pgPolicy('Only an auth admin can add make changes', {
      to: authenticatedRole,
      for: "all",
      /* For INSERT, UPDATE and DELETE commands, only allow the to run if the 
       * current user is and admin */
      using: sql`(SELECT ${table.role} FROM allowed_users WHERE ${table.id} = ${authUid}) = 'admin'`,
      withCheck: sql`(SELECT ${table.role} FROM allowed_users WHERE ${table.id} = ${authUid}) = 'admin'`,
    })
  ]
);



