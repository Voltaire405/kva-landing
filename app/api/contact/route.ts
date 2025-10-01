import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';

const resend = new Resend(process.env.RESEND_API_KEY);

// Umbral mínimo de score de reCAPTCHA (0.0 - 1.0)
// 0.5 es un buen balance entre seguridad y usabilidad
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
        error: 'Score de CAPTCHA muy bajo. Por favor intenta nuevamente.'
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
    // 1. Rate Limiting
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
          }
        }
      );
    }

    // 2. Verificar que las variables de entorno estén configuradas
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta. Contacte al administrador.' },
        { status: 500 }
      );
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta. Contacte al administrador.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, recaptchaToken } = body;

    console.log('Datos recibidos:', { name, email, phone: phone ? 'presente' : 'no', message: message?.substring(0, 50) });

    // 3. Validación de reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Token de CAPTCHA no proporcionado' },
        { status: 400 }
      );
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: recaptchaResult.error || 'Verificación de CAPTCHA falló' },
        { status: 400 }
      );
    }

    // 4. Validación básica de campos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje son obligatorios' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    console.log('Intentando enviar email a:', process.env.ADMIN_EMAIL);

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: 'Formulario KvaTel <onboarding@resend.dev>', // Cambiar cuando tengas dominio verificado
      to: [process.env.ADMIN_EMAIL || 'kvatelsoluciones@gmail.com'],
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nuevo Mensaje de Contacto</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Nombre:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${email}</div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">Teléfono:</div>
                  <div class="value">${phone}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Mensaje:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>Este mensaje fue enviado desde el formulario de contacto de KvaTel</p>
                  <p>Fecha: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error de Resend:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Error al enviar el mensaje: ${error.message || 'Por favor intente nuevamente.'}` },
        { status: 500 }
      );
    }

    console.log('Email enviado exitosamente:', data);
    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente', data },
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
