import nodemailer from 'nodemailer';

/**
 * ApexDrive Nodemailer Transporter Configuration (Feature 1: Email Notifications)
 * 
 * Configured using SMTP environment variables:
 * - SMTP_HOST: e.g., 'smtp.gmail.com' or 'smtp.mailtrap.io'
 * - SMTP_PORT: e.g., 587 or 465
 * - SMTP_USER: SMTP authentication username / email
 * - SMTP_PASS: SMTP authentication password or App password
 * - SMTP_SECURE: true for port 465, false for port 587/25
 * - SMTP_FROM: Default sender address (e.g. '"ApexDrive Bharat" <no-reply@apexdrive.in>')
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const getSenderAddress = () => {
  return process.env.SMTP_FROM || process.env.EMAIL_FROM || '"ApexDrive Bharat Rentals" <no-reply@apexdrive.in>';
};

/**
 * Responsive HTML Template: Booking Confirmed
 */
export const getBookingConfirmationEmailHTML = (booking) => {
  const carName = `${booking.carMake || ''} ${booking.carModel || 'Vehicle'}`.trim();
  const bookingId = booking.id || 'BK-' + Date.now();
  const pickup = booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString('en-IN', { dateStyle: 'full' }) : 'As selected';
  const dropoff = booking.returnDate ? new Date(booking.returnDate).toLocaleDateString('en-IN', { dateStyle: 'full' }) : 'As selected';
  const total = booking.totalAmount ? Number(booking.totalAmount).toLocaleString('en-IN') : '0';
  const pickupLocation = booking.pickupLocation || 'Mumbai Central Hub';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - ApexDrive Bharat</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); color: #ffffff; padding: 36px 32px; text-align: center; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
    .title { margin: 0; font-size: 26px; font-weight: 900; }
    .content { padding: 32px; }
    .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px 24px; margin-bottom: 24px; }
    .highlight-title { font-size: 13px; font-weight: 700; color: #166534; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .highlight-val { font-size: 20px; font-weight: 900; color: #14532d; margin: 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-label { color: #64748b; font-weight: 600; width: 40%; }
    .info-value { color: #0f172a; font-weight: 700; text-align: right; }
    .feature-tag { display: inline-block; background: #eef2ff; color: #4338ca; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; margin-right: 6px; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">ApexDrive Bharat 🇮🇳</span>
      <h1 class="title">Booking Confirmed! 🎉</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your self-drive journey is officially scheduled.</p>
    </div>

    <div class="content">
      <p style="font-size: 16px; margin: 0 0 20px 0;">Namaste <strong>${booking.customerName || 'Valued Customer'}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Thank you for reserving your vehicle with ApexDrive Bharat. Your booking has been verified and confirmed.
      </p>

      <div class="highlight-box">
        <p class="highlight-title">Reservation Reference ID</p>
        <p class="highlight-val">${bookingId}</p>
      </div>

      <table class="info-table">
        <tr>
          <td class="info-label">Vehicle Selected</td>
          <td class="info-value">${carName}</td>
        </tr>
        <tr>
          <td class="info-label">Pickup Date</td>
          <td class="info-value">${pickup}</td>
        </tr>
        <tr>
          <td class="info-label">Return Date</td>
          <td class="info-value">${dropoff}</td>
        </tr>
        <tr>
          <td class="info-label">Duration</td>
          <td class="info-value">${booking.days || 1} Day(s)</td>
        </tr>
        <tr>
          <td class="info-label">Pickup Hub</td>
          <td class="info-value">${pickupLocation}</td>
        </tr>
        <tr>
          <td class="info-label">Total Amount Paid</td>
          <td class="info-value" style="color: #4f46e5; font-size: 16px;">₹${total} (GST Incl.)</td>
        </tr>
      </table>

      <div style="margin-bottom: 24px;">
        <span class="feature-tag">✓ FASTag Pre-Activated</span>
        <span class="feature-tag">✓ 24x7 Roadside Assistance</span>
        <span class="feature-tag">✓ Zero Security Deposit Hold</span>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
        Please carry your original Driving License and valid Government ID (Aadhaar/Passport) at the time of vehicle pickup.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">ApexDrive Bharat Fleet Operations • Mumbai, India</p>
      <p style="margin: 0;">Need help? Chat with ApexDrive Sahayak or contact support@apexdrive.in</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Responsive HTML Template: Booking Canceled
 */
export const getBookingCancellationEmailHTML = (booking) => {
  const carName = `${booking.carMake || ''} ${booking.carModel || 'Vehicle'}`.trim();
  const bookingId = booking.id || 'BK-' + Date.now();
  const total = booking.totalAmount ? Number(booking.totalAmount).toLocaleString('en-IN') : '0';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Canceled - ApexDrive Bharat</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #e11d48 0%, #881337 100%); color: #ffffff; padding: 36px 32px; text-align: center; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
    .title { margin: 0; font-size: 26px; font-weight: 900; }
    .content { padding: 32px; }
    .alert-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px 24px; margin-bottom: 24px; }
    .alert-title { font-size: 13px; font-weight: 700; color: #9f1239; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .alert-val { font-size: 20px; font-weight: 900; color: #881337; margin: 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-label { color: #64748b; font-weight: 600; width: 40%; }
    .info-value { color: #0f172a; font-weight: 700; text-align: right; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">ApexDrive Bharat 🇮🇳</span>
      <h1 class="title">Booking Canceled</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your reservation has been successfully canceled.</p>
    </div>

    <div class="content">
      <p style="font-size: 16px; margin: 0 0 20px 0;">Namaste <strong>${booking.customerName || 'Valued Customer'}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        This email confirms that your self-drive reservation has been canceled as requested.
      </p>

      <div class="alert-box">
        <p class="alert-title">Canceled Reference ID</p>
        <p class="alert-val">${bookingId}</p>
      </div>

      <table class="info-table">
        <tr>
          <td class="info-label">Vehicle</td>
          <td class="info-value">${carName}</td>
        </tr>
        <tr>
          <td class="info-label">Refund Amount</td>
          <td class="info-value" style="color: #e11d48; font-size: 16px;">₹${total}</td>
        </tr>
        <tr>
          <td class="info-label">Refund Status</td>
          <td class="info-value" style="color: #16a34a;">Initiated to Original Payment Source</td>
        </tr>
        <tr>
          <td class="info-label">Estimated Timeline</td>
          <td class="info-value">2 - 3 Banking Business Days</td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
        If you did not initiate this cancellation or require further assistance, please contact our support desk immediately.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">ApexDrive Bharat Fleet Operations • Mumbai, India</p>
      <p style="margin: 0;">24x7 Support: support@apexdrive.in | +91 98200 00000</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Controller Helper: Send Booking Confirmed Email
 */
export const sendBookingConfirmationEmail = async (booking) => {
  if (!booking || !booking.customerEmail) {
    console.warn('⚠️ [Nodemailer]: Cannot send confirmation email: Missing recipient email address.');
    return { success: false, reason: 'Missing recipient email' };
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: getSenderAddress(),
    to: booking.customerEmail,
    subject: `🚗 Booking Confirmed! Reservation #${booking.id} - ApexDrive Bharat`,
    html: getBookingConfirmationEmailHTML(booking)
  };

  if (!transporter) {
    console.log(`✉️  [Nodemailer Simulation]: "Booking Confirmed" email queued for ${booking.customerEmail} (Reservation #${booking.id})`);
    console.log(`   💡 Tip: Configure SMTP_HOST, SMTP_USER, SMTP_PASS in server/.env to enable live email delivery.`);
    return { success: true, simulated: true, recipient: booking.customerEmail };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer]: Booking confirmation email sent to ${booking.customerEmail} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Nodemailer Error]: Failed to send confirmation email to ${booking.customerEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Controller Helper: Send Booking Canceled Email
 */
export const sendBookingCancellationEmail = async (booking) => {
  if (!booking || !booking.customerEmail) {
    console.warn('⚠️ [Nodemailer]: Cannot send cancellation email: Missing recipient email address.');
    return { success: false, reason: 'Missing recipient email' };
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: getSenderAddress(),
    to: booking.customerEmail,
    subject: `❌ Booking Canceled: Reservation #${booking.id} - ApexDrive Bharat`,
    html: getBookingCancellationEmailHTML(booking)
  };

  if (!transporter) {
    console.log(`✉️  [Nodemailer Simulation]: "Booking Canceled" email queued for ${booking.customerEmail} (Reservation #${booking.id})`);
    console.log(`   💡 Tip: Configure SMTP_HOST, SMTP_USER, SMTP_PASS in server/.env to enable live email delivery.`);
    return { success: true, simulated: true, recipient: booking.customerEmail };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer]: Booking cancellation email sent to ${booking.customerEmail} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Nodemailer Error]: Failed to send cancellation email to ${booking.customerEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  getBookingConfirmationEmailHTML,
  getBookingCancellationEmailHTML
};
