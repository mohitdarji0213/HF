import emailjs from 'emailjs-com'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id'
const TEMPLATE_ISSUE = import.meta.env.VITE_EMAILJS_TEMPLATE_ISSUE || 'template_issue'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'

export const sendIssueEmail = async ({ senderName, senderEmail, recipientRole, department, issueType, description, urgency }) => {
  const params = {
    from_name: senderName,
    from_email: senderEmail,
    to_role: recipientRole,
    department,
    issue_type: issueType,
    description,
    urgency,
    submitted_at: new Date().toLocaleString('en-IN'),
  }
  return emailjs.send(SERVICE_ID, TEMPLATE_ISSUE, params, PUBLIC_KEY)
}
