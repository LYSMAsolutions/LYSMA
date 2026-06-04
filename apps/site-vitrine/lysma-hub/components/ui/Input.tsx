import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`lysma-input ${className}`.trim()} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`lysma-input lysma-textarea ${className}`.trim()} {...props} />;
}
