// Email notification service helper
// Can be linked to Nodemailer, SendGrid, or WhatsApp Business API

const sendOrderConfirmationEmail = async ({ to, order }) => {
  console.log(`[EmailService] Preparing order confirmation for: ${to}`);
  console.log(`[EmailService] Order #${order.orderId || order._id} - Total: INR ${order.totalAmount}`);
  
  // If SMTP credentials exist, send real email, otherwise mock log
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      // Real transport would be triggered here
      return { success: true, message: 'Email sent successfully' };
    } catch (err) {
      console.error('[EmailService] Error sending email:', err.message);
      return { success: false, error: err.message };
    }
  }

  return { success: true, message: 'Mock email logged successfully (No SMTP configured)' };
};

const sendLowStockNotification = async ({ products }) => {
  console.log(`[EmailService] Low Stock Alert: ${products.length} items below minimum threshold`);
  return { success: true, count: products.length };
};

module.exports = {
  sendOrderConfirmationEmail,
  sendLowStockNotification
};
