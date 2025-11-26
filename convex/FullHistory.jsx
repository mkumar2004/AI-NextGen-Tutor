import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Extract normalized rating JSON from convex records
 */
function normalizeRating(item) {
  const raw = item.Feedback ?? item.feedback ?? {};
  const fb = raw?.Feedback ?? raw ?? {};

  return fb.rating || fb.Rating || null;
}

/**
 * Converts rating object {communication:2, technicalSkills:1 ...}
 * into an average number
 */
function computeScore(rating) {
  if (!rating || typeof rating !== "object") return null;

  const values = Object.values(rating).map(Number).filter((n) => !isNaN(n));

  if (values.length === 0) return null;

  return values.reduce((a, b) => a + b, 0) / values.length;
}

export const FeedbackAnalytics = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("Discussroom").collect();

    let results = all
      .map((item) => {
        const rating = normalizeRating(item);
        const score = computeScore(rating);

        return {
          id: item._id,
          mentor: item.Mentor,
          topic: item.topic,
          rating,
          score,
          time: item._creationTime,
        };
      })
      .filter((x) => x.score !== null); // remove empty feedback

    if (results.length === 0) {
      return {
        top: null,
        worst: null,
        averageScore: null,
        total: 0,
      };
    }

    // Sort highest → lowest
    const sorted = [...results].sort((a, b) => b.score - a.score);

    const top = sorted[0]; // Best score
    const worst = sorted[sorted.length - 1]; // Lowest score

    const average =
      sorted.reduce((acc, x) => acc + x.score, 0) / sorted.length;

    return {
      top,
      worst,
      averageScore: parseFloat(average.toFixed(2)),
      total: sorted.length,
      all: sorted,
    };
  },
});
