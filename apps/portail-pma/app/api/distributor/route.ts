import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const distributorId = searchParams.get("distributorId");

    const clients = await prisma.clients.findMany({
      where: distributorId
        ? {
            distributor_id: distributorId,
          }
        : undefined,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        distributor_id: true,
        name: true,
        representative_name: true,
        email: true,
        phone: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        code: true,
        city: true,
        postal_code: true,
        distributors: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      clients: clients.map((client) => ({
        id: client.id,
        distributorId: client.distributor_id,
        distributorName: client.distributors?.name ?? "",
        distributorSlug: client.distributors?.slug ?? "",
        distributorStatus: client.distributors?.status ?? "",
        company: client.name ?? "",
        contactName: client.representative_name ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        code: client.code ?? "",
        city: client.city ?? "",
        postalCode: client.postal_code ?? "",
        status: client.is_active ? "active" : "inactive",
        createdAt: client.created_at,
        updatedAt: client.updated_at,
      })),
    });
  } catch (error) {
    console.error("DISTRIBUTOR_CLIENTS_LIST_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des clients.",
      },
      { status: 500 }
    );
  }
}