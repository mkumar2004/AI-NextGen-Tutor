import { Conversations } from "openai/resources";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreaatedRoom = mutation({
    args: {
        coachingOption: v.string(),
        topic: v.string(),
        Mentor: v.string(),
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.insert('Discussroom',{
            coachingOption:args.coachingOption,
            topic:args.topic,
            Mentor:args.Mentor
        });
        return result;
    }
});

export const GetDiscussionInfo =query({
    args:{
        id:v.id('Discussroom')
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.get(args.id);
        return result;
    }
})

export const UpdateConversation = mutation({
    args:{
        id:v.id('Discussroom'),
        coversation:v.any(),
        Feedback: v.optional(v.any()) 
    },
    handler:async(ctx,args)=>{
           await ctx.db.patch(args.id,{
            coversation:args.coversation,
            Feedback: args.Feedback ?? []
           })
    }
})

export const Feedback = query({
    handler:async(ctx)=>{
        return await ctx.db.query("Discussroom").collect()
    }
})