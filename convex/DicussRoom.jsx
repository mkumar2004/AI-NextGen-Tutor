import { Conversations } from "openai/resources";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreaatedRoom = mutation({
    args: {
        coachingOption: v.string(),
        topic: v.string(),
        Mentor: v.string(),
        duration: v.optional(v.number()), // Duration in minutes (defaults to 15)
        scheduledFor: v.optional(v.number()), // Optional scheduled timestamp ms
        isScheduled: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const durationMinutes = args.duration ?? 15;
        const isScheduled = !!args.isScheduled && !!args.scheduledFor && args.scheduledFor > now;
        const scheduledTime = isScheduled ? args.scheduledFor : undefined;
        const expiresAt = isScheduled 
            ? (scheduledTime + durationMinutes * 60 * 1000) 
            : (now + durationMinutes * 60 * 1000);

        const roomId = await ctx.db.insert('Discussroom', {
            coachingOption: args.coachingOption,
            topic: args.topic,
            Mentor: args.Mentor,
            duration: durationMinutes,
            createdAt: now,
            expiresAt: expiresAt,
            scheduledFor: scheduledTime,
            isScheduled: isScheduled,
            status: isScheduled ? 'scheduled' : 'active',
        });

        // Automatically trigger notification for meeting creation / schedule
        const notificationTitle = isScheduled 
            ? `Meeting Scheduled with ${args.Mentor}`
            : `Meeting Live with ${args.Mentor}`;
            
        const formattedDate = isScheduled 
            ? new Date(args.scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
            : `${durationMinutes}m session`;

        const notificationMsg = isScheduled
            ? `Your session on "${args.topic}" is booked for ${formattedDate}.`
            : `Your dynamic room for "${args.topic}" (${formattedDate}) is active.`;

        await ctx.db.insert('Notifications', {
            title: notificationTitle,
            message: notificationMsg,
            type: isScheduled ? 'meeting_scheduled' : 'meeting_created',
            roomId: roomId.toString(),
            isRead: false,
            createdAt: now,
        });

        return roomId;
    }
});

export const GetDiscussionInfo = query({
    args: {
        id: v.id('Discussroom')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
});

export const UpdateConversation = mutation({
    args: {
        id: v.id('Discussroom'),
        coversation: v.any(),
        Feedback: v.optional(v.any()) 
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            coversation: args.coversation,
            Feedback: args.Feedback ?? []
        });
    }
});

export const Feedback = query({
    handler: async (ctx) => {
        return await ctx.db.query("Discussroom").collect();
    }
});

export const GetAllFeedback = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("Discussroom")
            .filter((q) => q.neq(q.field("Feedback"), undefined))
            .collect();
    },
});

// ----------------- Notification Queries & Mutations ----------------- //

export const GetNotifications = query({
    handler: async (ctx) => {
        const notifications = await ctx.db
            .query("Notifications")
            .order("desc")
            .take(20);
        return notifications;
    }
});

export const MarkNotificationAsRead = mutation({
    args: {
        id: v.id('Notifications')
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isRead: true });
    }
});

export const MarkAllNotificationsAsRead = mutation({
    handler: async (ctx) => {
        const unread = await ctx.db
            .query("Notifications")
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        for (const item of unread) {
            await ctx.db.patch(item._id, { isRead: true });
        }
    }
});
