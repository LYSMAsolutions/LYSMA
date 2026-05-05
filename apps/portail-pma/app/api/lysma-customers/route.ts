import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const customers = await prisma.lysma_customers.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("LYSMA_CUSTOMERS_LIST_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des clients LYSMA.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const companyName = clean(body.companyName);
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const addressLine1 = clean(body.addressLine1);
    const addressLine2 = clean(body.addressLine2);
    const postalCode = clean(body.postalCode);
    const city = clean(body.city);
    const country = clean(body.country);
    const status = clean(body.status) || "active";
    const source = clean(body.source) || "manual";
    const notes = clean(body.notes);
    const sourceRequestId = clean(body.sourceRequestId);

    let toolsEnabled = body.toolsEnabled;
    if (!Array.isArray(toolsEnabled)) {
      toolsEnabled = [];
    }

    if (!companyName || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Le nom de société et l’email sont obligatoires.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Adresse email invalide.",
        },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.lysma_customers.findUnique({
      where: { email },
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
        company_name: companyName,
        contact_first_name: firstName || null,
        contact_last_name: lastName || null,
        email,
        phone: phone || null,
        address_line_1: addressLine1 || null,
        address_line_2: addressLine2 || null,
        postal_code: postalCode || null,
        city: city || null,
        country: country || null,
        status,
        source,
        temporary_password: temporaryPassword,
        tools_enabled: toolsEnabled,
        notes: notes || null,
        source_request_id: sourceRequestId || null,
      },
    });

    return NextResponse.json({
      success: true,
      customer,
      temporaryPassword,
    });
  } catch (error) {
    console.error("LYSMA_CUSTOMER_CREATE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la création du client LYSMA.",
      },
      { status: 500 }
    );
  }
}