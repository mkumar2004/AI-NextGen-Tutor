import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const userData = await ctx.db.query("Users")
      .filter(q => q.eq(q.field("email"), args.email)) // q is available here
      .collect();

    if (userData.length === 0) {
      const data = {
        name: args.name,
        email: args.email,
        credit: 50000,
      };

      const result = await ctx.db.insert("Users", data);
      console.log(result);
      return result; // returns inserted document ID
    }

    return userData[0]; // return existing user
  },
});



// GET USER PROFILE
export const getProfile = query(async ({ db }, { email }) => {
  const user = await db
    .query("users")
    .filter((q) => q.eq(q.field("email"), email))
    .first();
  return user;
});

// UPDATE PROFILE
export const updateProfile = mutation(async ({ db }, data) => {
  const existing = await db
    .query("Users")
    .filter((q) => q.eq(q.field("email"), data.email))
    .first();

  if (!existing) return null;

  await db.patch(existing._id, {
    name: data.name,
    mobile: data.mobile,
    address: data.address,
    avatar: data.avatar,
  });

  return true;
});