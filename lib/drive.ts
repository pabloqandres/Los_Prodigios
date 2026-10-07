import { google } from 'googleapis'

export function getDriveClient(_accessToken?: string) {
  // Use Service Account if available (preferred — no token expiry)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })
    return google.drive({ version: 'v3', auth })
  }

  // Fallback: user OAuth token
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  auth.setCredentials({ access_token: _accessToken })
  return google.drive({ version: 'v3', auth })
}

export function getDriveWriteClient(_accessToken?: string) {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/drive'],
    })
    return google.drive({ version: 'v3', auth })
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  auth.setCredentials({ access_token: _accessToken })
  return google.drive({ version: 'v3', auth })
}

export const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID ?? ''

// ── Drive helpers (call directly — no internal HTTP) ───────────────────────

async function findOrCreateFolder(
  drive: ReturnType<typeof getDriveWriteClient>,
  name: string,
  parentId: string
): Promise<string> {
  const res = await drive.files.list({
    q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  })
  if (res.data.files && res.data.files.length > 0) return res.data.files[0].id!
  const created = await drive.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] },
    fields: 'id',
    supportsAllDrives: true,
  })
  return created.data.id!
}

export async function ensureDriveFolder(category: string, entity_name: string, subfolder: string, accessToken?: string): Promise<string> {
  const drive = getDriveWriteClient(accessToken)
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
  const assetsId    = await findOrCreateFolder(drive, 'Assets', ROOT_FOLDER_ID)
  const categoryId  = await findOrCreateFolder(drive, categoryLabel, assetsId)
  const entityId    = await findOrCreateFolder(drive, entity_name, categoryId)
  return findOrCreateFolder(drive, subfolder, entityId)
}

export async function moveDriveFile(
  fileId: string,
  fromFolderId: string,
  toFolderId: string,
  newName?: string,
  accessToken?: string
): Promise<{ id: string; name: string; webViewLink: string }> {
  const drive = getDriveWriteClient(accessToken)
  const res = await drive.files.update({
    fileId,
    addParents: toFolderId,
    removeParents: fromFolderId,
    fields: 'id, name, webViewLink',
    supportsAllDrives: true,
    requestBody: newName ? { name: newName } : {},
  })
  return { id: res.data.id!, name: res.data.name!, webViewLink: res.data.webViewLink! }
}

// Map from Drive folder names to app category keys
export const CATEGORY_FOLDER_MAP: Record<string, string> = {
  'concept-art': 'concept-art',
  'personajes':  'personajes',
  'locaciones':  'locaciones',
  'props':       'props',
  'criaturas':   'criaturas',
  'storyboards': 'storyboards',
  'biblia':      'biblia',
  'continuidad': 'continuidad',
}
