// Define the report type
export interface Report {
  id: string
  title: string
  country: string
  date: string | null
  type: string
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
  approvalStatus: "pending" | "approved" | "rejected"
  approvedBy?: {
    id: string
    name: string
  }
  description?: string
  tags?: string[]
}

// Mock data for reports
export const mockReports: Report[] = [
  {
    id: "1",
    title: "US-Japan Trade Meeting",
    country: "jp",
    date: "2025-03-10",
    type: "meeting",
    createdAt: "2025-03-05",
    createdBy: {
      id: "user1",
      name: "John Smith",
    },
    approvalStatus: "approved",
    approvedBy: {
      id: "user2",
      name: "Sarah Johnson",
    },
    description: "Comprehensive report on trade negotiations between Japan and the United States",
    tags: ["Trade", "Bilateral", "Technology"],
  },
  {
    id: "2",
    title: "Germany Economic Overview",
    country: "de",
    date: null,
    type: "informative",
    createdAt: "2025-02-28",
    createdBy: {
      id: "user3",
      name: "Michael Brown",
    },
    approvalStatus: "pending",
    description: "Analysis of Germany's economic indicators and future outlook",
    tags: ["Economy", "Europe", "Manufacturing"],
  },
  {
    id: "3",
    title: "UK Diplomatic Relations",
    country: "gb",
    date: "2025-04-15",
    type: "meeting",
    createdAt: "2025-02-20",
    createdBy: {
      id: "user1",
      name: "John Smith",
    },
    approvalStatus: "approved",
    approvedBy: {
      id: "user4",
      name: "Emily Davis",
    },
    description: "Report on diplomatic relations with the United Kingdom",
    tags: ["Diplomacy", "Europe", "Post-Brexit"],
  },
  {
    id: "4",
    title: "China Trade Analysis",
    country: "cn",
    date: null,
    type: "informative",
    createdAt: "2025-03-12",
    createdBy: {
      id: "user3",
      name: "Michael Brown",
    },
    approvalStatus: "pending",
    description: "Comprehensive analysis of trade relations with China",
    tags: ["Trade", "Asia", "Manufacturing"],
  },
  {
    id: "5",
    title: "India Investment Opportunities",
    country: "in",
    date: "2025-05-20",
    type: "meeting",
    createdAt: "2025-03-15",
    createdBy: {
      id: "user2",
      name: "Sarah Johnson",
    },
    approvalStatus: "rejected",
    description: "Overview of investment opportunities in India's growing economy",
    tags: ["Investment", "Asia", "Technology"],
  },
  {
    id: "6",
    title: "Brazil Agricultural Cooperation",
    country: "br",
    date: "2025-04-10",
    type: "meeting",
    createdAt: "2025-03-18",
    createdBy: {
      id: "user5",
      name: "David Wilson",
    },
    approvalStatus: "approved",
    approvedBy: {
      id: "user2",
      name: "Sarah Johnson",
    },
    description: "Report on agricultural cooperation initiatives with Brazil",
    tags: ["Agriculture", "South America", "Trade"],
  },
  {
    id: "7",
    title: "France Cultural Exchange Program",
    country: "fr",
    date: "2025-06-15",
    type: "informative",
    createdAt: "2025-03-20",
    createdBy: {
      id: "user4",
      name: "Emily Davis",
    },
    approvalStatus: "pending",
    description: "Overview of cultural exchange programs with France",
    tags: ["Culture", "Europe", "Education"],
  },
  {
    id: "8",
    title: "Australia Energy Partnership",
    country: "au",
    date: null,
    type: "informative",
    createdAt: "2025-03-22",
    createdBy: {
      id: "user1",
      name: "John Smith",
    },
    approvalStatus: "approved",
    approvedBy: {
      id: "user3",
      name: "Michael Brown",
    },
    description: "Analysis of energy partnership opportunities with Australia",
    tags: ["Energy", "Oceania", "Renewable"],
  },
  {
    id: "9",
    title: "South Africa Mining Cooperation",
    country: "za",
    date: "2025-05-05",
    type: "meeting",
    createdAt: "2025-03-25",
    createdBy: {
      id: "user5",
      name: "David Wilson",
    },
    approvalStatus: "pending",
    description: "Report on mining cooperation initiatives with South Africa",
    tags: ["Mining", "Africa", "Resources"],
  },
  {
    id: "10",
    title: "Canada Technology Summit",
    country: "ca",
    date: "2025-04-25",
    type: "meeting",
    createdAt: "2025-03-28",
    createdBy: {
      id: "user2",
      name: "Sarah Johnson",
    },
    approvalStatus: "approved",
    approvedBy: {
      id: "user4",
      name: "Emily Davis",
    },
    description: "Summary of technology summit with Canadian partners",
    tags: ["Technology", "North America", "Innovation"],
  },
]

