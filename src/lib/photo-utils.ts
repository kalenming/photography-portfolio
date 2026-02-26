import "server-only";

import { put } from "@vercel/blob";
import sharp from "sharp";
import exifr from "exifr";
import { v4 as uuidv4 } from "uuid";

export interface ExifData {
  shotAt?: Date;
  latitude?: number;
  longitude?: number;
  camera?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  width?: number;
  height?: number;
}

export async function parseExifFromBuffer(buffer: Buffer): Promise<ExifData> {
  try {
    const exif = await exifr.parse(buffer, {
      pick: [
        "DateTimeOriginal",
        "CreateDate",
        "GPSLatitude",
        "GPSLongitude",
        "Make",
        "Model",
        "LensModel",
        "ISO",
        "FNumber",
        "ExposureTime",
        "FocalLength",
        "ImageWidth",
        "ImageHeight",
        "ExifImageWidth",
        "ExifImageHeight",
      ],
    });

    if (!exif) {
      return {};
    }

    const shotAt = exif.DateTimeOriginal || exif.CreateDate;

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (exif.GPSLatitude && exif.GPSLongitude) {
      latitude = Array.isArray(exif.GPSLatitude)
        ? convertDMSToDD(exif.GPSLatitude)
        : exif.GPSLatitude;
      longitude = Array.isArray(exif.GPSLongitude)
        ? convertDMSToDD(exif.GPSLongitude)
        : exif.GPSLongitude;
    }

    const camera = exif.Make && exif.Model 
      ? `${exif.Make} ${exif.Model}`.trim()
      : exif.Model;

    const result: ExifData = {
      shotAt: shotAt ? new Date(shotAt) : undefined,
      latitude,
      longitude,
      camera,
      lens: exif.LensModel,
      iso: exif.ISO,
      aperture: exif.FNumber ? `f/${exif.FNumber}` : undefined,
      shutterSpeed: exif.ExposureTime 
        ? exif.ExposureTime < 1 
          ? `1/${Math.round(1 / exif.ExposureTime)}s`
          : `${exif.ExposureTime}s`
        : undefined,
      focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : undefined,
      width: exif.ImageWidth || exif.ExifImageWidth,
      height: exif.ImageHeight || exif.ExifImageHeight,
    };

    return result;
  } catch (error) {
    console.error("Error parsing EXIF:", error);
    return {};
  }
}

function convertDMSToDD(dms: number[]): number {
  const [degrees, minutes, seconds] = dms;
  return degrees + minutes / 60 + seconds / 3600;
}

async function generateThumbnailBuffer(
  buffer: Buffer,
  maxWidth = 800,
  maxHeight = 600
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const image = sharp(buffer);

  const thumbnailBuffer = await image
    .resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer();

  const metadata = await sharp(thumbnailBuffer).metadata();

  return {
    buffer: thumbnailBuffer,
    width: metadata.width || maxWidth,
    height: metadata.height || maxHeight,
  };
}

export async function saveUploadedFile(
  file: File,
  originalName: string
): Promise<{
  id: string;
  originalPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  fileSize: number;
}> {
  const id = uuidv4();
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const originalFilename = `originals/${id}.${ext}`;
  const thumbnailFilename = `thumbnails/${id}.jpg`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { buffer: thumbnailBuffer, width, height } = await generateThumbnailBuffer(buffer);

  const [originalBlob, thumbnailBlob] = await Promise.all([
    put(originalFilename, buffer, {
      access: "public",
      contentType: file.type || "image/jpeg",
    }),
    put(thumbnailFilename, thumbnailBuffer, {
      access: "public",
      contentType: "image/jpeg",
    }),
  ]);

  return {
    id,
    originalPath: originalBlob.url,
    thumbnailPath: thumbnailBlob.url,
    width,
    height,
    fileSize: buffer.length,
  };
}

export function getDateFromExif(shotAt?: Date): {
  year: number;
  month: number;
  day: number;
} {
  const date = shotAt || new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function guessLocationFromGPS(
  latitude?: number,
  longitude?: number
): string | undefined {
  if (!latitude || !longitude) return undefined;
  return undefined;
}
