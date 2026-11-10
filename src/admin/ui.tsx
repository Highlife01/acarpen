import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LEAD_STATUS_LABELS, PUBLISH_STATUS_LABELS, type LeadStatus, type PublishStatus } from "@/lib/types";

/** Panel form alanları için ortak sınıf (marka `.field-input` sınıfının sıkı hâli). */
export const inputClass = "field-input min-h-[42px] py-2 text-base md:text-sm";
export const copperButtonClass = "bg-copper text-night hover:bg-copper-light";

/* ---------- Form alanları ---------- */

interface FieldControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/** Etiket, yardım metni ve hata mesajını girişe bağlayan genel alan sarmalayıcısı. */
export function Field({ label, error, hint, required, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-slate2">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type CommonFieldProps = Pick<FieldProps, "label" | "error" | "hint" | "required"> & { wrapperClassName?: string };

export function TextField({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  ...rest
}: CommonFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      {(control) => <input {...rest} {...control} required={required} className={cn(inputClass, className)} />}
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  ...rest
}: CommonFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      {(control) => <textarea rows={4} {...rest} {...control} required={required} className={cn(inputClass, className)} />}
    </Field>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  children,
  ...rest
}: CommonFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      {(control) => (
        <select {...rest} {...control} required={required} className={cn(inputClass, className)}>
          {children}
        </select>
      )}
    </Field>
  );
}

export function CharCounter({ value, recommended }: { value: string; recommended: number }) {
  const length = value.length;
  const over = length > recommended;
  return (
    <span className={cn(over ? "font-medium text-destructive" : "text-slate2")}>
      {length} / {recommended} karakter{over ? " — önerilen uzunluk aşıldı" : ""}
    </span>
  );
}

/* ---------- Sayfa iskeleti ---------- */

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm text-slate2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />;
}

export function LoadingBlock({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate2" role="status" aria-live="polite">
      <Spinner className="h-5 w-5 text-copper-dark" />
      {label}
    </div>
  );
}

export function FullScreenLoader({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist">
      <LoadingBlock label={label} />
    </div>
  );
}

export function EmptyState({ title = "Veri yok", description, action }: { title?: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
      <Inbox className="h-8 w-8 text-slate2/70" aria-hidden="true" />
      <p className="mt-3 font-semibold text-night">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-slate2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function InfoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-copper/40 bg-copper-light/20 px-4 py-3 text-sm text-ink", className)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <div className={cn("card-surface p-4", tone === "accent" && "border-copper/60 bg-copper-light/15")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate2">{label}</p>
      <p className="mt-2 break-words font-display text-2xl font-extrabold text-night">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate2">{hint}</p>}
    </div>
  );
}

/* ---------- Rozetler ---------- */

const badgeBase = "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold";

const LEAD_STATUS_TONES: Record<LeadStatus, string> = {
  new: "border-copper bg-copper-light/40 text-night",
  to_contact: "border-amber-300 bg-amber-50 text-amber-900",
  contacted: "border-sky-200 bg-sky-50 text-sky-900",
  survey_planned: "border-indigo-200 bg-indigo-50 text-indigo-900",
  quote_preparing: "border-violet-200 bg-violet-50 text-violet-900",
  quote_sent: "border-blue-200 bg-blue-50 text-blue-900",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-900",
  rejected: "border-red-200 bg-red-50 text-red-900",
  completed: "border-slate-300 bg-slate-100 text-slate-800",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={cn(badgeBase, LEAD_STATUS_TONES[status] ?? LEAD_STATUS_TONES.completed)}>{LEAD_STATUS_LABELS[status] ?? status}</span>;
}

const PUBLISH_TONES: Record<PublishStatus, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-800",
  review: "border-amber-300 bg-amber-50 text-amber-900",
  published: "border-emerald-200 bg-emerald-50 text-emerald-900",
  archived: "border-slate-200 bg-white text-slate-500",
};

export function PublishStatusBadge({ status }: { status: PublishStatus }) {
  return <span className={cn(badgeBase, PUBLISH_TONES[status] ?? PUBLISH_TONES.draft)}>{PUBLISH_STATUS_LABELS[status] ?? status}</span>;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(badgeBase, "border-border bg-mist text-ink", className)}>{children}</span>;
}

/* ---------- Basit, erişilebilir çubuk grafikler ---------- */

export interface BarItem {
  label: string;
  value: number;
}

/** Yatay çubuk listesi: değerler metin olarak da yazılır, çubuklar dekoratiftir. */
export function BarList({ items, emptyLabel = "Veri yok", max = 10 }: { items: BarItem[]; emptyLabel?: string; max?: number }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (items.length === 0 || total === 0) return <p className="py-6 text-center text-sm text-slate2">{emptyLabel}</p>;
  const shown = items.slice(0, max);
  const rest = items.slice(max).reduce((sum, item) => sum + item.value, 0);
  const rows = rest > 0 ? [...shown, { label: "Diğer", value: rest }] : shown;
  const peak = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 break-words text-ink">{item.label}</span>
            <span className="shrink-0 tabular-nums text-slate2">
              <strong className="text-night">{item.value}</strong> · %{Math.round((item.value / total) * 100)}
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-mist" aria-hidden="true">
            <div className="h-2 rounded-full bg-copper" style={{ width: `${Math.max(2, (item.value / peak) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Dikey sütun grafiği (zaman serileri için). Değerler sütunların üzerinde metin olarak yer alır. */
export function ColumnChart({ items, caption }: { items: BarItem[]; caption: string }) {
  const peak = Math.max(0, ...items.map((i) => i.value));
  if (peak === 0) return <p className="py-6 text-center text-sm text-slate2">Veri yok</p>;
  return (
    <figure>
      <ol className="flex h-44 items-end gap-2" aria-label={caption}>
        {items.map((item) => (
          <li key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs font-semibold tabular-nums text-night">
              {item.value}
              <span className="sr-only"> talep, {item.label}</span>
            </span>
            <div
              className="w-full max-w-[44px] rounded-t bg-copper"
              style={{ height: `${item.value === 0 ? 1 : Math.max(4, (item.value / peak) * 100)}%` }}
              aria-hidden="true"
            />
            <span className="w-full truncate text-center text-[11px] text-slate2" aria-hidden="true">
              {item.label}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-2 text-xs text-slate2">{caption}</figcaption>
    </figure>
  );
}

/* ---------- Onay penceresi ---------- */

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, busy, destructive = true, onConfirm }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Vazgeç</AlertDialogCancel>
          <Button type="button" variant={destructive ? "destructive" : "default"} disabled={busy} onClick={onConfirm}>
            {busy && <Spinner />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
