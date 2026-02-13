import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  TrendingUp,
  Code2,
  Megaphone,
  Rocket,
  Zap,
  ArrowRight,
  BookOpen,
  Dumbbell,
} from "lucide-react";

const trackIcons: Record<string, any> = {
  sales: TrendingUp,
  engineering: Code2,
  marketing: Megaphone,
  founders: Rocket,
  productivity: Zap,
};

export default function Tracks() {
  const [, setLocation] = useLocation();
  const tracksQuery = trpc.tracks.list.useQuery();
  const progressQuery = trpc.progress.getAll.useQuery();

  const tracks = tracksQuery.data || [];
  const progress = progressQuery.data || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Learning Tracks
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose your professional track and start mastering AI tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tracks.map((track) => {
          const Icon = trackIcons[track.id] || BookOpen;
          const trackCompleted = progress.filter(
            (p) => p.track === track.id && p.completed
          ).length;
          const pct =
            track.exerciseCount > 0
              ? Math.round((trackCompleted / track.exerciseCount) * 100)
              : 0;

          return (
            <button
              key={track.id}
              onClick={() => setLocation(`/app/tracks/${track.id}`)}
              className="rounded-xl border border-border/40 bg-card/50 p-6 hover:bg-card hover:border-border transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${track.color}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: track.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {track.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {track.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {track.moduleCount} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-3.5 w-3.5" />
                      {track.exerciseCount} exercises
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: track.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: track.color }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm mt-4 group-hover:gap-2 transition-all" style={{ color: track.color }}>
                Start Learning <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
