"use client";

import type { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)] ${className}`.trim()}
      {...props}
    />
  );
}