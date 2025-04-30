import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import TalkingPointsContent from "./talking-points-content"

export const metadata: Metadata = {
  title: "Talking Points | Staff Portal",
  description: "Add talking points to your report",
}

export default function TalkingPointsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 7: Add talking points to your report</p>
        </div>
        <TalkingPointsContent />
      </div>
    </DashboardLayout>
  )
}

