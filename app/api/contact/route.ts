import { NextRequest, NextResponse } from 'next/server';

import { createContactMessage, markContactMessagesNotified } from '@/lib/content';
import { sendContactNotificationEmail } from '@/lib/contact-email';
import { isContactDailyLimitReached } from '@/lib/contact-daily-limit';
import { validateContactSpam } from '@/lib/contact-spam-guard';
import { isValidEmailFormat, normalizeEmail } from '@/lib/admin-validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';

const FAKE_SUCCESS_RESPONSE = {
  success: true,
  message: 'Mensaje enviado correctamente',
};

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = await checkRateLimit(clientIP);

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

    const body = await request.json();
    const { name, email, phone, message, website, formLoadedAt } = body;

    const spamResult = validateContactSpam({ website, formLoadedAt });
    if (spamResult.isBot) {
      console.log('Contact spam rejected', { reason: spamResult.reason, ip: clientIP });
      return NextResponse.json(FAKE_SUCCESS_RESPONSE, { status: 200 });
    }

    const dailyLimit = await isContactDailyLimitReached();
    if (dailyLimit.reached) {
      console.log('Contact daily limit reached', {
        count: dailyLimit.count,
        limit: dailyLimit.limit,
        ip: clientIP,
      });
      return NextResponse.json(
        { error: 'No podemos recibir más mensajes hoy. Por favor intenta mañana.' },
        { status: 503 }
      );
    }

    console.log('Datos recibidos:', {
      name,
      email,
      phone: phone ? 'presente' : 'no',
      message: message?.substring(0, 50),
    });

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
