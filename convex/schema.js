import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    Users: defineTable({
        name: v.string(),
        email: v.string(),
        credit: v.number(),
        SubscriptIcon: v.optional(v.string())
    }),

    Discussroom: defineTable({
        coachingOption: v.string(),
        topic: v.string(),
        Mentor: v.string(),
        duration: v.optional(v.number()), // Duration in minutes (e.g., 15, 30, 45, 60)
        createdAt: v.optional(v.number()), // Creation epoch ms
        expiresAt: v.optional(v.number()), // Expiration epoch ms
        scheduledFor: v.optional(v.number()), // Scheduled start timestamp ms (if scheduled)
        isScheduled: v.optional(v.boolean()),
        status: v.optional(v.string()), // 'scheduled' | 'active' | 'completed' | 'expired'
        coversation: v.optional(v.any()),
        Feedback: v.optional(v.any())
    }),

    Notifications: defineTable({
        title: v.string(),
        message: v.string(),
        type: v.string(), // 'meeting_created' | 'meeting_scheduled' | 'meeting_reminder' | 'feedback_ready'
        roomId: v.optional(v.string()),
        isRead: v.boolean(),
        createdAt: v.number(),
    })
});
