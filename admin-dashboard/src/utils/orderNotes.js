/**
 * Admin Order Notes Local Storage Helper
 * Keeps internal admin notes synchronized reliably across sessions.
 */

const NOTES_STORAGE_KEY = 'admin_order_notes'

export const getAllAdminNotes = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export const getAdminNote = (orderId) => {
  if (!orderId) return ''
  const notes = getAllAdminNotes()
  return notes[orderId] || ''
}

export const saveAdminNote = (keys, noteText) => {
  try {
    const notes = getAllAdminNotes()
    const targetKeys = Array.isArray(keys) ? keys.filter(Boolean) : [keys].filter(Boolean)
    const trimmed = (noteText || '').trim()

    targetKeys.forEach((key) => {
      if (trimmed) {
        notes[key] = trimmed
      } else {
        delete notes[key]
      }
    })

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // ignore storage quota / private mode errors
  }
}
