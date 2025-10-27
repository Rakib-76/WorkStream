/**
 * Generate a unique meeting code in format: ABC-DEF-GHI
 */
export function generateMeetingCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) {
      code += "-"
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Generate a shareable meeting link
 */
export function generateMeetingLink(meetingCode) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://meet.example.com"
  return `${baseUrl}/join?code=${meetingCode}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("[v0] Failed to copy to clipboard:", err)
    return false
  }
}

/**
 * Generate Gmail share link
 */
export function generateGmailShareLink(meetingCode, userName = "Team Member") {
  const meetingLink = generateMeetingLink(meetingCode)
  const subject = encodeURIComponent("Join my video meeting")
  const body = encodeURIComponent(
    `Hi,\n\nI'd like to invite you to join my video meeting.\n\nMeeting Code: ${meetingCode}\n\nJoin Link: ${meetingLink}\n\nYou can join by entering the meeting code or clicking the link above.\n\nSee you there!\n\n${userName}`,
  )
  return `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`
}
