import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  Code2,
  Megaphone,
  Rocket,
  Zap,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
} from "lucide-react";
import { TRACKS } from "../../../shared/tracks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const trackIcons: Record<string, any> = {
  sales: TrendingUp,
  engineering: Code2,
  marketing: Megaphone,
  founders: Rocket,
  productivity: Zap,
};

const trackColors: Record<string, string> = {
  sales: "#3ECF8E",
  engineering: "#6C63FF",
  marketing: "#F97316",
  founders: "#EC4899",
  productivity: "#FACC15",
};

export default function Progress() {
  const progressQuery = trpc.progress.getAll.useQuery();
  const progress = progressQuery.data || [];
  const completedExercises = progress.filter((p) => p.completed).length;
  const totalExercises = TRACKS.reduce(
    (sum, t) => sum + t.modules.reduce((s, m) => s + m.exercises.length, 0),
    0
  );
  const overallPct = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // Track-level data
  const trackData = TRACKS.map((track) => {
    const trackExercises = track.modules.reduce((s, m) => s + m.exercises.length, 0);
    const trackCompleted = progress.filter((p) => p.track === track.id && p.completed).length;
    const pct = trackExercises > 0 ? Math.round((trackCompleted / trackExercises) * 100) : 0;
    return {
      name: track.name,
      id: track.id,
      completed: trackCompleted,
      total: trackExercises,
      pct,
      color: trackColors[track.id] || "#3ECF8E",
    };
  });

  // Difficulty breakdown
  const difficultyData = [
    {
      name: "Beginner",
      value: progress.filter((p) => {
        if (!p.exerciseId) return false;
        const ex = findExercise(p.exerciseId);
        return ex?.difficulty === "beginner" && p.completed;
      }).length,
      color: "#3ECF8E",
    },
    {
      name: "Intermediate",
      value: progress.filter((p) => {
        if (!p.exerciseId) return false;
        const ex = findExercise(p.exerciseId);
        return ex?.difficulty === "intermediate" && p.completed;
      }).length,
      color: "#FACC15",
    },
    {
      name: "Advanced",
      value: progress.filter((p) => {
        if (!p.exerciseId) return false;
        const ex = findExercise(p.exerciseId);
        return ex?.difficulty === "advanced" && p.completed;
      }).length,
      color: "#F97316",
    },
  ];

  // Radial chart data
  const radialData = [
    { name: "Progress", value: overallPct, fill: "#3ECF8E" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Progress Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your AI learning journey across all tracks and modules.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Overall</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{overallPct}%</p>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#6C63FF]" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{completedExercises}</p>
          <p className="text-xs text-muted-foreground mt-1">of {totalExercises} exercises</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
              <Trophy className="h-4.5 w-4.5 text-[#F97316]" />
            </div>
            <span className="text-sm text-muted-foreground">Tracks Started</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {trackData.filter((t) => t.completed > 0).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">of 5 tracks</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-[#EC4899]/10 flex items-center justify-center">
              <Flame className="h-4.5 w-4.5 text-[#EC4899]" />
            </div>
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {completedExercises > 0 ? Math.min(completedExercises, 7) : 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">day streak</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Progress Bar Chart */}
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <h3 className="font-semibold text-foreground mb-4">Track Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "oklch(0.8 0 0)", fontSize: 12 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.005 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                  formatter={(value: number) => [`${value}%`, "Progress"]}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {trackData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <h3 className="font-semibold text-foreground mb-4">Difficulty Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            {completedExercises > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.005 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Complete exercises to see your difficulty breakdown</p>
              </div>
            )}
          </div>
          {completedExercises > 0 && (
            <div className="flex justify-center gap-6 mt-2">
              {difficultyData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Track Breakdown */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4 text-foreground">
          Detailed Breakdown
        </h2>
        <div className="space-y-3">
          {TRACKS.map((track) => {
            const Icon = trackIcons[track.id] || Target;
            const data = trackData.find((t) => t.id === track.id)!;

            return (
              <div key={track.id} className="rounded-xl border border-border/40 bg-card/50 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${data.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: data.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{track.name}</h3>
                      <span className="text-sm font-medium" style={{ color: data.color }}>
                        {data.pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${data.pct}%`, backgroundColor: data.color }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {track.modules.slice(0, 4).map((mod) => {
                    const modCompleted = progress.filter(
                      (p) => p.moduleId === mod.id && p.completed
                    ).length;
                    const modTotal = mod.exercises.length;
                    return (
                      <div
                        key={mod.id}
                        className="rounded-lg bg-muted/30 p-3 border border-border/20"
                      >
                        <p className="text-xs font-medium text-foreground truncate mb-1">
                          {mod.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {modCompleted}/{modTotal} done
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper to find exercise by ID across all tracks
function findExercise(exerciseId: string) {
  for (const track of TRACKS) {
    for (const mod of track.modules) {
      const ex = mod.exercises.find((e) => e.id === exerciseId);
      if (ex) return ex;
    }
  }
  return null;
}
