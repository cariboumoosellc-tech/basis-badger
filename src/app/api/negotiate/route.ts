// This handles the actual 'Dispatch' of the Badger's demands
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { getLeads } from '@/lib/storage';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  const body = await req.json();
  const { leadId, draftContent, merchantEmail, businessName: bodyBusinessName, annualWaste: bodyAnnualWaste } = body;

  // Find the lead in the database
  const leads = getLeads();
  const lead = leads.find(l => String(l.createdAt) === String(leadId));

  // Fallbacks if not found
  const businessName = lead?.merchantName || bodyBusinessName || 'Business Client';
  const annualWaste = lead?.wasteAmount || bodyAnnualWaste || 0;

  // Insert businessName and annualWaste into the draftContent if needed
  let htmlContent = draftContent
    .replace(/\{\{businessName\}\}/g, businessName)
    .replace(/\{\{annualWaste\}\}/g, `$${annualWaste.toLocaleString()}`);

  try {
    const subject = `Rate Review Request: Merchant Account Forensic Audit - ${businessName}`;
    const body = `
      <p>To the Merchant Services Retention Team,</p>
      <p>We have completed a forensic audit of the merchant processing statements for <strong>${businessName}</strong>. Our analysis has identified an annual fee leakage of approximately <strong>$${annualWaste}</strong> due to <em>[Specific Fee Type, e.g., Non-Qualified surcharges]</em>.</p>
      <p>On behalf of our client, we are requesting a formal rate review to align this account with current industry benchmarks. Specifically, we would like to discuss transitioning to an Interchange-Plus pricing model to ensure transparency and cost-efficiency moving forward.</p>
      <p>Please review the attached findings and provide a revised fee schedule for our client's consideration. We look forward to a prompt resolution that maintains our positive processing relationship.</p>
      <p>Regards,<br/>The Audit Team<br/>Basis Badger</p>
    `;
    const data = await resend.emails.send({
      from: 'Basis Badger <onboarding@resend.dev>',
      to: 'basisbadgerllc@gmail.com',
      replyTo: merchantEmail,
      subject,
      html: body
    });
    console.log('Resend Response:', data);

    return NextResponse.json({ success: true, message: 'Badger Unleashed' });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
