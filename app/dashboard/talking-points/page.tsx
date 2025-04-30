import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import TalkingPointsManager from "@/components/talking-points/talking-points-manager"

export const metadata: Metadata = {
  title: "Talking Points | Staff Portal",
  description: "Manage talking points for diplomatic meetings and briefings",
}

export default function TalkingPointsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Talking Points</h1>
          <p className="mt-2 text-gray-600">Manage talking points for diplomatic meetings and briefings</p>
        </div>
        <TalkingPointsManager />
      </div>
    </DashboardLayout>
  )
}

