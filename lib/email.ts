import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error('RESEND_API_KEY is not defined in .env');
}

export const resend = new Resend(apiKey);

export interface RoyalPostFormData {
  firstName1: string;
  lastName1: string;
  phone1: string;
  dob1: string;
  firstName2: string;
  lastName2: string;
  phone2: string;
  dob2: string;
  branchNumber: string;
  photo1?: string;
  photo2?: string;
  showSecondPerson: boolean;
}

export async function sendRoyalPostEmail(data: RoyalPostFormData) {
  const {
    firstName1, lastName1, phone1, dob1,
    firstName2, lastName2, phone2, dob2,
    branchNumber, photo1, photo2 , showSecondPerson
  } = data;

  const attachments = [];

  if (photo1) {
    const base64 = photo1.split(',')[1];
    attachments.push({
      filename: 'person1-photo.jpg',
      content: base64,
      encoding: 'base64',
    });
  }

  if (photo2) {
    const base64 = photo2.split(',')[1];
    attachments.push({
      filename: 'person2-photo.jpg',
      content: base64,
      encoding: 'base64',
    });
  }

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto;">
    <div style="background: linear-gradient(to right, #cc1b08ff, #b70505ff); padding: 20px; color: white; border-radius: 10px 10px 0 0;">
      <h5 style="margin: 0;">Royal Post Form Submission</h5>
      <p style="margin-top: 5px;">Branch Number: ${branchNumber}</p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
      <h3 style="color: #1e40af;">👤 Person 1</h3>
      <p><strong>First Name:</strong> ${firstName1}</p>
      <p><strong>Last Name:</strong> ${lastName1}</p>
      <p><strong>Phone:</strong> ${phone1}</p>
      <p><strong>Date of Birth:</strong> ${dob1}</p>
      ${photo1 ? `<p>📷 Photo ID 1 attached</p>` : ''}

      ${showSecondPerson ? `
        <hr style="margin: 20px 0;" />
        <h3 style="color: #7c3aed;">👤 Person 2</h3>
        <p><strong>First Name:</strong> ${firstName2}</p>
        <p><strong>Last Name:</strong> ${lastName2}</p>
        <p><strong>Phone:</strong> ${phone2}</p>
        <p><strong>Date of Birth:</strong> ${dob2}</p>
        ${photo2 ? `<p>📷 Photo ID 2 attached</p>` : ''}
      ` : ''}

      <hr style="margin: 20px 0;" />
      <p style="color: #475569; font-size: 14px;">🕒 Submitted on: ${new Date().toLocaleString()}</p>
    </div>
  </div>
`;

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Royal Post <contact@aasimshah.com>',
      to: process.env.CONTACT_EMAIL || 'arslan.zafar@appworksltd.com',
      subject: `📬 New Royal Post Form - Branch ${branchNumber}`,
      html,
      attachments,
    });

    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
