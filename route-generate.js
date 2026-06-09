import { NextResponse } from 'next/server';
import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { uploadToDrive } from '../../drive-utils';

const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_FILE_ID = process.env.NEXT_PUBLIC_FIGMA_FILE_ID;

// Mapeo de países a frame names en Figma
const COUNTRY_MAP = {
  directivos: 'Argentina',
  finanzas: 'Brasil',
  operaciones: 'Uruguay',
  rrhh: 'Alemania',
  ingenieria: 'España',
  producto: 'Inglaterra',
  marketing: 'Francia',
  soda: 'México',
  connectone: 'Portugal',
  premier: 'Colombia',
  it: 'Países Bajos'
};

async function getFigmaTemplate(country) {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_ID}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN
        }
      }
    );

    // Buscar el frame/componente del país
    const document = response.data.document;
    // En un caso real, aquí harías un parse del documento Figma para encontrar el frame correcto
    
    return {
      success: true,
      message: 'Template obtenido de Figma'
    };
  } catch (error) {
    console.error('Error fetching Figma template:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function generateSticker(photoBuffer, country) {
  try {
    // Crear imagen del sticker usando Sharp
    const templateWidth = 400;
    const templateHeight = 550;
    const photoSize = 160;

    // Crear canvas base
    const baseImage = await sharp({
      create: {
        width: templateWidth,
        height: templateHeight,
        channels: 3,
        background: { r: 255, g: 228, b: 181 } // Color base (ejemplo)
      }
    })
    .png()
    .toBuffer();

    // Procesar foto del usuario
    const processedPhoto = await sharp(photoBuffer)
      .resize(photoSize, photoSize, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    // Combinar imagen (simplificado)
    // En producción, integrarías con Figma para obtener el template real
    const finalImage = await sharp(baseImage)
      .composite([
        {
          input: processedPhoto,
          left: (templateWidth - photoSize) / 2,
          top: 160
        }
      ])
      .toBuffer();

    return finalImage;
  } catch (error) {
    console.error('Error generating sticker:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const photoFile = formData.get('photo');
    const department = formData.get('department');
    const country = formData.get('country');

    if (!photoFile || !department) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const photoBuffer = await photoFile.arrayBuffer();

    // Obtener template de Figma
    const figmaResult = await getFigmaTemplate(country);
    if (!figmaResult.success) {
      console.warn('Figma template fetch issue:', figmaResult.error);
    }

    // Generar sticker
    const stickerBuffer = await generateSticker(photoBuffer, country);

    // Guardar en Google Drive (async, no esperar)
    try {
      uploadToDrive(stickerBuffer, department, country).catch(err => {
        console.error('Drive upload error:', err);
      });
    } catch (driveError) {
      console.error('Error uploading to Drive:', driveError);
    }

    // Convertir a base64 para respuesta
    const base64Image = stickerBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      imageUrl,
      success: true,
      message: 'Sticker generado exitosamente'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar sticker' },
      { status: 500 }
    );
  }
}
