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