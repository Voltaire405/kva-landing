import { NextRequest, NextResponse } from 'next/server';

import { createContactMessage, markContactMessagesNotified } from '@/lib/content';
import { sendContactNotificationEmail } from '@/lib/contact-email';
import { isValidEmailFormat, normalizeEmail } from '@/lib/admin-validation';
import { isContactTestMode } from '@/lib/contact-test-mode';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';

const RECAPTCHA_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { success: false, error: 'Verificación de CAPTCHA falló' };
    }

    console.log('reCAPTCHA score:', data.score);

    if (data.score < RECAPTCHA_THRESHOLD) {
      return {
        success: false,
        score: data.score,
        error: 'Score de CAPTCHA muy bajo. Por favor intenta nuevamente.',
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    return { success: false, error: 'Error en la verificación de CAPTCHA' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      const waitSeconds = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          error: `Demasiados intentos. Por favor espera ${waitSeconds} segundos antes de intentar nuevamente.`,
          resetAt: rateLimitResult.resetAt,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    if (!isContactTestMode() && !process.env.RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta. Contacte al administrador.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, recaptchaToken } = body;

    console.log('Datos recibidos:', {
      name,
      email,
      phone: phone ? 'presente' : 'no',
      message: message?.substring(0, 50),
    });

    if (!isContactTestMode()) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'Token de CAPTCHA no proporcionado' }, { status: 400 });
      }

      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        return NextResponse.json(
          { error: recaptchaResult.error || 'Verificación de CAPTCHA falló' },
          { status: 400 }
        );
      }
    } else {
      console.log('CONTACT_TEST_MODE activo — reCAPTCHA omitido');
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje son obligatorios' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmailFormat(normalizedEmail)) {
      return NextResponse.json({ error: 'El formato del email no es válido' }, { status: 400 });
    }

    const saved = await createContactMessage({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      message: message.trim(),
    });

    if (process.env.SEND_CONTACT_EMAIL === 'true') {
      const { error } = await sendContactNotificationEmail({
        name: saved.name,
        email: saved.email,
        phone: saved.phone ?? undefined,
        message: saved.message,
      });

      if (error) {
        console.error('Error de Resend:', JSON.stringify(error, null, 2));
      } else {
        await markContactMessagesNotified([saved.id]);
      }
    }

    console.log('Mensaje guardado en base de datos:', saved.id);
    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente', id: saved.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en API de contacto:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error interno del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
