import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getInstructor } from "@/lib/data/instructors";
import type { Post } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  featured,
  priority,
  headingLevel = 2,
}: {
  post: Post;
  featured?: boolean;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const t = useTranslations("Blog");
  const locale = useLocale() as Locale;
  const author = getInstructor(post.authorId);

  return (
    <div className="group h-full">
      <article
        className={cn(
          "relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-[translate,box-shadow] duration-300 ease-out will-change-[translate] group-hover:-translate-y-1 group-hover:shadow-xl motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
          featured && "lg:grid lg:grid-cols-[1.2fr_1fr]",
        )}
      >
        <div
          className={cn(
            "relative aspect-[16/9] overflow-hidden bg-muted",
            featured && "lg:aspect-auto lg:min-h-96",
          )}
        >
          <Image
            src={post.image}
            alt={post.imageAlt[locale]}
            fill
            priority={priority}
            sizes={
              featured
                ? "(min-width: 1024px) 640px, 100vw"
                : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className={cn("flex flex-1 flex-col gap-3 p-6", featured && "lg:justify-center lg:p-10")}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {featured ? (
              <span className="rounded-full bg-coral px-2.5 py-0.5 font-semibold text-foreground">
                {t("featured")}
              </span>
            ) : null}
            {post.tags.map((tag) => (
              <span key={tag.en} className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-primary">
                {tag[locale]}
              </span>
            ))}
          </div>
          <Heading
            className={cn(
              "font-semibold tracking-tight text-balance",
              featured ? "text-2xl lg:text-3xl" : "text-lg",
            )}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {post.title[locale]}
            </Link>
          </Heading>
          <p className={cn("text-muted-foreground", featured ? "text-base" : "line-clamp-3 text-sm")}>
            {post.excerpt[locale]}
          </p>
          <div className="mt-auto flex items-center gap-3 pt-3 text-sm">
            {author ? (
              <Image
                src={author.avatar}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
            ) : null}
            <div className="flex flex-col">
              <span className="font-medium">{author?.name}</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date, locale, "short")}</time> ·
                <ClockIcon aria-hidden="true" className="size-3" />
                {t("readTime", { minutes: post.readMinutes })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
