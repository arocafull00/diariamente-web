import { isPredefinedAvatarId, predefinedAvatars } from "@/lib/avatars";
import { renderPredefinedAvatarSvg } from "@/server/avatars/render-avatar";

export async function generateStaticParams() {
  return predefinedAvatars.map((avatar) => ({ avatarId: avatar.id }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/avatars/[avatarId]">,
) {
  const { avatarId } = await params;

  if (!isPredefinedAvatarId(avatarId)) {
    return new Response("Not found", { status: 404 });
  }

  const svg = renderPredefinedAvatarSvg(avatarId);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
