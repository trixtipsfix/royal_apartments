const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'royal.apartments.faisal.town@gmail.com',
    pass: 'xxtx lqeh vvdk bccj' // App Password
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Booking API endpoint
app.post('/api/booking', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    roomType,
    specialRequests
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut || !guests || !roomType) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all required fields' 
    });
  }

  const guestFullName = `${firstName} ${lastName}`;
  const formattedCheckIn = new Date(checkIn).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const formattedCheckOut = new Date(checkOut).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Email to Company (Royal Apartments)
  const companyEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center; }
        .header h1 { color: #D4AF37; margin: 0; font-size: 28px; }
        .header p { color: #ffffff; margin: 10px 0 0; }
        .content { padding: 30px; }
        .booking-details { background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin: 20px 0; }
        .booking-details h2 { color: #1a1a2e; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
        .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: 600; color: #495057; width: 150px; }
        .detail-value { color: #212529; }
        .highlight { background-color: #D4AF37; color: #1a1a2e; padding: 3px 10px; border-radius: 5px; font-weight: 600; }
        .special-requests { background-color: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin-top: 20px; border-radius: 0 5px 5px 0; }
        .footer { background-color: #1a1a2e; color: #ffffff; padding: 20px; text-align: center; font-size: 14px; }
        .action-needed { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
        .action-needed h3 { color: #155724; margin: 0 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏨 New Booking Request</h1>
          <p>Royal Apartments - Faisal Town, Islamabad</p>
        </div>
        <div class="content">
          <div class="action-needed">
            <h3>⚡ Action Required</h3>
            <p style="margin: 0;">A new booking request has been submitted. Please review and confirm with the guest.</p>
          </div>
          
          <div class="booking-details">
            <h2>👤 Guest Information</h2>
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value"><strong>${guestFullName}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value"><a href="tel:${phone}">${phone}</a></span>
            </div>
          </div>
          
          <div class="booking-details">
            <h2>📅 Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span class="detail-value"><span class="highlight">${formattedCheckIn}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span class="detail-value"><span class="highlight">${formattedCheckOut}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests:</span>
              <span class="detail-value">${guests}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room Type:</span>
              <span class="detail-value"><strong>${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Apartment</strong></span>
            </div>
          </div>
          
          ${specialRequests ? `
          <div class="special-requests">
            <strong>📝 Special Requests:</strong>
            <p style="margin: 10px 0 0;">${specialRequests}</p>
          </div>
          ` : ''}
          
          <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
            <strong>Next Steps:</strong> Please contact the guest within 24 hours to confirm the booking and discuss any requirements.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">Royal Apartments - Ginza Tower, C-Block, Faisal Town, Islamabad</p>
          <p style="margin: 5px 0 0;">📞 +92-321-5009470 | 📧 royal.apartments.faisal.town@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Confirmation Email to Customer
  const customerEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold; color: #1a1a2e; margin-bottom: 15px; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .header p { color: #D4AF37; margin: 10px 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #212529; margin-bottom: 20px; }
        .confirmation-box { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0; }
        .confirmation-box h2 { color: #155724; margin: 0; font-size: 22px; }
        .confirmation-box p { color: #155724; margin: 10px 0 0; }
        .booking-summary { background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin: 25px 0; }
        .booking-summary h3 { color: #1a1a2e; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
        .summary-row { padding: 12px 0; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; }
        .summary-row:last-child { border-bottom: none; }
        .summary-label { color: #6c757d; }
        .summary-value { color: #212529; font-weight: 600; }
        .highlight-date { background-color: #D4AF37; color: #1a1a2e; padding: 5px 12px; border-radius: 5px; font-weight: 600; }
        .info-section { background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; border-radius: 0 10px 10px 0; margin: 25px 0; }
        .info-section h4 { color: #0066cc; margin: 0 0 10px; }
        .amenities { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .amenity { background-color: #f8f9fa; padding: 8px 15px; border-radius: 20px; font-size: 14px; color: #495057; }
        .contact-box { background-color: #1a1a2e; color: #ffffff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
        .contact-box h4 { color: #D4AF37; margin: 0 0 15px; }
        .contact-box a { color: #D4AF37; text-decoration: none; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; }
        .social-links { margin: 15px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #1a1a2e; text-decoration: none; }
        .footer-text { color: #6c757d; font-size: 13px; margin: 15px 0 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">R</div>
          <h1>Royal Apartments</h1>
          <p>Luxury Living in Islamabad</p>
        </div>
        
        <div class="content">
          <p class="greeting">Dear <strong>${guestFullName}</strong>,</p>
          
          <div class="confirmation-box">
            <h2>✓ Booking Request Received!</h2>
            <p>Thank you for choosing Royal Apartments. We have received your booking request.</p>
          </div>
          
          <p>We are delighted that you have chosen Royal Apartments for your stay in Islamabad. Our team will review your booking request and contact you within <strong>24 hours</strong> to confirm your reservation.</p>
          
          <div class="booking-summary">
            <h3>📋 Your Booking Summary</h3>
            <div class="summary-row">
              <span class="summary-label">Guest Name</span>
              <span class="summary-value">${guestFullName}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Check-in Date</span>
              <span class="highlight-date">${formattedCheckIn}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Check-out Date</span>
              <span class="highlight-date">${formattedCheckOut}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Number of Guests</span>
              <span class="summary-value">${guests}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Room Type</span>
              <span class="summary-value">${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Apartment</span>
            </div>
            ${specialRequests ? `
            <div class="summary-row">
              <span class="summary-label">Special Requests</span>
              <span class="summary-value">${specialRequests}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="info-section">
            <h4>ℹ️ What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #495057;">
              <li>Our team will review your booking request</li>
              <li>You will receive a confirmation call/email within 24 hours</li>
              <li>Once confirmed, we'll send you the final booking details</li>
              <li>Feel free to contact us if you have any questions</li>
            </ul>
          </div>
          
          <h4 style="color: #1a1a2e; margin: 25px 0 15px;">🌟 Amenities You'll Enjoy</h4>
          <div class="amenities">
            <span class="amenity">🌐 Free WiFi</span>
            <span class="amenity">🚗 Free Parking</span>
            <span class="amenity">❄️ Air Conditioning</span>
            <span class="amenity">🛁 Spa Bath</span>
            <span class="amenity">📺 Smart TV</span>
            <span class="amenity">🏠 Full Kitchen</span>
            <span class="amenity">🔒 24/7 Security</span>
            <span class="amenity">🌳 Garden & Terrace</span>
          </div>
          
          <div class="contact-box">
            <h4>Need Assistance?</h4>
            <p style="margin: 0 0 15px;">We're here to help you with any questions!</p>
            <p style="margin: 5px 0;">📞 <a href="tel:+923215009470">+92-321-5009470</a></p>
            <p style="margin: 5px 0;">📧 <a href="mailto:royal.apartments.faisal.town@gmail.com">royal.apartments.faisal.town@gmail.com</a></p>
            <p style="margin: 15px 0 0; font-size: 14px; color: #adb5bd;">
              📍 Ginza Tower, C-Block, Main Commercial Area,<br>Phase-I Faisal Town, Islamabad, 44000, Pakistan
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0; color: #495057;"><strong>Royal Apartments</strong></p>
          <p style="margin: 5px 0; color: #6c757d;">Luxury One Bed Apartments in Faisal Town, Islamabad</p>
          <div class="social-links">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="https://wa.me/923215009470">WhatsApp</a>
          </div>
          <p class="footer-text">
            This is an automated confirmation email. Please do not reply directly to this email.<br>
            © ${new Date().getFullYear()} Royal Apartments. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send email to company
    await transporter.sendMail({
      from: '"Royal Apartments Website" <royal.apartments.faisal.town@gmail.com>',
      to: 'royal.apartments.faisal.town@gmail.com',
      subject: `🏨 New Booking Request - ${guestFullName} (${formattedCheckIn})`,
      html: companyEmailHTML
    });

    console.log('Company notification email sent successfully');

    // Send confirmation email to customer
    await transporter.sendMail({
      from: '"Royal Apartments" <royal.apartments.faisal.town@gmail.com>',
      to: email,
      subject: `Booking Request Received - Royal Apartments, Islamabad`,
      html: customerEmailHTML
    });

    console.log('Customer confirmation email sent successfully');

    res.status(200).json({
      success: true,
      message: 'Booking request submitted successfully! Please check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit booking. Please try again or contact us directly at +92-321-5009470'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Royal Apartments API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🏨 Royal Apartments Email Server                     ║
  ║   Server running on http://localhost:${PORT}             ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});
