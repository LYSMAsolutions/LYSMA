import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

const VALID_TYPES = ["promo", "operation_commerciale", "fournisseur", "mise_en_avant"];

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const now = new Date();
    const { searchParams } = new URL(req.url);
    const includeExpired = searchParams.get("include_expired") === "true";

    const where: Record<string, unknown> = {
      distributor_id: session.user.distributorId,
    };

    if (!includeExpired) {
      where.OR = [{ valid_to: null }, { valid_to: { gte: now } }];
    }

    const campaigns = await prisma.catalogue_campaigns.findMany({
      where,
      include: {
        catalogues: { select: { id: true, code: true, name: true } },
        _count: { select: { catalogue_item_campaigns: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body        = await req.json();
    const code        = String(body.code         || "").trim().toUpperCase();
    const name        = String(body.name         || "").trim();
    const campaignType= String(body.campaign_type|| "").trim();
    const description = body.description ? String(body.description).trim() : null;
    const billingCode = body.billing_code ? String(body.billing_code).trim() : null;
    const validFrom   = body.valid_from   ? new Date(body.valid_from) : null;
    const validTo     = body.valid_to     ? new Date(body.valid_to)   : null;
    const catalogueId = body.catalogue_id || null;

    if (!code || !name || !campaignType)
      return NextResponse.json({ success: false, message: "Code, nom et type sont obligatoires." }, { status: 400 });

    if (!VALID_TYPES.includes(campaignType))
      return NextResponse.json({ success: false, message: "Type invalide." }, { status: 400 });

    const existing = await prisma.catalogue_campaigns.findFirst({
      where: { distributor_id: session.user.distributorId, code },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Une campagne avec ce code existe déjà." }, { status: 409 });

    const campaign = await prisma.catalogue_campaigns.create({
      data: {
        distributor_id: session.user.distributorId,
        code, name,
        campaign_type:  campaignType,
        description,
        billing_code:   billingCode,
        valid_from:     validFrom,
        valid_to:       validTo,
        catalogue_id:   catalogueId,
        is_active:      true,
      },
    });

    return NextResponse.json({ success: true, campaignId: campaign.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}