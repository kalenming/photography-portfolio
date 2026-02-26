import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  saveUploadedFile,
  parseExifFromBuffer,
  getDateFromExif,
} from "@/lib/photo-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const location = searchParams.get("location");
    const category = searchParams.get("category");

    const where: any = {};

    if (year) {
      where.year = parseInt(year);
    }
    if (month) {
      where.month = parseInt(month);
    }
    if (location) {
      where.location = { contains: location };
    }
    if (category) {
      where.categories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    const photos = await prisma.photo.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        shotAt: "desc",
      },
    });

    return NextResponse.json(photos);
  } catch (error: any) {
    console.error("Error fetching photos:", error);
    if (error.code === "P2021" || error.message?.includes("table")) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoriesStr = formData.get("categories") as string;
    const location = formData.get("location") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 }
      );
    }

    const fileInfo = await saveUploadedFile(file, file.name);

    const buffer = Buffer.from(await file.arrayBuffer());
    const exifData = await parseExifFromBuffer(buffer);

    const { year, month, day } = getDateFromExif(exifData.shotAt);

    const photo = await prisma.photo.create({
      data: {
        title,
        filename: file.name,
        originalPath: fileInfo.originalPath,
        thumbnailPath: fileInfo.thumbnailPath,
        width: fileInfo.width,
        height: fileInfo.height,
        fileSize: fileInfo.fileSize,
        shotAt: exifData.shotAt,
        latitude: exifData.latitude,
        longitude: exifData.longitude,
        location: location || undefined,
        camera: exifData.camera,
        lens: exifData.lens,
        iso: exifData.iso,
        aperture: exifData.aperture,
        shutterSpeed: exifData.shutterSpeed,
        focalLength: exifData.focalLength,
        description,
        year,
        month,
        day,
      },
    });

    if (categoriesStr) {
      const categoryNames = categoriesStr.split(",").map((c) => c.trim());
      for (const categoryName of categoryNames) {
        let category = await prisma.category.findUnique({
          where: { name: categoryName },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: categoryName,
              type: "theme",
            },
          });
        }

        await prisma.photoCategory.create({
          data: {
            photoId: photo.id,
            categoryId: category.id,
          },
        });

        await prisma.category.update({
          where: { id: category.id },
          data: { count: { increment: 1 } },
        });
      }
    }

    const photoWithCategories = await prisma.photo.findUnique({
      where: { id: photo.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(photoWithCategories);
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
