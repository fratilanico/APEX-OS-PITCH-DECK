import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import {
  Sparkles,
  ArrowRight,
  Code2,
  TrendingUp,
  Megaphone,
  Rocket,
  Zap,
  MessageSquare,
  FileText,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Terminal,
  BookOpen,
  Target,
  Brain,
  Layers,
  Shield,
  Star,
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tracks = [
  { icon: TrendingUp, name: "Sales", color: "#3ECF8E", gradient: "from-emerald-500/20 to-emerald-500/5", desc: "AI-powered prospecting, outreach, and closing", modules: 7, exercises: 21 },
  { icon: Code2, name: "Engineering", color: "#818CF8", gradient: "from-indigo-500/20 to-indigo-500/5", desc: "AI-assisted coding, debugging, and architecture", modules: 7, exercises: 21 },
  { icon: Megaphone, name: "Marketing", color: "#F97316", gradient: "from-orange-500/20 to-orange-500/5", desc: "Content, SEO, and campaign optimization", modules: 7, exercises: 21 },
  { icon: Rocket, name: "Founders & Execs", color: "#EC4899", gradient: "from-pink-500/20 to-pink-500/5", desc: "Strategy, fundraising, and team building", modules: 7, exercises: 21 },
  { icon: Zap, name: "Productivity", color: "#FACC15", gradient: "from-yellow-500/20 to-yellow-500/5", desc: "Writing, research, and workflow automation", modules: 7, exercises: 21 },
];

const features = [
  { icon: MessageSquare, title: "AI Chat Playground", desc: "Practice with role-specific AI assistants that adapt to your learning track and provide structured, formatted responses.", color: "#3ECF8E" },
  { icon: FileText, title: "30+ Prompt Templates", desc: "Battle-tested templates for every role — sales outreach, code reviews, marketing campaigns, and more.", color: "#818CF8" },
  { icon: BarChart3, title: "Progress Analytics", desc: "Track your learning journey with visual dashboards, difficulty breakdowns, and streak tracking.", color: "#F97316" },
  { icon: CheckCircle2, title: "105 Hands-On Exercises", desc: "Real-world scenarios across 35 modules with guided practice and instant AI feedback.", color: "#EC4899" },
  { icon: Terminal, title: "Code Block Rendering", desc: "Beautiful Notion-style code blocks with syntax highlighting, copy buttons, and language detection.", color: "#FACC15" },
  { icon: Brain, title: "Smart Personas", desc: "Each track has a specialized AI persona that understands your role's context and challenges.", color: "#06B6D4" },
];

const codeExample = `// AI App Buddy - Smart Prompt Engineering
const prompt = buildPrompt({
  role: "sales",
  module: "cold-outreach",
  context: {
    prospect: "CTO at Series B startup",
    product: "AI analytics platform",
    painPoint: "manual data processing"
  }
});

const response = await ai.chat({
  persona: "Sales AI Coach",
  prompt,
  format: "structured",
  includeExamples: true
});

// ✨ Beautiful formatted response with
// headings, code blocks, and actionable steps`;

const testimonials = [
  { name: "Sarah Chen", role: "VP of Sales, TechCorp", text: "AI App Buddy transformed how our team uses AI for prospecting. The exercises are incredibly practical." },
  { name: "Marcus Rivera", role: "Senior Engineer, StartupXYZ", text: "The engineering track's code review exercises alone saved me hours of debugging time every week." },
  { name: "Priya Patel", role: "CMO, GrowthCo", text: "Finally, an AI training platform that understands marketing workflows. The prompt templates are gold." },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTrack, setActiveTrack] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      setLocation("/app");
    }
  }, [loading, user, setLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTrack((prev) => (prev + 1) % tracks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/20 bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">AI App Buddy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#tracks" className="hover:text-foreground transition-colors">Tracks</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 text-sm font-medium"
          >
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-4">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(62,207,142,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(62,207,142,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              AI Skills Training for Professionals
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          >
            Master AI tools
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400">
              for your profession
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Hands-on training with role-specific exercises, 30+ prompt templates,
            and an AI chat playground. 5 tracks, 35 modules, 105 exercises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12 shadow-[0_0_30px_rgba(62,207,142,0.3)] hover:shadow-[0_0_40px_rgba(62,207,142,0.4)] transition-all"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base px-8 h-12 border-border/40 text-foreground hover:bg-accent/50 bg-transparent"
            >
              See Features
            </Button>
          </motion.div>

          {/* Animated track pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {tracks.map((track, i) => (
              <div
                key={track.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-500 cursor-default ${
                  i === activeTrack
                    ? "border-primary/40 bg-primary/10 text-primary scale-105"
                    : "border-border/30 bg-card/30 text-muted-foreground"
                }`}
              >
                <track.icon className="h-3.5 w-3.5" style={{ color: i === activeTrack ? track.color : undefined }} />
                {track.name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "5", label: "Learning Tracks" },
              { value: "35", label: "Modules" },
              { value: "105", label: "Exercises" },
              { value: "30+", label: "Prompt Templates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-4">
              <BookOpen className="h-3 w-3" />
              LEARNING PATHS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              5 Professional Tracks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each track is tailored to your role with specialized modules, exercises, and AI personas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {tracks.map((track, i) => (
              <motion.div
                key={track.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border/30 bg-card/40 p-6 sm:p-7 hover:border-border/60 transition-all hover:bg-card/70 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${track.color}12` }}
                  >
                    <track.icon className="h-5.5 w-5.5" style={{ color: track.color }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{track.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{track.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {track.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {track.exercises} exercises
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/3 p-6 sm:p-7 flex flex-col justify-center"
            >
              <h3 className="text-sm font-medium text-primary mb-5 uppercase tracking-wider">Platform Stats</h3>
              <div className="space-y-4">
                {[
                  { val: "35", label: "Curated modules" },
                  { val: "105", label: "Hands-on exercises" },
                  { val: "30+", label: "Prompt templates" },
                  { val: "5", label: "AI personas" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-primary">{s.val}</span>
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 px-4 border-t border-border/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything you need to master AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete learning platform with interactive exercises, real-time AI chat, and beautiful response formatting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border/30 bg-card/40 p-6 hover:bg-card/70 hover:border-border/50 transition-all group"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}12` }}
                >
                  <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 border-t border-border/15">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-4">
                <Terminal className="h-3 w-3" />
                BEAUTIFUL RESPONSES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                AI responses that look{" "}
                <span className="text-primary">amazing</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                No more ugly plain text. Every AI response is beautifully formatted with proper headings,
                syntax-highlighted code blocks, tables, and structured layouts — like Notion and ChatGPT had a baby.
              </p>
              <div className="space-y-4">
                {[
                  "Syntax-highlighted code blocks with copy buttons",
                  "Structured headings, lists, and tables",
                  "Notion-style formatting with emerald accents",
                  "ASCII art and diagram support",
                  "Mobile-optimized responsive rendering",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code block preview */}
            <div className="rounded-2xl border border-border/40 bg-[#0d1117] overflow-hidden shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-[#161b22]">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">prompt-builder.ts</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                <code className="text-foreground/80">
                  {codeExample.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-muted-foreground/40 w-8 shrink-0 text-right mr-4 select-none text-xs leading-relaxed">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: line
                            .replace(
                              /(\/\/.*)/g,
                              '<span class="text-emerald-500/70">$1</span>'
                            )
                            .replace(
                              /\b(const|await|import|from)\b/g,
                              '<span class="text-purple-400">$1</span>'
                            )
                            .replace(
                              /(".*?")/g,
                              '<span class="text-emerald-400">$1</span>'
                            )
                            .replace(
                              /\b(true|false)\b/g,
                              '<span class="text-orange-400">$1</span>'
                            ),
                        }}
                      />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 px-4 border-t border-border/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-4">
              <Star className="h-3 w-3" />
              TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Loved by professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border/30 bg-card/40 p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <div className="font-medium text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 border-t border-border/15">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to master AI for your role?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join professionals who are leveling up their AI skills with hands-on training designed for their specific role.
            </p>
            <Button
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 h-13 shadow-[0_0_30px_rgba(62,207,142,0.3)] hover:shadow-[0_0_40px_rgba(62,207,142,0.4)] transition-all"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/15 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold text-sm">AI App Buddy Pro</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#tracks" className="hover:text-foreground transition-colors">Tracks</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            </div>
            <span className="text-xs text-muted-foreground">Built with AI, for AI learners</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
