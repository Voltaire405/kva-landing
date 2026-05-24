import { NextRequest, NextResponse } from 'next/server';

import {
  listUnnotifiedContactMessages,
  markContactMessagesNotified,
  updateLastNotificationAt,
} from '@/lib/content';
import { getAdminEmail, sendBatchContactNotificationEmail } from '@/lib/contact-email';

export const dynamic = 'force-dynamic';

function verifyCronSecret(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

function isImmediateEmailEnabled(): boolean {
  return process.env.SEND_CONTACT_EMAIL === 'true';
}

function isContactEmailCronEnabled(): boolean {
  return process.env.CONTACT_EMAIL_CRON_ENABLED === 'true';
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (isImmediateEmailEnabled()) {
      return NextResponse.json({ skipped: true, reason: 'immediate_email_enabled' });
    }

    if (!isContactEmailCronEnabled()) {
      return NextResponse.json({ skipped: true, reason: 'cron_disabled' });
    }

    const recipient = await getAdminEmail();
    if (!recipient) {
      return NextResponse.json({ skipped: true, reason: 'invalid_recipient_email' });
    }

    const pendingMessages = await listUnnotifiedContactMessages();
    if (pendingMessages.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'no_messages' });
    }

    const { error } = await sendBatchContactNotificationEmail(pendingMessages);

    if (error) {
      console.error('Error de Resend en cron de notificaciones:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 });
    }

    const now = new Date().toISOString();
    await markContactMessagesNotified(pendingMessages.map((message) => message.id));
    await updateLastNotificationAt(now);

    return NextResponse.json({
      sent: true,
      count: pendingMessages.length,
      notifiedAt: now,
    });
  } catch (error) {
    console.error('Error en cron de notificaciones:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
