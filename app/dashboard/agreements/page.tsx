import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AgreementsManager from "@/components/agreements/agreements-manager"

export const metadata: Metadata = {
  title: "Bilateral Agreements | Staff Portal",
  description: "Manage bilateral agreements between countries",
}

export default function AgreementsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bilateral Agreements</h1>
          <p className="mt-2 text-gray-600">Manage and track bilateral agreements between countries</p>
        </div>
        <AgreementsManager />
      </div>
    </DashboardLayout>
  )
}

