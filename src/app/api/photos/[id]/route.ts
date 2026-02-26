import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, location, categories } = body;

    const photo = await prisma.photo.update({
      where: { id: params.id },
      data: {
        title,
        description,
        location,
      },
    });

    if (categories) {
      await prisma.photoCategory.deleteMany({
        where: { photoId: params.id },
      });

      for (const categoryName of categories) {
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
      }
    }

    const updatedPhoto = await prisma.photo.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.photo.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
