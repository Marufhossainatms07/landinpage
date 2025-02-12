import nodemailer from 'nodemailer';

// Create a Nodemailer transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use Gmail service
    auth: {
        user: 'marufhossain458218@gmail.com', // **YOUR TEST GMAIL EMAIL ADDRESS**
        pass: 'omef prmb irgd hxbf' 
    }
});

// Send email function
export const sendTestEmail = async (toEmail, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: 'marufhossain458218@gmail.com', // **YOUR TEST GMAIL EMAIL ADDRESS (same as transporter)**
            to: toEmail,      // Recipient email address (passed as argument)
            subject: subject, // Email subject (passed as argument)
            html: htmlContent // Email content in HTML
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully! Email info:', info.messageId, info.response);
        return true; // Indicate success

    } catch (error) {
        console.error('Error sending test email:', error);
        return false; // Indicate failure
    }
};


export const testSendEmail = async (req, res) => {
    const recipientEmail = 'marufhossain458218@gmail.com'; // **REPLACE WITH A VALID TEST EMAIL ADDRESS where you can receive emails**
    const emailSubject = 'Test Email from Your Ecommerce Backend';
    const emailText = 'This is a test email sent from your Node.js backend using Nodemailer with Gmail. If you received this, email sending is configured correctly!';

    const emailSent = await sendTestEmail(recipientEmail, emailSubject, emailText);

    if (emailSent) {
        res.status(200).send('Test email sent successfully! Check console logs for details.');
    } else {
        res.status(500).send('Error sending test email. Check console logs for errors.');
    }
};
