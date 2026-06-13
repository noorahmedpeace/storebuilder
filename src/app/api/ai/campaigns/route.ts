import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getActorFromRequest,
  requirePermission,
  requireStoreScope,
} from "@/lib/auth";

const campaignSchema = z.object({
  goal: z.string().min(3).default("Launch Summer Campaign"),
});

export async function POST(request: Request) {
  const actor = await getActorFromRequest(request);
  const forbidden = requirePermission(actor, "store:*");
  if (forbidden) return forbidden;

  const missingScope = requireStoreScope(actor);
  if (missingScope) return missingScope;

  const json = await request.json().catch(() => ({}));
  const parsed = campaignSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid campaign payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const goal = parsed.data.goal;

  return NextResponse.json({
    data: {
      goal,
      generated: {
        landingPage: `${goal} landing page draft`,
        coupon: "SUMMER10",
        whatsapp: "New arrivals are live. Reply YES to claim your offer.",
        emailSubject: "Your summer offer is ready",
        seoArticle: "How to choose the right product this season",
        socialCaption: "Fresh deals, fast delivery, trusted checkout.",
      },
      creditsUsed: 6,
      storeId: actor.storeId,
    },
    message: "Mock AI campaign generated. Connect to metered AI provider next.",
  });
}
