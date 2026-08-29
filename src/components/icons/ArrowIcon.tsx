import type { SVGProps } from "react";

export default function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 10 14"
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M2 1l6 6-6 6" />
    </svg>
  );
}
