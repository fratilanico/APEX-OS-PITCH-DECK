import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, BookOpen, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrackDetail({ trackId }: { trackId: string }) {
  const [, setLocation] = useLocation();
  const trackQuery = trpc.tracks.get.useQuery({ trackId });
  const progressQuery = trpc.progress.getByTrack.useQuery({ track: trackId });

  const track = trackQuery.data;
  const progress = progressQuery.data || [];

  if (trackQuery.isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-96" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">Track not found.</p>
        <Button variant="ghost" onClick={() => setLocation("/app/tracks")} className="mt-4">
          Back to Tracks
        </Button>
      </div>
    );
  }

  const totalExercises = track.modules.reduce((s, m) => s + m.exercises.length, 0);
  const completed = progress.filter((p) => p.completed).length;
  const pct = totalExercises > 0 ? Math.round((completed / totalExercises) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/app/tracks")}
          className="text-muted-foreground hover:text-foreground mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> All Tracks
        </Button>
        <div className="flex items-start gap-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 text-2xl"
            style={{ backgroundColor: `${track.color}15`, color: track.color }}
          >
            {track.icon === "TrendingUp" && "📈"}
            {track.icon === "Code2" && "💻"}
            {track.icon === "Megaphone" && "📣"}
            {track.icon === "Rocket" && "🚀"}
            {track.icon === "Zap" && "⚡"}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {track.name}
            </h1>
            <p className="text-muted-foreground mt-1">{track.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: track.color }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: track.color }}>
                  {pct}%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {completed}/{totalExercises} exercises
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {track.modules.map((mod, idx) => {
          const modCompleted = progress.filter(
            (p) => p.moduleId === mod.id && p.completed
          ).length;
          const modTotal = mod.exercises.length;
          const modPct = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0;
          const isComplete = modPct === 100;

          return (
            <button
              key={mod.id}
              onClick={() => setLocation(`/app/tracks/${trackId}/${mod.id}`)}
              className="w-full rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card hover:border-border transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted/50 shrink-0">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{mod.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{mod.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" /> {modTotal} exercises
                    </span>
                    <span className="text-xs" style={{ color: track.color }}>
                      {modCompleted}/{modTotal} done
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
