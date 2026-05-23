'use client';

const SERVICE_ICONS = [
  'home',
  'business',
  'router',
  'electrical_services',
  'build',
  'engineering',
  'settings',
  'wifi',
  'cable',
  'power',
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div>
      <label className="block mb-2 font-medium text-sm">Icono</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full py-2.5 px-3 border border-[#ddd] rounded-[5px] text-sm bg-white"
      >
        {SERVICE_ICONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center gap-2 text-primary">
        <i className="material-icons">{value}</i>
        <span className="text-xs text-text-secondary">Vista previa</span>
      </div>
    </div>
  );
}
