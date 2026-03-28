const { Resend } = require('resend');

/** 
 * @file emailService.js
 * Using RESEND (Verified working previously)
 */

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBookingConfirmation(booking, eventType) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Scheduler <onboarding@resend.dev>',
      to: [booking.email],
      subject: `Booking Confirmed: ${eventType.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h1 style="color: #2563eb; font-size: 24px;">Appointment Confirmed!</h1>
          <p>Hi <b>${booking.name}</b>,</p>
          <p>We've successfully scheduled your <b>${eventType.title}</b>.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 8px 0; color: #111827;">${eventType.title}</h3>
            <p style="margin: 4px 0;">📅 <b>Date:</b> ${new Date(booking.date).toLocaleDateString()}</p>
            <p style="margin: 4px 0;">⏰ <b>Time:</b> ${booking.time} (${booking.timezone})</p>
            ${booking.answers && Object.keys(booking.answers).length > 0 ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px;">Additional Details:</p>
                ${Object.entries(booking.answers).map(([label, ans]) => `
                  <p style="margin: 4px 0; font-size: 14px;"><b>${label}:</b> ${ans}</p>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <p style="font-size: 12px; color: #9ca3af;">Sent via Scheduler App.</p>
        </div>
      `,
    });

    if (error) {
       console.error('❌ Resend Error:', error);
       return;
    }
    console.log('📧 Confirmation Sent via RESEND:', data.id);
  } catch (err) {
    console.error('❌ Resend Failure:', err.message);
  }
}

async function sendCancellationNotice(booking, eventType) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Scheduler <onboarding@resend.dev>',
      to: [booking.email],
      subject: `Appointment Cancelled: ${eventType.title}`,
      html: `<p>Confirmation: Your booking for ${eventType.title} has been cancelled.</p>`
    });

    if (error) {
       console.error('❌ Resend Cancel Error:', error);
       return;
    }
    console.log('📧 Cancellation Sent via RESEND:', data.id);
  } catch (err) {
    console.error('❌ Resend Cancel Failure:', err.message);
  }
}

module.exports = { sendBookingConfirmation, sendCancellationNotice };
