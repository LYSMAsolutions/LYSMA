import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type AccountRequestPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  companyAddress?: string;
  postalCode?: string;
  city?: string;
  message?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    const requests = await prisma.account_requests.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      requests: requests.map((request) => ({
        id: String(request.id),
        type: "open_account",
        sourceTool: "PMA",
        company: request.company_name ?? "",
        sender: `${request.first_name ?? ""} ${request.last_name ?? ""}`.trim(),
        email: request.email ?? "",
        phone: request.phone ?? "",
        message: request.message ?? "",
        priority: "high",
        status: request.status ?? "new",
        createdAt: request.created_at,
      })),
    });
  } catch (error) {
    console.error("ACCOUNT_REQUEST_LIST_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la récupération des demandes.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AccountRequestPayload;

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const phone = clean(body.phone);
    const email = clean(body.email).toLowerCase();
    const companyName = clean(body.companyName);
    const companyAddress = clean(body.companyAddress);
    const postalCode = clean(body.postalCode);
    const city = clean(body.city);
    const message = clean(body.message);

    if (!firstName || !lastName || !email || !companyName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Merci de renseigner au minimum le prénom, le nom, l’email et le nom de l’entreprise.",
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

    const existingPendingRequest = await prisma.account_requests.findFirst({
      where: {
        email,
        status: "new",
      },
    });

    if (existingPendingRequest) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Une demande d’ouverture est déjà en attente pour cette adresse email.",
        },
        { status: 409 }
      );
    }

    await prisma.account_requests.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email,
        company_name: companyName,
        company_address: companyAddress || null,
        postal_code: postalCode || null,
        city: city || null,
        message: message || null,
        status: "new",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande a bien été envoyée.",
    });
  } catch (error) {
    console.error("ACCOUNT_REQUEST_CREATE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de l’envoi de la demande.",
      },
      { status: 500 }
    );
  }
}