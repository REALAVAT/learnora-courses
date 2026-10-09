"use client";

import { Price } from "./price";
import { EnrollActions } from "./enroll-actions";

export function MobileEnrollBar(props: {
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  firstLessonId: string;
}) {
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgb(0_0_0/0.15)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <Price price={props.price} originalPrice={props.originalPrice} className="shrink-0 flex-col gap-0" />
        <EnrollActions
          slug={props.slug}
          title={props.title}
          price={props.price}
          firstLessonId={props.firstLessonId}
          className="flex-1"
          compact
        />
      </div>
    </div>
  );
}
