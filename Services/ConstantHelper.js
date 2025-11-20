export const FEEDBACK_PROMOT = `{{converstion}}
  Depends on this interview Conversation between assistant and user,
  Give me a feedback for the user interview.Give me rating out of 10 for the Technical skills.
  Communication, Problem Solving, Experience.Also give me Summary in 3 lines.
  about the interview and one line to let me know whether  is recommended for Company or not.
  Give the response in JsON format:
  {
    Feedback:{
      rating:{
      credits: number,
      technicalSkills: number,
      communication: number,
      problemSolving: number,
      experience: number,
      },
      summary: 3 lines,
      improvements: one line,
      Recommended: yes/no with reason
      
    }
}`