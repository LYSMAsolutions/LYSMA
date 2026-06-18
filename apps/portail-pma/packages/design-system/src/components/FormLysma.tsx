import type { FormHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "../utils";

type FormLysmaProps = FormHTMLAttributes<HTMLFormElement> & {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function FormLysma({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: FormLysmaProps) {
  return (
    <form className={cx("lysma-form", className)} {...props}>
      {title || description ? (
        <header className="lysma-form__header">
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </header>
      ) : null}
      <div className="lysma-form__body">{children}</div>
      {actions ? <footer className="lysma-form__actions">{actions}</footer> : null}
    </form>
  );
}

type FieldLysmaProps = {
  label: string;
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
};

export function FieldLysma({ label, id, hint, error, required, children }: FieldLysmaProps) {
  return (
    <div className={cx("lysma-field", Boolean(error) && "lysma-field--error")}>
      <label className="lysma-field__label" htmlFor={id}>
        <span>{label}</span>
        {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="lysma-field__message" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="lysma-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function InputLysma({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("lysma-input", className)} {...props} />;
}

export function TextareaLysma({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx("lysma-input", "lysma-textarea", className)} {...props} />;
}
