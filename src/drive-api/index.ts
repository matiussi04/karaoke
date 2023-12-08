import { authenticate } from '@google-cloud/local-auth';
import { google, Auth } from 'googleapis';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
];

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    const client = google.auth.fromJSON(credentials) as Auth.OAuth2Client;
    return client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<Auth.OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/* async function listFiles(): Promise<void> {
  const authClient = await authorize()
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id, name)',
  });
  const { files } = res.data;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file: any) => {
    console.log(`${file.name} (${file.id})`);
    return { name: file.name, id: file.id };
  });
} */

export default async function downloadFolder(
  folderId: string,
  parentPath = ''
): Promise<void> {
  const authClient = await authorize();
  const service = google.drive({ version: 'v3', auth: authClient });

  try {
    const res = await service.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
    });

    // eslint-disable-next-line prefer-destructuring
    const files = res.data.files;

    if (files.length === 0) {
      console.log(`No files found in the folder with ID ${folderId}.`);
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const filePath = path.join(parentPath, file.name);
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // eslint-disable-next-line no-await-in-loop
        await downloadFolder(file.id, filePath);
      } else if (file.mimeType !== 'image/jpeg') {
        // eslint-disable-next-line no-await-in-loop, no-use-before-define
        await downloadFile(file.id, filePath);
      }
    }

    console.log(`Folder with ID ${folderId} downloaded successfully.`);
  } catch (err) {
    console.error('Error fetching folder:', err);
    throw err;
  }
}

async function downloadFile(fileId: string, filePath: string): Promise<string> {
  const authClient = await authorize();
  const service = google.drive({ version: 'v3', auth: authClient });

  const destDir = path.dirname(filePath);

  try {
    // Cria a estrutura de diretórios localmente usando fs.mkdir
    await fs.mkdir(destDir, { recursive: true });

    const dest = createWriteStream(filePath);

    const response = await service.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    response.data
      .on('end', () => {
        console.log(`File ${filePath} downloaded successfully.`);
      })
      .on('error', (err: any) => {
        console.error(`Error downloading file ${filePath}:`, err);
      })
      .pipe(dest);

    return new Promise((resolve, reject) => {
      dest.on('finish', () => resolve(filePath));
      dest.on('error', reject);
    });
  } catch (err) {
    console.error(`Error fetching file ${filePath}:`, err);
    throw err;
  }
}
