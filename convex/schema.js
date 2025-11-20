import { defineTable,defineSchema } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    Users:defineTable({
        name:v.string(),
        email:v.string(),
        credit:v.number(),
        SubscriptIcon: v.optional( v.string())
    }),

    Discussroom:defineTable({
        coachingOption:v.string(),
        topic:v.string(),
        Mentor:v.string(),
        coversation:v.optional(v.any()),
       Feedback: v.optional(v.any())
    })
})

