import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generatePassword(length = 10) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requestId =
      typeof body.requestId === "string" ? body.requestId.trim() : "";

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "requestId manquant." },
        { status: 400 }
      );
    }

    const accountRequest = await prisma.account_requests.findUnique({
      where: { id: requestId },
    });

    if (!accountRequest) {
      return NextResponse.json(
        { success: false, message: "Demande introuvable." },
        { status: 404 }
      );
    }

    const existingCustomer = await prisma.lysma_customers.findUnique({
      where: { email: accountRequest.email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Un client LYSMA existe déjà avec cette adresse email.",
        },
        { status: 409 }
      );
    }

    const temporaryPassword = generatePassword();

    const customer = await prisma.lysma_customers.create({
      data: {
        company_name: accountRequest.company_name,
        contact_first_name: accountRequest.first_name,
        contact_last_name: accountRequest.last_name,
        email: accountRequest.email,
        phone: accountRequest.phone || null,
        address_line_1: accountRequest.company_address || null,
        postal_code: accountRequest.postal_code || null,
        city: accountRequest.city || null,
        source: "request",
        status: "active",
        temporary_password: temporaryPassword,
        source_request_id: accountRequest.id,
        notes: accountRequest.message || null,
        tools_enabled: ["PMA"],
      },
    });

    await prisma.account_requests.update({
      where: { id: accountRequest.id },
      data: {
        status: "processed",
      },
    });

    return NextResponse.json({
      success: true,
      customer,
      temporaryPassword,
    });
  } catch (error) {
    console.error("LYSMA_CUSTOMER_FROM_REQUEST_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la création du client depuis la demande.",
      },
      { status: 500 }
    );
  }
}