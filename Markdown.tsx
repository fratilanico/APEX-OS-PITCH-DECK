/**
 * Markdown Component - Beautiful Notion-style rendering
 * with enhanced code blocks, tables, and formatting
 */

import { memo, type ReactNode, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { cn } from "@/lib/utils";

const components = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="text-2xl font-bold tracking-tight mt-8 mb-4 first:mt-0 text-foreground border-b border-border/30 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="text-xl font-semibold tracking-tight mt-7 mb-3 first:mt-0 text-foreground flex items-center gap-2">
      <span className="inline-block w-1 h-5 bg-emerald-500 rounded-full" />
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="text-lg font-semibold tracking-tight mt-5 mb-2 first:mt-0 text-emerald-400">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="text-base font-semibold mt-4 mb-1.5 first:mt-0 text-foreground/90">{children}</h4>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3.5 leading-7 last:mb-0 text-foreground/85">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-400 underline underline-offset-4 decoration-emerald-400/40 hover:decoration-emerald-400 transition-colors font-medium"
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-foreground/75">{children}</em>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="pl-5 mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-emerald-500">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-7 text-foreground/85 relative pl-2 before:content-['•'] before:text-emerald-500 before:font-bold before:absolute before:-left-3 before:top-0 [ol_&]:before:content-none [ol_&]:pl-0">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-emerald-500/60 pl-4 italic text-foreground/70 my-5 bg-emerald-500/5 py-3 px-4 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border/40 my-8" />,
  table: ({ children }: { children?: ReactNode }) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-border/40 bg-card/30">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => (
    <thead className="bg-emerald-500/5 border-b border-border/40">{children}</thead>
  ),
  tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children?: ReactNode }) => (
    <tr className="border-b border-border/20 hover:bg-muted/20 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="px-4 py-3 text-left font-semibold text-emerald-400 text-xs uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="px-4 py-3 text-foreground/85">{children}</td>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt || ""} className="max-w-full h-auto rounded-xl my-5 border border-border/30" />
  ),
};

type MarkdownProps = Omit<ComponentProps<typeof Streamdown>, "components"> & {
  components?: Partial<typeof components>;
};

export const Markdown = memo(function Markdown({
  className,
  children,
  components: customComponents,
  shikiTheme = ["github-light", "github-dark"],
  controls = true,
  ...props
}: MarkdownProps) {
  return (
    <Streamdown
      className={cn("text-foreground leading-relaxed", className)}
      components={{ ...components, ...customComponents }}
      shikiTheme={shikiTheme}
      controls={controls}
      {...props}
    >
      {children}
    </Streamdown>
  );
});

export { components as markdownComponents };
export default Markdown;
