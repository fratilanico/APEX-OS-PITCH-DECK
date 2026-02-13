import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  MessageSquare,
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Code2,
  Megaphone,
  Rocket,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useLocation } from "wouter";
import { TRACKS } from "../../../shared/tracks";

const trackIcons: Record<string, any> = {
  sales: TrendingUp,
  engineering: Code2,
  marketing: Megaphone,
  founders: Rocket,
  productivity: Zap,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const progressQuery = trpc.progress.getAll.useQuery();
  const chatsQuery = trpc.chat.list.useQuery();

  const progress = progressQuery.data || [];
  const chats = chatsQuery.data || [];
  const completedExercises = progress.filter((p) => p.completed).length;
  const totalExercises = TRACKS.reduce(
    (sum, t) => sum + t.modules.reduce((s, m) => s + m.exercises.length, 0),
    0
  );
  const completionPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Continue your AI skills training journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{completedExercises}</p>
          <p className="text-xs text-muted-foreground mt-1">of {totalExercises} exercises</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-[#6C63FF]" />
            </div>
            <span className="text-sm text-muted-foreground">Progress</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{completionPercent}%</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
              <MessageSquare className="h-4.5 w-4.5 text-[#F97316]" />
            </div>
            <span className="text-sm text-muted-foreground">Chats</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{chats.length}</p>
          <p className="text-xs text-muted-foreground mt-1">conversations</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#EC4899]/10 flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-[#EC4899]" />
            </div>
            <span className="text-sm text-muted-foreground">Tracks</span>
          </div>
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground mt-1">learning paths</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setLocation("/app/chat")}
          className="rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card hover:border-primary/30 transition-all text-left group"
        >
          <MessageSquare className="h-6 w-6 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-1">AI Chat Playground</h3>
          <p className="text-sm text-muted-foreground">Start a new conversation with your AI assistant</p>
          <div className="flex items-center gap-1 text-primary text-sm mt-3 group-hover:gap-2 transition-all">
            Open Chat <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
        <button
          onClick={() => setLocation("/app/tracks")}
          className="rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card hover:border-primary/30 transition-all text-left group"
        >
          <GraduationCap className="h-6 w-6 text-[#6C63FF] mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Learning Tracks</h3>
          <p className="text-sm text-muted-foreground">Browse modules and exercises for your role</p>
          <div className="flex items-center gap-1 text-[#6C63FF] text-sm mt-3 group-hover:gap-2 transition-all">
            Browse Tracks <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
        <button
          onClick={() => setLocation("/app/templates")}
          className="rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card hover:border-primary/30 transition-all text-left group"
        >
          <FileText className="h-6 w-6 text-[#F97316] mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Prompt Templates</h3>
          <p className="text-sm text-muted-foreground">Use pre-built templates for your specific role</p>
          <div className="flex items-center gap-1 text-[#F97316] text-sm mt-3 group-hover:gap-2 transition-all">
            View Templates <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>

      {/* Track Progress */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4 text-foreground">Track Progress</h2>
        <div className="space-y-3">
          {TRACKS.map((track) => {
            const Icon = trackIcons[track.id] || Sparkles;
            const trackExercises = track.modules.reduce(
              (sum, m) => sum + m.exercises.length,
              0
            );
            const trackCompleted = progress.filter(
              (p) => p.track === track.id && p.completed
            ).length;
            const pct = trackExercises > 0 ? Math.round((trackCompleted / trackExercises) * 100) : 0;

            return (
              <button
                key={track.id}
                onClick={() => setLocation(`/app/tracks/${track.id}`)}
                className="w-full rounded-xl border border-border/40 bg-card/50 p-4 hover:bg-card hover:border-border transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${track.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: track.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground">{track.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {trackCompleted}/{trackExercises}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: track.color }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent Chats</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/app/chat")}
              className="text-muted-foreground hover:text-foreground"
            >
              View all
            </Button>
          </div>
          <div className="space-y-2">
            {chats.slice(0, 5).map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => setLocation(`/app/chat/${chat.chatId}`)}
                className="w-full rounded-lg border border-border/30 bg-card/30 p-3 hover:bg-card hover:border-border/50 transition-all text-left flex items-center gap-3"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{chat.title}</span>
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
