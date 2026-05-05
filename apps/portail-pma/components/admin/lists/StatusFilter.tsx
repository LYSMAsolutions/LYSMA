"use client";

type StatusOption = {
  value: string;
  label: string;
};

type StatusFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  label?: string;
  allLabel?: string;
  className?: string;
};

export default function StatusFilter({
  value,
  onChange,
  options,
  label = "Statut",
  allLabel = "Tous",
  className = "",
}: StatusFilterProps) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}