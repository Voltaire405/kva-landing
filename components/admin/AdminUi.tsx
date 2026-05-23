'use client';

import { useState } from 'react';

interface AdminInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'textarea' | 'password';
  required?: boolean;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M1 1l22 22" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: AdminInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const className =
    'w-full py-2.5 px-3 border border-[#ddd] rounded-[5px] text-sm bg-white focus:outline-none focus:border-primary';

  const passwordInputClassName = isPassword ? `${className} pr-10` : className;

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
      ) : isPassword ? (
        <div className="relative">
          <input
            type={inputType}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required={required}
            className={passwordInputClassName}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-primary transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <EyeIcon hidden={showPassword} />
          </button>
        </div>
      ) : (
        <input
          type={inputType}
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
