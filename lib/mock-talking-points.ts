export interface TalkingPoint {
  id: string
  title: string
  context: string
  discussionPoints: string[]
  country: string
  category: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
}

export const mockTalkingPoints: TalkingPoint[] = [
  {
    id: "tp1",
    title: "Exploring Cooperation in Energy Sector",
    context:
      "• South Korea's significant reliance on energy imports.\n• The Kingdom's role as a major supplier of mineral products to South Korea.",
    discussionPoints: [
      "Discuss the potential for deeper cooperation in the energy sector, leveraging the Kingdom's position as a leading exporter of mineral products",
      "Explore joint ventures and investments in renewable energy projects, aligning with global shifts towards sustainable energy",
      "Highlight opportunities for technological exchange and innovation in energy efficiency and green technologies",
    ],
    country: "KR",
    category: "Energy",
    createdAt: "2023-11-15",
    updatedAt: "2023-11-15",
    createdBy: {
      id: "user1",
      name: "John Smith",
    },
  },
  {
    id: "tp2",
    title: "Trade Agreement Modernization",
    context:
      "• Existing trade agreement signed in 2009 needs updating.\n• New sectors like digital economy and AI are not covered in current agreement.",
    discussionPoints: [
      "Propose a comprehensive review of the existing trade agreement to address emerging sectors",
      "Highlight the importance of including digital economy provisions in the updated agreement",
      "Discuss potential timeline for negotiations and implementation of modernized agreement",
    ],
    country: "JP",
    category: "Trade",
    createdAt: "2023-10-20",
    updatedAt: "2023-10-25",
    createdBy: {
      id: "user2",
      name: "Emily Johnson",
    },
  },
  {
    id: "tp3",
    title: "Educational Exchange Programs",
    context:
      "• Growing interest in cultural and educational exchanges between our countries.\n• Opportunity to strengthen people-to-people connections.",
    discussionPoints: [
      "Propose expansion of existing scholarship programs for students from both countries",
      "Discuss establishment of joint research initiatives between leading universities",
      "Explore opportunities for language learning programs and cultural immersion experiences",
    ],
    country: "FR",
    category: "Education",
    createdAt: "2023-09-05",
    updatedAt: "2023-09-10",
    createdBy: {
      id: "user1",
      name: "John Smith",
    },
  },
  {
    id: "tp4",
    title: "Defense Cooperation Enhancement",
    context:
      "• Regional security challenges require closer coordination.\n• Existing defense cooperation framework established in 2015.",
    discussionPoints: [
      "Review implementation of current defense cooperation agreement and identify areas for enhancement",
      "Discuss potential for joint military exercises and training programs",
      "Explore collaboration on cybersecurity and defense technology development",
    ],
    country: "US",
    category: "Defense",
    createdAt: "2023-08-12",
    updatedAt: "2023-08-15",
    createdBy: {
      id: "user3",
      name: "Michael Brown",
    },
  },
  {
    id: "tp5",
    title: "Climate Change Initiatives",
    context:
      "• Both countries committed to Paris Agreement targets.\n• Opportunity for collaboration on green technology and sustainable development.",
    discussionPoints: [
      "Discuss alignment of climate policies and potential for joint initiatives",
      "Explore cooperation on renewable energy technology development and implementation",
      "Propose establishment of a bilateral working group on climate change and sustainability",
    ],
    country: "DE",
    category: "Environment",
    createdAt: "2023-07-20",
    updatedAt: "2023-07-25",
    createdBy: {
      id: "user2",
      name: "Emily Johnson",
    },
  },
]

