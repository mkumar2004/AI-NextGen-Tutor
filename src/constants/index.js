export const STAFF_MEMBERS = [
  {
    name: "Krish",
    pic: "/agent1.svg",
    gender: "male",
  },
  {
    name: "Harshitha",
    pic: "/agent2.svg",
    gender: "female",
  },
  {
    name: "Maveen",
    pic: "/agent3.svg",
    gender: "male",
  },
  {
    name: "latha",
    pic: "/agent4.svg",
    gender: "female",
  },
];

export const EXPERT_ASSISTANTS = [
  {
    name: "Lecture on Topic",
    icon: "/Ass1.svg",
    prompt:
      "Act as a knowledgeable lecturer. Explain the topic '{user_topic}' in a simple and engaging way using real-world examples, analogies, and visuals when needed.",
  },
  {
    name: "Mock Interview",
    icon: "/Ass4.svg",
    prompt:
      "Conduct a realistic mock interview focused on '{user_topic}'. Ask professional questions, evaluate answers, and provide detailed feedback with improvement suggestions.",
  },
  {
    name: "Ques Ans Pre",
    icon: "/Ass3.svg",
    prompt:
      "Simulate a question-answer preparation session on '{user_topic}'. Ask relevant questions, test understanding, and explain each answer clearly for better learning.",
  },
  {
    name: "Language Skill",
    icon: "/Ass2.svg",
    prompt:
      "Act as a language coach specialized in '{user_topic}'. Help improve grammar, pronunciation, and vocabulary through interactive exercises and real-world examples.",
  },
  {
    name: "Medication",
    icon: "/Ass5.svg",
    prompt:
      "Provide calm, informative guidance about '{user_topic}' in the context of general health and medication awareness. Offer safe advice, wellness tips, and reminders — without giving medical diagnoses.",
  },
];

export const FEEDBACK_PROMPT = `{{converstion}}
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
      },
      summary: 3 lines,
      improvements: one line,
      Recommended: yes/no with reason
      
    }
}`;

// Backward-compatible exports for existing code
export const staff = STAFF_MEMBERS;
export const Experlist = EXPERT_ASSISTANTS;
export const FEEDBACK_PROMOT = FEEDBACK_PROMPT;

