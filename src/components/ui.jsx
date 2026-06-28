export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles({
  variant = "primary",
  icon = false,
  className = "",
} = {}) {
  const variants = {
    primary:
      "border-transparent bg-[var(--color-brand-orange-500)] text-white hover:bg-[#eb6500]",
    secondary:
      "border-transparent bg-[var(--button-secondary-bg)] text-white hover:bg-[var(--button-secondary-hover)]",
    tertiary:
      "border-[var(--color-border-subtle)] bg-[var(--surface-elevated)] text-[var(--color-brand-foreground)] hover:bg-[var(--surface-elevated-hover)]",
    ghost:
      "border-transparent bg-transparent text-[var(--color-text-soft)] hover:bg-[var(--surface-elevated)] hover:text-[var(--color-text-strong)]",
    destructive:
      "border-[#f3c4c4] bg-[var(--color-danger-100)] text-[var(--color-danger-700)] hover:bg-[#f8d7d7]",
  };

  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 text-[14px] font-semibold whitespace-nowrap transition focus:outline-none focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]",
    icon ? "w-11 px-0 text-lg" : "",
    variants[variant],
    className,
  );
}

export function Panel({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-6 shadow-[var(--shadow-soft)] lg:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="grid gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
        {eyebrow}
      </p>
      <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
        {title}
      </h3>
      {description ? (
        <p className="max-w-3xl text-[15px] leading-7 text-[var(--color-text-soft)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Button({
  variant = "primary",
  icon = false,
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  title,
  ...props
}) {
  return (
    <button
      className={cn(
        buttonStyles({ variant, icon, className }),
        disabled ? "cursor-not-allowed opacity-60" : "",
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral:
      "border-[var(--color-border-subtle)] bg-[var(--badge-neutral-bg)] text-[var(--color-brand-foreground)]",
    status:
      "border-[var(--color-border-subtle)] bg-[var(--badge-neutral-bg)] text-[var(--color-brand-foreground)]",
    review:
      "border-transparent bg-[var(--badge-review-bg)] text-[var(--color-brand-blue-700)]",
    processing:
      "border-transparent bg-[var(--badge-review-bg)] text-[var(--color-brand-blue-700)]",
    quantify:
      "border-transparent bg-[var(--color-brand-cyan-100)] text-[var(--color-brand-blue-700)]",
    noQuantify:
      "border-transparent bg-[var(--color-warning-100)] text-[var(--color-warning-600)]",
    positive:
      "border-transparent bg-[var(--color-positive-100)] text-[var(--color-positive-600)]",
    critical:
      "border-transparent bg-[var(--color-critical-100)] text-[var(--color-critical-700)]",
    nr15: "border-transparent bg-[#edf0ff] text-[#354ab3]",
    esocial: "border-transparent bg-[#e7f6f2] text-[#0f7d67]",
    linach: "border-transparent bg-[#fff1e6] text-[#c96200]",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-[34px] w-fit max-w-full items-center justify-center rounded-full border px-[14px] text-[14px] font-semibold tracking-[-0.01em] whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Ativo: "positive",
    "Extração concluída": "processing",
    "Aguardando processamento": "review",
    "Lendo arquivo": "processing",
    Processando: "processing",
    "Revisão necessária": "review",
    "Aprovação pendente": "review",
    "Classificação pendente": "review",
    "Revisão pendente": "review",
    "Consulta indisponível": "review",
    Atenção: "review",
    Regular: "positive",
    "Restrição encontrada": "critical",
    "Não consultado": "neutral",
    "Documento ilegível": "critical",
    "Documento duplicado": "critical",
    "Documento não reconhecido": "critical",
    "Erro de leitura": "critical",
    Aberta: "critical",
    Bloqueante: "critical",
    "Em análise": "processing",
    Justificada: "review",
    "Evidência anexada": "processing",
    "Aguardando cliente": "review",
    "Aguardando fabricante": "review",
    "Aguardando responsável técnico": "review",
    Resolvida: "positive",
    "Resolvida com ressalva": "review",
    Selecionado: "positive",
    Aprovada: "positive",
    Cancelada: "critical",
    "Pré-orçamento gerado": "quantify",
    Planejada: "processing",
    "Em campo": "processing",
    Concluída: "positive",
    Enviado: "processing",
    Pendente: "review",
    Classificado: "processing",
    "Aprovado com ressalva": "review",
    "Recomendado para quantificação": "positive",
    "Não recomendado para quantificação": "review",
    Corrigido: "processing",
    Rascunho: "neutral",
    Aprovado: "positive",
    Revisado: "positive",
    Bloqueado: "critical",
  };

  return <Badge tone={map[status] || "neutral"}>{status}</Badge>;
}

export function RiskBadge({ level }) {
  const tone = {
    Baixa: "positive",
    Média: "review",
    Alta: "critical",
    Crítica: "critical",
  }[level] || "neutral";

  return <Badge tone={tone}>{level}</Badge>;
}

export function TechnicalBadge({ label, tone = "neutral" }) {
  return <Badge tone={tone}>{label}</Badge>;
}

export function Field({ label, children, full = false, helper }) {
  return (
    <label className={cn("grid gap-2", full ? "md:col-span-2" : "")}>
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-default)]">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

export function Input({ value, placeholder }) {
  return (
    <input
      readOnly
      value={value}
      placeholder={placeholder}
      className="min-h-12 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-4 text-[16px] text-[var(--color-text-default)] outline-none transition hover:border-[var(--color-border-strong)] focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]"
    />
  );
}

export function Select({ value }) {
  return (
    <div className="flex min-h-12 items-center justify-between rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-4 text-[16px] text-[var(--color-text-default)]">
      <span>{value}</span>
      <span className="text-sm text-[var(--color-text-soft)]">⌄</span>
    </div>
  );
}

export function Textarea({ value, rows = 4 }) {
  return (
    <textarea
      readOnly
      value={value}
      rows={rows}
      className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-4 py-3 text-[16px] leading-8 text-[var(--color-text-default)] outline-none transition hover:border-[var(--color-border-strong)] focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]"
    />
  );
}

export function CheckboxField({ label, checked = false, onChange, helper }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="flex items-start gap-3 rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]"
    >
      <span
        className={cn(
          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-[8px] border-[1.5px] transition",
          checked
            ? "border-[var(--color-brand-blue-500)] bg-[var(--color-brand-blue-500)] shadow-[0_0_0_5px_rgba(45,130,183,0.14)]"
            : "border-[var(--color-border-strong)] bg-[var(--surface-base)]",
        )}
      >
        <span
          className={cn(
            "h-[6px] w-[11px] -translate-y-px rotate-[-45deg] border-b-2 border-l-2 border-white",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <span className="grid gap-1">
        <span className="text-[15px] font-medium leading-6 text-[var(--color-text-default)]">
          {label}
        </span>
        {helper ? (
          <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
            {helper}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function RadioField({ label, checked = false, onChange, helper }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={() => onChange?.(true)}
      className="flex items-start gap-3 rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]"
    >
      <span
        className={cn(
          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition",
          checked
            ? "border-[var(--color-brand-blue-500)] bg-[var(--color-brand-blue-500)] shadow-[0_0_0_5px_rgba(45,130,183,0.14)]"
            : "border-[var(--color-border-strong)] bg-[var(--surface-base)]",
        )}
      >
        <span
          className={cn(
            "size-2.5 rounded-full bg-white",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <span className="grid gap-1">
        <span className="text-[15px] font-medium leading-6 text-[var(--color-text-default)]">
          {label}
        </span>
        {helper ? (
          <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
            {helper}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function SwitchField({ label, checked = false, onChange, helper }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="flex items-start gap-3 rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-[rgba(45,130,183,0.18)]"
    >
      <span
        className={cn(
          "relative mt-0.5 h-[28px] w-[48px] shrink-0 rounded-full border transition",
          checked
            ? "border-transparent bg-[var(--color-brand-cyan-500)]"
            : "border-[var(--color-border-strong)] bg-[var(--switch-off-bg)]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-[0_8px_20px_rgba(16,42,58,0.08)] transition",
            checked ? "left-[24px]" : "left-[3px]",
          )}
        />
      </span>
      <span className="grid gap-1">
        <span className="text-[15px] font-medium leading-6 text-[var(--color-text-default)]">
          {label}
        </span>
        {helper ? (
          <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
            {helper}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function TabRow({ items, activeId, onChange }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-1.5"
      role="tablist"
      aria-label="Tabs"
    >
      {items.map((item) => (
        <button
          key={item.id ?? item.label}
          type="button"
          role="tab"
          aria-selected={(item.id ?? item.label) === activeId}
          onClick={() => onChange?.(item.id ?? item.label)}
          className={cn(
            "inline-flex min-h-10 items-center justify-center rounded-[18px] px-4 py-2 text-[14px] font-semibold transition",
            (item.id ?? item.label) === activeId
              ? "bg-[var(--surface-base)] text-[var(--color-text-strong)] shadow-[var(--shadow-soft)]"
              : "text-[var(--color-text-soft)] hover:bg-[var(--surface-base)]/70 hover:text-[var(--color-text-default)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--color-text-soft)]">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span className={index === items.length - 1 ? "text-[var(--color-text-default)]" : ""}>
            {item.label}
          </span>
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  children,
  framed = true,
  className = "",
}) {
  const content = (
    <div className={cn("grid gap-6", className)}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="grid gap-3">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              {eyebrow}
            </p>
          ) : null}
          <div className="grid gap-2">
            <h1 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--color-text-strong)] sm:text-[40px]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-3xl text-[15px] leading-7 text-[var(--color-text-soft)]">
                {description}
              </p>
            ) : null}
          </div>
          {meta ? <div className="flex flex-wrap gap-3">{meta}</div> : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );

  if (!framed) {
    return content;
  }

  return <Panel>{content}</Panel>;
}

export function StatCard({ label, value, hint, tone = "default" }) {
  const toneClasses = {
    default: "bg-[var(--surface-base)]",
    info: "bg-[var(--alert-info-bg)]",
    positive: "bg-[var(--color-positive-100)]",
    critical: "bg-[var(--color-critical-100)]",
  };

  return (
    <Panel className={cn("grid gap-3", toneClasses[tone])}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <strong className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-strong)]">
        {value}
      </strong>
      {hint ? (
        <p className="text-[14px] leading-6 text-[var(--color-text-default)]">{hint}</p>
      ) : null}
    </Panel>
  );
}

export function SearchAndFilters({
  search,
  filters,
  actions,
  framed = true,
  className = "",
}) {
  const content = (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Busca">
            <Input value={search} />
          </Field>
          {filters}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );

  if (!framed) {
    return content;
  }

  return <Panel>{content}</Panel>;
}

export function DataTable({
  columns,
  rows,
  emptyState,
  framed = true,
  density = "default",
}) {
  if (!rows.length) {
    return <EmptyState {...emptyState} />;
  }

  const compact = density === "compact";

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border-subtle)] text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-soft)]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  compact ? "px-4 py-3 first:pl-5 last:pr-5" : "px-6 py-4 first:pl-7 last:pr-7",
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[14px] text-[var(--color-text-default)]">
          {rows.map((row, index) => (
            <tr
              key={row.id || index}
              className="border-b border-[var(--color-border-subtle)] last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "align-top",
                    compact ? "px-4 py-4 first:pl-5 last:pr-5" : "px-6 py-4 first:pl-7 last:pr-7",
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!framed) {
    return table;
  }

  return <Panel className="overflow-hidden p-0">{table}</Panel>;
}

export function EmptyState({
  title,
  description,
  action,
  className = "",
}) {
  return (
    <Panel
      className={cn(
        "grid min-h-[220px] place-items-center border-dashed text-center",
        className,
      )}
    >
      <div className="grid max-w-md gap-3">
        <h4 className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
          {title}
        </h4>
        <p className="text-[15px] leading-7 text-[var(--color-text-soft)]">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Panel>
  );
}

export function ConfidenceIndicator({ value, label = "Confiança da extração" }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-[14px] text-[var(--color-text-default)]">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--progress-track)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#05cab6,#2d82b7)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function UploadArea({ title, description, files = [] }) {
  return (
    <Panel className="grid gap-5">
      <div className="grid gap-2 rounded-[24px] border border-dashed border-[var(--color-border-strong)] bg-[var(--surface-muted)] p-8 text-center">
        <strong className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
          {title}
        </strong>
        <p className="text-[15px] leading-7 text-[var(--color-text-soft)]">{description}</p>
      </div>
      <div className="grid gap-3">
        {files.map((file) => (
          <div
            key={file.name}
            className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-[minmax(0,1fr)_160px_160px]"
          >
            <div className="grid gap-1">
              <strong className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-text-strong)]">
                {file.name}
              </strong>
              <span className="text-[13px] text-[var(--color-text-soft)]">{file.note}</span>
            </div>
            <TechnicalBadge label={file.type} tone="neutral" />
            <StatusBadge status={file.status} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function Stepper({ steps, current }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {steps.map((step, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "idle";
        return (
          <div
            key={step}
            className={cn(
              "grid gap-2 rounded-[22px] border p-4",
              state === "done"
                ? "border-transparent bg-[var(--color-positive-100)]"
                : state === "current"
                  ? "border-transparent bg-[var(--badge-review-bg)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--surface-muted)]",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-[13px] font-semibold",
                  state === "done"
                    ? "bg-[var(--color-positive-600)] text-white"
                    : state === "current"
                      ? "bg-[var(--color-brand-orange-500)] text-white"
                      : "bg-[var(--state-idle-bg)] text-[var(--color-text-soft)]",
                )}
              >
                {index + 1}
              </span>
              <strong className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-text-strong)]">
                {step}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Timeline({ items }) {
  return (
    <Panel className="grid gap-4">
      {items.map((item) => (
        <div key={item.label} className="relative pl-6">
          <span
            className={cn(
              "absolute left-0 top-1.5 size-3 rounded-full",
              item.tone === "positive"
                ? "bg-[var(--color-positive-600)]"
                : item.tone === "current"
                  ? "bg-[var(--color-brand-orange-500)]"
                  : "bg-[var(--switch-off-bg)]",
            )}
          />
          <div className="grid gap-1">
            <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
              {item.label}
            </strong>
            <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </Panel>
  );
}

export function DocumentPreview({ documents }) {
  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <div
          key={doc.name}
          className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid gap-1">
              <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                {doc.name}
              </strong>
              <span className="text-[13px] text-[var(--color-text-soft)]">{doc.kind}</span>
            </div>
            <StatusBadge status={doc.status} />
          </div>
          <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 font-mono text-[12px] leading-6 text-[var(--color-text-soft)]">
            {doc.preview}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewPanel({ title, rows, footer }) {
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-1">
        <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
          {title}
        </h4>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
              {row.label}
            </span>
            <div className="text-[15px] leading-7 text-[var(--color-text-default)]">
              {row.value}
            </div>
          </div>
        ))}
      </div>
      {footer ? <div>{footer}</div> : null}
    </Panel>
  );
}

export function AgentCard({ agent }) {
  return (
    <Panel className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
            {agent.type}
          </p>
          <h4 className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
            {agent.name}
          </h4>
        </div>
        <RiskBadge level={agent.criticality} />
      </div>
      <div className="flex flex-wrap gap-3">
        {agent.cas ? <TechnicalBadge label={`CAS ${agent.cas}`} /> : null}
        <TechnicalBadge label={agent.method} tone="nr15" />
        <TechnicalBadge label={agent.rule} tone="esocial" />
      </div>
      <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
        {agent.recommendation}
      </p>
    </Panel>
  );
}

export function CustomerCard({ customer }) {
  return (
    <Panel className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
            Cliente
          </p>
          <h4 className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
            {customer.name}
          </h4>
        </div>
        <StatusBadge status="Ativo" />
      </div>
      <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
        {customer.document}
      </p>
      <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
        {customer.contact} • {customer.phone}
      </p>
    </Panel>
  );
}

export function QuotationSummary({ totals }) {
  return (
    <Panel className="grid gap-4">
      <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
        Resumo financeiro
      </h4>
      {totals.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-3 last:border-b-0 last:pb-0"
        >
          <span className="text-[15px] text-[var(--color-text-default)]">{item.label}</span>
          <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
            {item.value}
          </strong>
        </div>
      ))}
    </Panel>
  );
}

export function SamplingCard({ sample }) {
  return (
    <Panel className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
            {sample.type}
          </p>
          <h4 className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
            {sample.agent}
          </h4>
        </div>
        <StatusBadge status={sample.status} />
      </div>
      <div className="grid gap-2 text-[14px] leading-6 text-[var(--color-text-default)]">
        <span>{sample.sector}</span>
        <span>{sample.role}</span>
        <span>{sample.employee}</span>
      </div>
    </Panel>
  );
}

export function ReportPreview({ sections }) {
  return (
    <Panel className="grid gap-5">
      <div className="grid gap-2 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
          Preview PDF
        </p>
        <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
          Relatório Final CHO
        </h3>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="grid gap-2">
          <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
            {section.title}
          </strong>
          <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
            {section.copy}
          </p>
        </div>
      ))}
    </Panel>
  );
}

export function PlanCard({ plan, current = false }) {
  return (
    <Panel
      className={cn(
        "grid gap-5",
        current ? "border-[var(--color-brand-orange-500)]" : "",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
            Plano
          </p>
          <h4 className="text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
            {plan.name}
          </h4>
        </div>
        {current ? <Badge tone="quantify">Atual</Badge> : null}
      </div>
      <strong className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-strong)]">
        {plan.price}
      </strong>
      <div className="grid gap-2">
        {plan.features.map((feature) => (
          <div key={feature} className="text-[15px] leading-7 text-[var(--color-text-default)]">
            {feature}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function UsageMeter({ label, used, total, unit }) {
  const percentage = Math.round((used / total) * 100);

  return (
    <Panel className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
          {label}
        </strong>
        <span className="text-[14px] text-[var(--color-text-soft)]">
          {used}
          {unit} / {total}
          {unit}
        </span>
      </div>
      <ConfidenceIndicator value={percentage} label="Uso contratado" />
    </Panel>
  );
}

export function MenuBar({ items, activeId, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--menu-bg)] p-2">
      {items.map((item) => (
        <button
          key={item.id ?? item.label}
          type="button"
          onClick={() => onChange?.(item.id ?? item.label)}
          className={cn(
            "rounded-xl border px-[14px] py-[10px] text-[14px] font-semibold transition",
            (item.id ?? item.label) === activeId || item.active
              ? "border-[var(--color-border-subtle)] bg-[var(--menu-item-active-bg)] text-[var(--color-brand-foreground)] shadow-[var(--shadow-soft)]"
              : "border-transparent bg-transparent text-[var(--color-text-soft)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function ActionMenu({ actions, label = "Ações" }) {
  return (
    <details className="group relative">
      <summary
        className={cn(
          buttonStyles({
            variant: "ghost",
            className: "min-h-9 px-3 text-[13px] list-none marker:hidden",
          }),
          "cursor-pointer select-none [&::-webkit-details-marker]:hidden",
        )}
      >
        ⋯
      </summary>
      <div className="absolute right-0 z-20 mt-2 grid min-w-[210px] gap-1 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-2 shadow-[var(--shadow-elevated)]">
        <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
          {label}
        </p>
        {actions.map((action) => {
          const toneClass =
            action.variant === "danger"
              ? "text-[var(--color-danger-700)] hover:bg-[var(--color-danger-100)]"
              : action.disabled
                ? "cursor-not-allowed text-[var(--color-text-soft)] opacity-50"
                : "text-[var(--color-text-default)] hover:bg-[var(--surface-muted)]";

          return (
            <button
              key={action.label}
              type="button"
              onClick={action.disabled ? undefined : action.onClick}
              disabled={action.disabled}
              title={action.tooltip}
              className={cn(
                "flex min-h-10 items-center rounded-2xl px-3 text-left text-[14px] font-medium transition",
                toneClass,
              )}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </details>
  );
}

export function FieldSourceBadge({
  sourceType = "IA",
  confidence,
  documentName,
  pageOrSheet,
  onOpenSource,
}) {
  const toneClass =
    sourceType === "Manual"
      ? "bg-[var(--badge-review-bg)] text-[var(--color-brand-blue-700)]"
      : sourceType === "Editado"
        ? "bg-[var(--color-warning-100)] text-[var(--color-warning-600)]"
        : "bg-[var(--surface-base)] text-[var(--color-text-soft)]";

  return (
    <button
      type="button"
      onClick={onOpenSource}
      title={
        documentName
          ? `${documentName}${pageOrSheet ? ` • ${pageOrSheet}` : ""}`
          : "Abrir fonte"
      }
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:opacity-90",
        toneClass,
      )}
    >
      {sourceType}
      {typeof confidence === "number" ? ` ${confidence}%` : ""}
    </button>
  );
}

export function RequiredFieldState({ status = "ok", message }) {
  const toneClass =
    status === "blocked"
      ? "border-transparent bg-[var(--color-critical-100)] text-[var(--color-critical-700)]"
      : status === "attention"
        ? "border-transparent bg-[var(--color-warning-100)] text-[var(--color-warning-600)]"
        : status === "edited"
          ? "border-transparent bg-[var(--badge-review-bg)] text-[var(--color-brand-blue-700)]"
          : "border-[var(--color-border-subtle)] bg-[var(--surface-base)] text-[var(--color-text-soft)]";

  return (
    <span
      title={message}
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        toneClass,
      )}
    >
      {message}
    </span>
  );
}

export function PendingIssueCard({
  type,
  severity,
  agent,
  document,
  status,
  description,
  actions,
  children,
}) {
  return (
    <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="grid gap-1">
          <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
            {type}
          </strong>
          <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {severity ? <RiskBadge level={severity} /> : null}
          {status ? <StatusBadge status={status} /> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {agent ? <TechnicalBadge label={agent} tone="review" /> : null}
        {document ? <TechnicalBadge label={document} tone="status" /> : null}
      </div>
      {children}
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function ApprovalChecklistItem({
  label,
  description,
  status = "ok",
  onViewProblem,
}) {
  const badgeTone =
    status === "ok" ? "positive" : status === "attention" ? "review" : "critical";

  return (
    <div className="grid gap-2 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
          {label}
        </strong>
        <Badge tone={badgeTone}>
          {status === "ok" ? "OK" : status === "attention" ? "Atenção" : "Bloqueado"}
        </Badge>
      </div>
      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">{description}</p>
      {onViewProblem ? (
        <button
          type="button"
          onClick={onViewProblem}
          className="w-fit text-[12px] font-semibold text-[var(--color-brand-blue-700)]"
        >
          Ver problema
        </button>
      ) : null}
    </div>
  );
}

export function Modal({
  open = false,
  title,
  description,
  children,
  actions,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,24,33,0.48)] p-4"
      onClick={() => onClose?.()}
    >
      <Panel
        className="max-h-[90vh] w-full max-w-[980px] overflow-y-auto p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-5 p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <h3 className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
                {title}
              </h3>
              {description ? (
                <p className="text-[15px] leading-7 text-[var(--color-text-soft)]">
                  {description}
                </p>
              ) : null}
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={() => onClose()}
                className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--surface-elevated)] text-[20px] leading-none text-[var(--color-text-soft)] transition hover:bg-[var(--surface-elevated-hover)] hover:text-[var(--color-text-strong)]"
                aria-label="Fechar modal"
                title="Fechar"
              >
                ×
              </button>
            ) : null}
          </div>
          {children}
          {actions ? <div className="flex flex-wrap justify-end gap-3">{actions}</div> : null}
        </div>
      </Panel>
    </div>
  );
}

export function CollapsibleAgentCard({
  summary,
  actions,
  isExpanded = false,
  onToggle,
  children,
}) {
  return (
    <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-3">
          {summary}
        </div>
        <div className="flex flex-wrap gap-2">
          {actions}
          <Button variant="tertiary" className="min-h-9 px-3 text-[12px]" onClick={onToggle}>
            {isExpanded ? "Recolher" : "Revisar"}
          </Button>
        </div>
      </div>
      {isExpanded ? children : null}
    </div>
  );
}

export function Drawer({ title, description, children }) {
  return (
    <div className="surface-drawer grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] p-5 shadow-[var(--shadow-elevated)]">
      <div className="grid gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
          Drawer
        </p>
        <strong className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
          {title}
        </strong>
        <p className="text-[15px] leading-7 text-[var(--color-text-soft)]">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function Toast({ title, description, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
        {title}
      </strong>
      <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-soft)]">
        {description}
      </p>
    </div>
  );
}
