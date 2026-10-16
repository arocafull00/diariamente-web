import { MyRecordsScreen } from "@/components/records/my-records-screen";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function MyRecordsPage() {
  return <MyRecordsScreen refreshedAt={await getRenderTime()} />;
}
