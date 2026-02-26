import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const years = await prisma.photo.findMany({
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "desc",
      },
    });

    const months = await prisma.photo.findMany({
      select: {
        year: true,
        month: true,
      },
      distinct: ["year", "month"],
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    const locations = await prisma.photo.findMany({
      select: {
        location: true,
      },
      distinct: ["location"],
      where: {
        location: { not: null },
      },
    });

    const stats = await prisma.photo.count();

    return NextResponse.json({
      years: years.map((y) => y.year),
      months: months.map((m) => ({ year: m.year, month: m.month })),
      locations: locations.map((l) => l.location).filter(Boolean),
      totalPhotos: stats,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    if (error.code === "P2021" || error.message?.includes("table")) {
      return NextResponse.json({
        years: [],
        months: [],
        locations: [],
        totalPhotos: 0,
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
