import { HomeScreen } from "@/components/home/home-screen";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function PatientHomePage() {
  return <HomeScreen refreshedAt={await getRenderTime()} />;
}
