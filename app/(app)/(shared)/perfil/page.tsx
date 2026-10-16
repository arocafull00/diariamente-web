import { ProfileScreen } from "@/components/profile/profile-screen";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function ProfilePage() {
  return <ProfileScreen refreshedAt={await getRenderTime()} />;
}
