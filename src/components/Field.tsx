import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface FieldBase { label: string; id: string; error?: string }
type InputProps = FieldBase & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;
type TextareaProps = FieldBase & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;
type SelectProps = FieldBase & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { children: ReactNode };

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? <p id={`${id}-error`} className="text-caption mt-8">{error}</p> : null;
}

export function Input({ label, id, error, ...props }: InputProps) {
  return <div className="field-group"><label htmlFor={id}>{label}</label><input {...props} id={id} className="form-field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} /><FieldError id={id} error={error} /></div>;
}

export function Textarea({ label, id, error, ...props }: TextareaProps) {
  return <div className="field-group"><label htmlFor={id}>{label}</label><textarea {...props} id={id} className="form-field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} /><FieldError id={id} error={error} /></div>;
}

export function Select({ label, id, error, children, ...props }: SelectProps) {
  return <div className="field-group"><label htmlFor={id}>{label}</label><select {...props} id={id} className="form-field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>{children}</select><FieldError id={id} error={error} /></div>;
}
