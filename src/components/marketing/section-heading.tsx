import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  action,
  align = "left",
  id,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("flex max-w-2xl flex-col gap-2", align === "center" && "items-center")}>
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="text-base text-pretty text-muted-foreground sm:text-lg">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
