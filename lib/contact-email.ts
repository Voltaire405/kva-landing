import { Resend } from 'resend';

import type { ContactMessage } from '@/db/schema';
import { isValidEmailFormat, normalizeEmail } from '@/lib/admin-validation';
import { getContactInfo } from '@/lib/content';
import { BOGOTA_TIMEZONE } from '@/lib/notification-schedule';

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const DEFAULT_FROM_EMAIL = 'Formulario KvaTel <onboarding@resend.dev>';

function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function getAdminEmail(): Promise<string | null> {
  const contact = await getContactInfo();
  const email = normalizeEmail(contact.email);
  return isValidEmailFormat(email) ? email : null;
}

export function getAdminMessagesUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/admin/messages`;
  }

  return 'http://localhost:3000/admin/messages';
}

function getEmailStyles(): string {
  return `
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #0a2463;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f4f4f4;
      padding: 30px;
      border-radius: 0 0 5px 5px;
    }
    .field {
      margin-bottom: 20px;
      background-color: white;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #0a2463;
    }
    .label {
      font-weight: bold;
      color: #0a2463;
      margin-bottom: 5px;
    }
    .value {
      color: #333;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
    .summary {
      background-color: white;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 16px;
    }
    .message-block {
      margin-bottom: 24px;
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    .message-block h3 {
      margin: 0 0 12px;
      color: #0a2463;
      font-size: 16px;
    }
    .cta {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #0a2463;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
  `;
}

function formatMessageDate(date: string): string {
  return new Date(date).toLocaleString('es-CO', { timeZone: BOGOTA_TIMEZONE });
}

function buildSingleContactEmailHtml({ name, email, phone, message }: ContactEmailPayload): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : '';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${getEmailStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${safeName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${safeEmail}</div>
            </div>
            ${
              phone
                ? `
            <div class="field">
              <div class="label">Teléfono:</div>
              <div class="value">${safePhone}</div>
            </div>
            `
                : ''
            }
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${safeMessage}</div>
            </div>
            <div class="footer">
              <p>Este mensaje fue enviado desde el formulario de contacto de KvaTel</p>
              <p>Fecha: ${formatMessageDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildMessageBlock(message: ContactMessage, index: number): string {
  const safeName = escapeHtml(message.name);
  const safeEmail = escapeHtml(message.email);
  const safePhone = message.phone ? escapeHtml(message.phone) : 'No proporcionado';
  const safeBody = escapeHtml(message.message).replace(/\n/g, '<br>');
  const safeDate = escapeHtml(formatMessageDate(message.createdAt));

  return `
    <div class="message-block">
      <h3>Mensaje ${index + 1}</h3>
      <div class="field">
        <div class="label">Nombre:</div>
        <div class="value">${safeName}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${safeEmail}</div>
      </div>
      <div class="field">
        <div class="label">Teléfono:</div>
        <div class="value">${safePhone}</div>
      </div>
      <div class="field">
        <div class="label">Fecha:</div>
        <div class="value">${safeDate}</div>
      </div>
      <div class="field">
        <div class="label">Mensaje:</div>
        <div class="value">${safeBody}</div>
      </div>
    </div>
  `;
}

function buildBatchContactEmailHtml(messages: ContactMessage[]): string {
  const count = messages.length;
  const messageBlocks = messages.map((message, index) => buildMessageBlock(message, index)).join('');
  const adminUrl = escapeHtml(getAdminMessagesUrl());

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${getEmailStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Resumen de Mensajes de Contacto</h1>
          </div>
          <div class="content">
            <div class="summary">
              Se han recibido <strong>${count}</strong> mensaje${count === 1 ? '' : 's'} nuevo${count === 1 ? '' : 's'}.
            </div>
            ${messageBlocks}
            <div style="text-align: center;">
              <a href="${adminUrl}" class="cta">Ver mensajes en el panel</a>
            </div>
            <div class="footer">
              <p>Resumen generado desde el formulario de contacto de KvaTel</p>
              <p>Fecha: ${formatMessageDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendContactNotificationEmail(payload: ContactEmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurado — email no enviado');
    return { data: null, error: { message: 'RESEND_API_KEY no configurado' } };
  }

  const recipient = await getAdminEmail();
  if (!recipient) {
    console.warn('Email de destino inválido o no configurado — email no enviado');
    return { data: null, error: { message: 'Email de destino inválido o no configurado' } };
  }

  return getResend().emails.send({
    from: getResendFromEmail(),
    to: [recipient],
    subject: `Nuevo mensaje de contacto de ${payload.name}`,
    html: buildSingleContactEmailHtml(payload),
  });
}

export async function sendBatchContactNotificationEmail(messages: ContactMessage[]) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurado — email no enviado');
    return { data: null, error: { message: 'RESEND_API_KEY no configurado' } };
  }

  const recipient = await getAdminEmail();
  if (!recipient) {
    console.warn('Email de destino inválido o no configurado — email no enviado');
    return { data: null, error: { message: 'Email de destino inválido o no configurado' } };
  }

  const count = messages.length;

  return getResend().emails.send({
    from: getResendFromEmail(),
    to: [recipient],
    subject: `${count} mensaje${count === 1 ? '' : 's'} nuevo${count === 1 ? '' : 's'} de contacto — KvaTel`,
    html: buildBatchContactEmailHtml(messages),
  });
}
