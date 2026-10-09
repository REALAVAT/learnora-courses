import type { MDXComponents } from "mdx/types";
import { InfoIcon } from "lucide-react";

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 flex gap-3 rounded-2xl border border-primary/20 bg-indigo-soft p-5">
      <InfoIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="text-[0.95rem] leading-relaxed [&>p]:m-0">
        {title ? <p className="mb-1 font-semibold text-foreground">{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold" {...props} />,
  p: (props) => <p className="my-5 text-[1.05rem] leading-[1.8] text-pretty text-foreground/85" {...props} />,
  ul: (props) => <ul className="my-5 flex list-disc flex-col gap-2 pl-6 marker:text-primary" {...props} />,
  ol: (props) => (
    <ol
      className="my-5 flex list-decimal flex-col gap-2 pl-6 marker:font-semibold marker:text-primary"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1 text-[1.05rem] leading-[1.75] text-foreground/85" {...props} />,
  a: (props) => (
    <a className="font-medium text-primary underline underline-offset-4 hover:no-underline" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-4 border-coral pl-5 text-xl leading-relaxed font-medium text-foreground [&>p]:text-xl [&>p]:text-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: (props) => <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-2xl bg-[oklch(0.22_0.04_282)] p-5 font-mono text-sm leading-relaxed text-white [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
