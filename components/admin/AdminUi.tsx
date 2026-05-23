'use client';

interface AdminInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'textarea';
  required?: boolean;
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: AdminInputProps) {
  const className =
    'w-full py-2.5 px-3 border border-[#ddd] rounded-[5px] text-sm bg-white focus:outline-none focus:border-primary';

  return (
    <div>
      <label className="block mb-2 font-medium text-sm">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={className}
        />
      )}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="font-heading text-2xl font-bold text-primary">{title}</h2>
      {description && <p className="mt-2 text-sm text-text-secondary">{description}</p>}
    </div>
  );
}

export function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] p-6 shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-medium text-primary hover:bg-[#ddd]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[5px] px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function AdminMessage({
  type,
  message,
}: {
  type: 'success' | 'error';
  message: string;
}) {
  return (
    <div
      className={`mb-4 rounded-[5px] p-4 text-sm ${
        type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      {message}
    </div>
  );
}
