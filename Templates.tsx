import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Search,
  TrendingUp,
  Code2,
  Megaphone,
  Rocket,
  Zap,
  FileText,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PROMPT_TEMPLATES } from "../../../shared/tracks";

const trackFilters = [
  { id: "all", name: "All", icon: FileText },
  { id: "sales", name: "Sales", icon: TrendingUp },
  { id: "engineering", name: "Engineering", icon: Code2 },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "founders", name: "Founders", icon: Rocket },
  { id: "productivity", name: "Productivity", icon: Zap },
];

const categoryColors: Record<string, string> = {
  sales: "#3ECF8E",
  engineering: "#6C63FF",
  marketing: "#F97316",
  founders: "#EC4899",
  productivity: "#FACC15",
};

export default function Templates() {
  const { user } = useAuth();
  const [activeTrack, setActiveTrack] = useState("all");
  const [search, setSearch] = useState("");
  const savedQuery = trpc.templates.saved.useQuery(undefined, { enabled: !!user });
  const saveMutation = trpc.templates.save.useMutation();
  const unsaveMutation = trpc.templates.unsave.useMutation();
  const utils = trpc.useUtils();

  const savedIds = useMemo(
    () => new Set((savedQuery.data || []).map((s) => s.templateId)),
    [savedQuery.data]
  );

  const filtered = useMemo(() => {
    let templates = PROMPT_TEMPLATES;
    if (activeTrack !== "all") {
      templates = templates.filter((t) => t.trackId === activeTrack);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.template.toLowerCase().includes(q)
      );
    }
    return templates;
  }, [activeTrack, search]);

  const toggleSave = async (templateId: string) => {
    if (savedIds.has(templateId)) {
      await unsaveMutation.mutateAsync({ templateId });
    } else {
      await saveMutation.mutateAsync({ templateId });
    }
    utils.templates.saved.invalidate();
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Prompt Templates
        </h1>
        <p className="text-muted-foreground mt-1">
          Battle-tested prompt templates for every professional role. Copy, customize, and use.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-card/50 border border-border/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {trackFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveTrack(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTrack === filter.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-card/50 text-muted-foreground border border-border/30 hover:text-foreground hover:bg-card"
              }`}
            >
              <filter.icon className="h-3.5 w-3.5" />
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template) => {
          const isSaved = savedIds.has(template.id);
          const color = categoryColors[template.trackId] || "#3ECF8E";

          return (
            <div
              key={template.id}
              className="rounded-xl border border-border/40 bg-card/50 p-5 hover:bg-card transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                      }}
                    >
                      {template.trackId}
                    </span>
                    <span className="text-xs text-muted-foreground">{template.category}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{template.title}</h3>
                </div>
                {user && (
                  <button
                    onClick={() => toggleSave(template.id)}
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-4.5 w-4.5 text-primary" />
                    ) : (
                      <Bookmark className="h-4.5 w-4.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {template.description}
              </p>
              <div className="bg-muted/30 rounded-lg p-3 mb-4 border border-border/20">
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed line-clamp-4">
                  {template.template}
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyPrompt(template.template)}
                className="text-muted-foreground hover:text-foreground border-border/50"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Prompt
              </Button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No templates found matching your search.</p>
        </div>
      )}
    </div>
  );
}
