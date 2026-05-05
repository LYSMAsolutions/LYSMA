"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  label = "Recherche",
  className = "",
}: SearchBarProps) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input
        className="input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}