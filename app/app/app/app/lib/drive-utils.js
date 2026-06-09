import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Credenciales de Google Service Account
// Estas deben estar configuradas en variables de entorno
const getAuthClient = () => {
  try {
    const serviceAccount = {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
    };

    return new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export async function uploadToDrive(imageBuffer, department, country) {
  try {
    const authClient = getAuthClient();
    if (!authClient) {
      console.warn('No auth client available for Drive upload');
      return { success: false, message: 'Auth not configured' };
    }

    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileName = `Panini-${country}-${department}-${Date.now()}.png`;

    const fileMetadata = {
      name: fileName,
      parents: [DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: 'image/png',
      body: imageBuffer,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    console.log(`Archivo guardado en Drive: ${response.data.id}`);
    return {
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    return { success: false, error: error.message };
  }
}
