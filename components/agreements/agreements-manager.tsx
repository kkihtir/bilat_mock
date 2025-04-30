"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react"
import { mockCountries } from "@/lib/mock-data"
import { format } from "date-fns"

// Define the agreement type
interface Agreement {
  id: string
  name: string
  country: string
  status: "in_progress" | "planned" | "completed" | "cancelled" | "expired"
  latestUpdate: string
  updatedAt: string
  description?: string
  startDate?: string
  endDate?: string
  type?: string
  updates: {
    id: string
    text: string
    date: string
    author?: string
  }[]
}

// Mock data for agreements
const mockAgreements: Agreement[] = [
  {
    id: "1",
    name: "Trade and Investment Framework Agreement",
    country: "jp",
    status: "in_progress",
    latestUpdate: "Negotiation phase 2 completed. Awaiting legal review.",
    updatedAt: "2024-03-15",
    description: "Framework agreement to promote trade and investment between the countries",
    startDate: "2023-10-01",
    endDate: "2025-10-01",
    type: "Trade",
    updates: [
      {
        id: "1-3",
        text: "Negotiation phase 2 completed. Awaiting legal review.",
        date: "2024-03-15",
        author: "Sarah Johnson",
      },
      {
        id: "1-2",
        text: "Working groups established for key trade sectors. Phase 1 negotiations completed.",
        date: "2024-02-10",
        author: "Michael Brown",
      },
      {
        id: "1-1",
        text: "Initial framework drafted and shared with Japanese counterparts.",
        date: "2023-11-05",
        author: "John Smith",
      },
    ],
  },
  {
    id: "2",
    name: "Mutual Defense Cooperation Agreement",
    country: "gb",
    status: "completed",
    latestUpdate: "Agreement signed by both parties and ratified.",
    updatedAt: "2024-02-20",
    description: "Agreement on defense cooperation and joint military exercises",
    startDate: "2024-01-15",
    endDate: "2029-01-15",
    type: "Defense",
    updates: [
      {
        id: "2-3",
        text: "Agreement signed by both parties and ratified.",
        date: "2024-02-20",
        author: "Emily Davis",
      },
      {
        id: "2-2",
        text: "Final draft approved by legal teams on both sides.",
        date: "2024-01-25",
        author: "Robert Wilson",
      },
      {
        id: "2-1",
        text: "Initial discussions on scope and terms of cooperation.",
        date: "2023-12-10",
        author: "Emily Davis",
      },
    ],
  },
  {
    id: "3",
    name: "Cultural Exchange Program",
    country: "fr",
    status: "in_progress",
    latestUpdate: "Draft agreement under review by cultural ministry.",
    updatedAt: "2024-03-10",
    description: "Program for cultural exchange including arts, education, and heritage",
    startDate: "2024-06-01",
    endDate: "2026-06-01",
    type: "Cultural",
    updates: [
      {
        id: "3-2",
        text: "Draft agreement under review by cultural ministry.",
        date: "2024-03-10",
        author: "Jennifer Lee",
      },
      {
        id: "3-1",
        text: "Initial proposal for cultural exchange program developed.",
        date: "2024-02-05",
        author: "Jennifer Lee",
      },
    ],
  },
  {
    id: "4",
    name: "Science and Technology Cooperation",
    country: "de",
    status: "planned",
    latestUpdate: "Initial planning meeting scheduled for next month.",
    updatedAt: "2024-03-05",
    description: "Cooperation in research and development of new technologies",
    type: "Science",
    updates: [
      {
        id: "4-1",
        text: "Initial planning meeting scheduled for next month.",
        date: "2024-03-05",
        author: "David Chen",
      },
    ],
  },
  {
    id: "5",
    name: "Agricultural Trade Agreement",
    country: "br",
    status: "in_progress",
    latestUpdate: "Negotiations ongoing regarding tariff reductions.",
    updatedAt: "2024-03-18",
    description: "Agreement to reduce tariffs on agricultural products",
    startDate: "2023-12-01",
    type: "Trade",
    updates: [
      {
        id: "5-2",
        text: "Negotiations ongoing regarding tariff reductions.",
        date: "2024-03-18",
        author: "Maria Rodriguez",
      },
      {
        id: "5-1",
        text: "Initial framework for agricultural trade agreement proposed.",
        date: "2023-12-15",
        author: "Maria Rodriguez",
      },
    ],
  },
  {
    id: "6",
    name: "Visa Waiver Program",
    country: "au",
    status: "completed",
    latestUpdate: "Program implemented successfully.",
    updatedAt: "2024-01-10",
    description: "Program allowing visa-free travel between countries for short stays",
    startDate: "2024-01-01",
    endDate: "2029-01-01",
    type: "Immigration",
    updates: [
      {
        id: "6-3",
        text: "Program implemented successfully.",
        date: "2024-01-10",
        author: "James Wilson",
      },
      {
        id: "6-2",
        text: "Final agreement signed by both governments.",
        date: "2023-12-20",
        author: "James Wilson",
      },
      {
        id: "6-1",
        text: "Draft program details finalized after consultation.",
        date: "2023-11-15",
        author: "Lisa Thompson",
      },
    ],
  },
  {
    id: "7",
    name: "Environmental Protection Cooperation",
    country: "ca",
    status: "in_progress",
    latestUpdate: "Working groups established for key environmental areas.",
    updatedAt: "2024-02-28",
    description: "Joint efforts to address climate change and environmental protection",
    startDate: "2024-02-01",
    endDate: "2026-02-01",
    type: "Environment",
    updates: [
      {
        id: "7-2",
        text: "Working groups established for key environmental areas.",
        date: "2024-02-28",
        author: "Thomas Johnson",
      },
      {
        id: "7-1",
        text: "Initial framework for environmental cooperation drafted.",
        date: "2024-02-05",
        author: "Thomas Johnson",
      },
    ],
  },
  {
    id: "8",
    name: "Double Taxation Avoidance Agreement",
    country: "in",
    status: "expired",
    latestUpdate: "Agreement expired. Renewal discussions to begin next quarter.",
    updatedAt: "2024-01-05",
    description: "Agreement to prevent double taxation of income",
    startDate: "2019-01-01",
    endDate: "2024-01-01",
    type: "Taxation",
    updates: [
      {
        id: "8-2",
        text: "Agreement expired. Renewal discussions to begin next quarter.",
        date: "2024-01-05",
        author: "Amanda Williams",
      },
      {
        id: "8-1",
        text: "Final notice of agreement expiration sent to stakeholders.",
        date: "2023-12-01",
        author: "Amanda Williams",
      },
    ],
  },
  {
    id: "9",
    name: "Cybersecurity Cooperation Framework",
    country: "us",
    status: "planned",
    latestUpdate: "Initial draft prepared by cybersecurity team.",
    updatedAt: "2024-03-20",
    description: "Framework for cooperation on cybersecurity threats and defense",
    type: "Security",
    updates: [
      {
        id: "9-1",
        text: "Initial draft prepared by cybersecurity team.",
        date: "2024-03-20",
        author: "David Chen",
      },
    ],
  },
  {
    id: "10",
    name: "Educational Exchange Program",
    country: "cn",
    status: "cancelled",
    latestUpdate: "Program cancelled due to budget constraints.",
    updatedAt: "2024-02-15",
    description: "Program for exchange of students and faculty between universities",
    startDate: "2024-09-01",
    endDate: "2026-09-01",
    type: "Education",
    updates: [
      {
        id: "10-2",
        text: "Program cancelled due to budget constraints.",
        date: "2024-02-15",
        author: "Sarah Johnson",
      },
      {
        id: "10-1",
        text: "Initial program framework developed with university partners.",
        date: "2024-01-10",
        author: "Sarah Johnson",
      },
    ],
  },
]

export default function AgreementsManager() {
  const [agreements, setAgreements] = useState<Agreement[]>(mockAgreements)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddingAgreement, setIsAddingAgreement] = useState(false)
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null)
  const [viewingAgreement, setViewingAgreement] = useState<Agreement | null>(null)

  // Add a new state for the new update being added
  const [newUpdate, setNewUpdate] = useState<string>("")

  // Filter agreements based on search query and filters
  const filteredAgreements = agreements.filter((agreement) => {
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        agreement.name.toLowerCase().includes(query) ||
        getCountryName(agreement.country).toLowerCase().includes(query) ||
        agreement.latestUpdate.toLowerCase().includes(query)

      if (!matchesSearch) return false
    }

    // Apply country filter
    if (countryFilter && countryFilter !== "all" && agreement.country !== countryFilter) {
      return false
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all" && agreement.status !== statusFilter) {
      return false
    }

    return true
  })

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  const renderCountryWithFlag = (code: string) => {
    return (
      <div className="flex items-center">
        <img
          src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
          alt={`${getCountryName(code)} flag`}
          className="h-4 w-6 mr-2 rounded-sm object-cover"
        />
        <span>{getCountryName(code)}</span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "planned":
        return <Badge className="bg-amber-500">Planned</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "expired":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Expired
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "planned":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <History className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const handleAddAgreement = () => {
    setIsAddingAgreement(true)
    setEditingAgreement({
      id: Date.now().toString(),
      name: "",
      country: "",
      status: "planned",
      latestUpdate: "",
      updatedAt: format(new Date(), "yyyy-MM-dd"),
      updates: [],
    })
  }

  const handleEditAgreement = (agreement: Agreement) => {
    setIsAddingAgreement(true)
    setEditingAgreement({ ...agreement })
  }

  // Update the handleSaveAgreement function to handle empty updates array
  const handleSaveAgreement = () => {
    if (editingAgreement) {
      // Ensure updates array exists
      if (!editingAgreement.updates) {
        editingAgreement.updates = []
      }

      const existingIndex = agreements.findIndex((a) => a.id === editingAgreement.id)

      if (existingIndex >= 0) {
        // Update existing agreement
        setAgreements(
          agreements.map((agreement) => (agreement.id === editingAgreement.id ? editingAgreement : agreement)),
        )
      } else {
        // Add new agreement
        setAgreements([...agreements, editingAgreement])
      }

      setIsAddingAgreement(false)
      setEditingAgreement(null)
    }
  }

  const handleDeleteAgreement = (id: string) => {
    setAgreements(agreements.filter((agreement) => agreement.id !== id))
    setViewingAgreement(null)
  }

  const handleViewAgreement = (agreement: Agreement) => {
    setViewingAgreement(agreement)
  }

  // Add a function to add a new update
  const handleAddUpdate = () => {
    if (viewingAgreement && newUpdate.trim()) {
      const today = format(new Date(), "yyyy-MM-dd")
      const newUpdateObj = {
        id: `${viewingAgreement.id}-${viewingAgreement.updates.length + 1}`,
        text: newUpdate,
        date: today,
        author: "Current User", // In a real app, this would be the logged-in user
      }

      // Add to updates array
      const updatedAgreement = {
        ...viewingAgreement,
        updates: [newUpdateObj, ...viewingAgreement.updates],
        latestUpdate: newUpdate,
        updatedAt: today,
      }

      // Update the agreements array
      setAgreements(
        agreements.map((agreement) => (agreement.id === viewingAgreement.id ? updatedAgreement : agreement)),
      )

      // Update the viewing agreement
      setViewingAgreement(updatedAgreement)

      // Clear the input
      setNewUpdate("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agreements..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {mockCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={country.name}
                          className="h-4 w-6 mr-2 rounded-sm object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddAgreement}>
              <Plus className="mr-2 h-4 w-4" /> Add Agreement
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Country</TableHead>
                  <TableHead className="min-w-[300px]">Agreement Name</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Start Date</TableHead>
                  <TableHead className="w-[120px]">End Date</TableHead>
                  <TableHead className="min-w-[300px]">Latest Update</TableHead>
                  <TableHead className="w-[120px]">Updated At</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements.length > 0 ? (
                  filteredAgreements.map((agreement) => (
                    <TableRow
                      key={agreement.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewAgreement(agreement)}
                    >
                      <TableCell>{renderCountryWithFlag(agreement.country)}</TableCell>
                      <TableCell className="font-medium">{agreement.name}</TableCell>
                      <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                      <TableCell>{agreement.startDate || "-"}</TableCell>
                      <TableCell>{agreement.endDate || "-"}</TableCell>
                      <TableCell>{agreement.latestUpdate}</TableCell>
                      <TableCell>{agreement.updatedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAgreement(agreement)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAgreement(agreement.id)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No agreements found</p>
                        <Button className="mt-4" onClick={handleAddAgreement}>
                          <Plus className="mr-2 h-4 w-4" /> Add Agreement
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Agreement Dialog */}
      <Dialog open={isAddingAgreement} onOpenChange={setIsAddingAgreement}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAgreement?.id ? "Edit Agreement" : "Add New Agreement"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agreement Name</Label>
              <Input
                id="name"
                value={editingAgreement?.name || ""}
                onChange={(e) =>
                  setEditingAgreement({
                    ...editingAgreement!,
                    name: e.target.value,
                  })
                }
                placeholder="Enter agreement name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={editingAgreement?.country || ""}
                onValueChange={(value) =>
                  setEditingAgreement({
                    ...editingAgreement!,
                    country: value,
                  })
                }
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={country.name}
                          className="h-4 w-6 mr-2 rounded-sm object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingAgreement?.status || "planned"}
                  onValueChange={(value: any) =>
                    setEditingAgreement({
                      ...editingAgreement!,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Agreement Type</Label>
                <Select
                  value={editingAgreement?.type || ""}
                  onValueChange={(value) =>
                    setEditingAgreement({
                      ...editingAgreement!,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trade">Trade</SelectItem>
                    <SelectItem value="Defense">Defense</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Science">Science & Technology</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Immigration">Immigration</SelectItem>
                    <SelectItem value="Taxation">Taxation</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editingAgreement?.startDate || ""}
                  onChange={(e) =>
                    setEditingAgreement({
                      ...editingAgreement!,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editingAgreement?.endDate || ""}
                  onChange={(e) =>
                    setEditingAgreement({
                      ...editingAgreement!,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingAgreement?.description || ""}
                onChange={(e) =>
                  setEditingAgreement({
                    ...editingAgreement!,
                    description: e.target.value,
                  })
                }
                placeholder="Enter agreement description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latestUpdate">Latest Update</Label>
              <Textarea
                id="latestUpdate"
                value={editingAgreement?.latestUpdate || ""}
                onChange={(e) => {
                  const today = format(new Date(), "yyyy-MM-dd")
                  const newUpdateText = e.target.value

                  // Create a new update object
                  const newUpdate = {
                    id: `${editingAgreement?.id}-${(editingAgreement?.updates?.length || 0) + 1}`,
                    text: newUpdateText,
                    date: today,
                    author: "Current User", // In a real app, this would be the logged-in user
                  }

                  // Prepare updates array (ensure it exists)
                  const updates = editingAgreement?.updates || []

                  // Only add a new update if we're editing an existing agreement and the text changed
                  const updatesArray =
                    editingAgreement?.id && newUpdateText !== editingAgreement?.latestUpdate
                      ? [newUpdate, ...updates]
                      : updates

                  setEditingAgreement({
                    ...editingAgreement!,
                    latestUpdate: newUpdateText,
                    updatedAt: today,
                    updates: updatesArray,
                  })
                }}
                placeholder="Enter latest update or comment"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingAgreement(false)
                setEditingAgreement(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAgreement}>Save Agreement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Agreement Dialog */}
      {viewingAgreement && (
        <Dialog open={!!viewingAgreement} onOpenChange={() => setViewingAgreement(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/${viewingAgreement.country.toLowerCase()}.svg`}
                  alt={`${getCountryName(viewingAgreement.country)} flag`}
                  className="h-5 w-8 rounded-sm object-cover"
                />
                Agreement Details
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h2 className="text-xl font-semibold">{viewingAgreement.name}</h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground">with</span>
                  <span className="ml-1 font-medium">{getCountryName(viewingAgreement.country)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(viewingAgreement.status)}
                {viewingAgreement.type && <Badge variant="outline">{viewingAgreement.type}</Badge>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="mt-1">{viewingAgreement.startDate || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="mt-1">{viewingAgreement.endDate || "Not specified"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="mt-1 p-2 bg-gray-50 rounded-md min-h-[60px]">
                  {viewingAgreement.description || "No description provided."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Updates</Label>
                </div>

                {/* Add new update form */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a new update or comment..."
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button className="self-end" onClick={handleAddUpdate} disabled={!newUpdate.trim()}>
                    Add
                  </Button>
                </div>

                {/* Updates history */}
                <div className="space-y-3 mt-4">
                  {viewingAgreement.updates && viewingAgreement.updates.length > 0 ? (
                    viewingAgreement.updates.map((update) => (
                      <div key={update.id} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{update.author || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">{update.date}</span>
                        </div>
                        <p>{update.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-2">No updates yet</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                <Button variant="destructive" onClick={() => handleDeleteAgreement(viewingAgreement.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setViewingAgreement(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleEditAgreement(viewingAgreement)
                    setViewingAgreement(null)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

