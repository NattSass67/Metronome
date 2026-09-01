import Image from "next/image";
import { SUBDIVISION_IMAGES } from "@/lib/subdivisionDisplay";
import type { Subdivision } from "@/lib/types";
import { cn } from "@/lib/utils";

type SubdivisionNoteIconProps = {
  subdivision: Subdivision;
  className?: string;
};

export function SubdivisionNoteIcon({ subdivision, className }: SubdivisionNoteIconProps) {
  return (
    <Image
      src={SUBDIVISION_IMAGES[subdivision]}
      alt=""
      width={40}
      height={40}
      className={cn("size-9 object-contain dark:invert", className)}
      aria-hidden
    />
  );
}
