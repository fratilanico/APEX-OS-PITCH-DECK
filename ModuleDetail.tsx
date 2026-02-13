import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, MessageSquare, CheckCircle2, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

const difficultyColors: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-yellow-400 bg-yellow-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

const typeLabels: Record<string, string> = {
  "prompt-craft": "Prompt Crafting",
  "chat-practice": "Chat Practice",
  "analysis": "Analysis",
  "template-use": "Template Use",
};

export default function ModuleDetail({ trackId, moduleId }: { trackId: string; moduleId: string }) {
  const [, setLocation] = useLocation();
  const moduleQuery = trpc.tracks.getModule.useQuery({ trackId, moduleId });
  const progressQuery = trpc.progress.getByTrack.useQuery({ track: trackId });
  const createChatMutation = trpc.chat.create.useMutation();

  const mod = moduleQuery.data;
  const progress = progressQuery.data || [];

  const startExercise = async (exerciseId: string, exerciseTitle: string) => {
    const chatId = nanoid();
    await createChatMutation.mutateAsync({
      chatId,
      title: exerciseTitle,
      track: trackId,
      moduleId,
    });
    setLocation(`/app/chat/${chatId}?track=${trackId}&module=${moduleId}&exercise=${exerciseId}`);
  };

  if (moduleQuery.isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-96" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">Module not found.</p>
        <Button variant="ghost" onClick={() => setLocation(`/app/tracks/${trackId}`)} className="mt-4">
          Back to Track
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation(`/app/tracks/${trackId}`)}
          className="text-muted-foreground hover:text-foreground mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Track
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {mod.title}
        </h1>
        <p className="text-muted-foreground mt-1">{mod.description}</p>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Exercises</h2>
        {mod.exercises.map((exercise) => {
          const isCompleted = progress.some(
            (p) => p.exerciseId === exercise.id && p.completed
          );

          return (
            <div
              key={exercise.id}
              className="rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{exercise.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {exercise.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[exercise.difficulty]}`}
                    >
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {typeLabels[exercise.type]}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startExercise(exercise.id, exercise.title)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={createChatMutation.isPending}
                  >
                    {isCompleted ? (
                      <>
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Practice Again
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Start Exercise
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
