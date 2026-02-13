  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  modules: Module[];
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: "prompt-craft" | "chat-practice" | "analysis" | "template-use";
  difficulty: "beginner" | "intermediate" | "advanced";
  systemPrompt: string;
  starterPrompt?: string;
}

export interface PromptTemplate {
  id: string;
  trackId: string;
  title: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
}

export const TRACKS: Track[] = [
  {
    id: "sales",
    name: "Sales",
    description: "Master AI-powered sales techniques, from prospecting to closing deals with intelligent automation.",
    icon: "TrendingUp",
    color: "#3ECF8E",
    modules: [
      {
        id: "sales-1", trackId: "sales", title: "AI-Powered Prospecting", order: 1,
        description: "Use AI to identify and qualify leads faster than ever before.",
        exercises: [
          { id: "s1e1", moduleId: "sales-1", title: "Build an Ideal Customer Profile", description: "Use AI to create a detailed ICP for your product", type: "prompt-craft", difficulty: "beginner", systemPrompt: "You are an expert sales strategist. Help the user create a detailed Ideal Customer Profile (ICP). Ask about their product, target market, and current customers. Provide structured output with demographics, firmographics, pain points, and buying triggers.", starterPrompt: "Help me create an ICP for my product" },
          { id: "s1e2", moduleId: "sales-1", title: "Research a Prospect", description: "Learn to use AI for deep prospect research", type: "chat-practice", difficulty: "beginner", systemPrompt: "You are a sales research assistant. Help the user research a prospect company. Provide insights about the company's recent news, challenges, growth areas, and potential pain points. Format your response with clear sections and actionable insights." },
          { id: "s1e3", moduleId: "sales-1", title: "Qualify Leads with AI", description: "Build an AI-powered lead scoring framework", type: "analysis", difficulty: "intermediate", systemPrompt: "You are a lead qualification expert. Help the user build a lead scoring framework using AI. Discuss BANT, MEDDIC, or other qualification frameworks and how AI can automate parts of the process." },
        ]
      },
      {
        id: "sales-2", trackId: "sales", title: "Cold Outreach Mastery", order: 2,
        description: "Craft compelling cold emails and messages that get responses.",
        exercises: [
          { id: "s2e1", moduleId: "sales-2", title: "Write a Cold Email Sequence", description: "Create a 5-email sequence using AI", type: "prompt-craft", difficulty: "beginner", systemPrompt: "You are a cold email copywriting expert. Help the user create a compelling 5-email cold outreach sequence. Focus on personalization, value proposition, and clear CTAs. Format each email with subject line, body, and CTA." },
          { id: "s2e2", moduleId: "sales-2", title: "LinkedIn Outreach Messages", description: "Craft personalized LinkedIn messages", type: "template-use", difficulty: "beginner", systemPrompt: "You are a LinkedIn outreach specialist. Help create personalized connection requests and follow-up messages. Focus on building genuine relationships, not just selling." },
          { id: "s2e3", moduleId: "sales-2", title: "A/B Test Your Messaging", description: "Use AI to create and analyze message variants", type: "analysis", difficulty: "intermediate", systemPrompt: "You are a sales messaging optimization expert. Help the user create A/B test variants of their outreach messages and analyze which approaches work best for different audiences." },
        ]
      },
      {
        id: "sales-3", trackId: "sales", title: "Discovery Calls with AI", order: 3,
        description: "Prepare for and conduct better discovery calls using AI assistance.",
        exercises: [
          { id: "s3e1", moduleId: "sales-3", title: "Prepare Discovery Questions", description: "Generate targeted discovery questions", type: "prompt-craft", difficulty: "intermediate", systemPrompt: "You are a discovery call preparation expert. Help the user prepare targeted discovery questions based on their prospect's industry, role, and potential pain points. Structure questions using the SPIN selling methodology." },
          { id: "s3e2", moduleId: "sales-3", title: "Role-Play a Discovery Call", description: "Practice with an AI prospect", type: "chat-practice", difficulty: "intermediate", systemPrompt: "You are role-playing as a VP of Marketing at a mid-size SaaS company. You have budget concerns, team capacity issues, and are evaluating multiple solutions. Respond naturally to the user's discovery questions. Be somewhat guarded initially but open up with good questions." },
          { id: "s3e3", moduleId: "sales-3", title: "Summarize Call Notes", description: "Use AI to extract insights from call notes", type: "analysis", difficulty: "beginner", systemPrompt: "You are a sales call analysis expert. Help the user summarize discovery call notes into actionable insights. Extract key pain points, budget signals, timeline indicators, and next steps." },
        ]
      },
      {
        id: "sales-4", trackId: "sales", title: "Proposal & Pitch Creation", order: 4,
        description: "Build compelling proposals and pitch decks with AI assistance.",
        exercises: [
          { id: "s4e1", moduleId: "sales-4", title: "Write a Winning Proposal", description: "Structure a proposal that converts", type: "prompt-craft", difficulty: "intermediate", systemPrompt: "You are a proposal writing expert. Help the user create a compelling sales proposal. Include executive summary, problem statement, proposed solution, pricing framework, and implementation timeline. Format with professional headings and bullet points." },
          { id: "s4e2", moduleId: "sales-4", title: "Handle Objections", description: "Prepare responses to common objections", type: "chat-practice", difficulty: "advanced", systemPrompt: "You are a sales objection handling coach. Present common objections (price, timing, competition, internal buy-in) and help the user craft effective responses. Use frameworks like Feel-Felt-Found and Acknowledge-Bridge-Close." },