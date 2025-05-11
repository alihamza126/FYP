export const generateEmailHTML = ({ type, token, domain, username = 'User' }) => {
  const actionText = type === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password';
  const actionUrl = type === 'VERIFY' ? `${domain}/verifyemail?token=${token}` : `${domain}/resetpassword?token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${actionText}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .email-header {
          background-color: #2c3e50;
          padding: 20px;
          text-align: center;
          color: #ffffff;
        }
        .email-body {
          padding: 30px;
          color: #333333;
        }
        .email-body h2 {
          margin-top: 0;
        }
        .email-button {
          display: inline-block;
          margin: 20px 0;
          padding: 12px 24px;
          background-color: #27ae60;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .email-footer {
          background-color: #ecf0f1;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
        }
        @media (max-width: 600px) {
          .email-body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Accountdeal.com</h1>
        </div>
        <div class="email-body">
          <h2>${actionText}</h2>
          <p>Hi ${username},</p>
          <p>To ${type === 'VERIFY' ? 'verify your email address' : 'reset your password'}, please click the button below:</p>
          <p style="text-align: center;">
            <a href="${actionUrl}" class="email-button">${actionText}</a>
          </p>
          <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${actionUrl}">${actionUrl}</a></p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="email-footer">
          &copy; ${new Date().getFullYear()} accountdeal. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
