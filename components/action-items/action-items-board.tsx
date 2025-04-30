"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  CheckSquare,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  Edit,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react"
import { mockCountries } from "@/lib/mock-data"
import { mockProfiles } from "@/lib/mock-data"
import { mockActionItems, ActionItem } from "@/lib/mock-action-items"

// Define the column type for the Kanban board
interface Column {
  id: string
  title: string
  items: ActionItem[]
}

export default function ActionItemsBoard() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [themeFilter, setThemeFilter] = useState<string>("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null)
  const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems)
  const [columns, setColumns] = useState<Record<string, Column>>({})

  // Add a new state to track the currently viewed action item
  const [viewingItem, setViewingItem] = useState<ActionItem | null>(null)

  const filterActionItems = useCallback(
    (items: ActionItem[]) => {
      return items.filter((item) => {
        // Apply search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesSearch =
            item.actionItem.toLowerCase().includes(query) ||
            item.country.toLowerCase().includes(query) ||
            item.owner.toLowerCase().includes(query) ||
            item.theme.toLowerCase().includes(query)

          if (!matchesSearch) return false
        }

        // Apply country filter
        if (countryFilter && countryFilter !== "all" && item.country !== countryFilter) {
          return false
        }

        // Apply theme filter
        if (themeFilter && themeFilter !== "all" && item.theme !== themeFilter) {
          return false
        }

        return true
      })
    },
    [searchQuery, countryFilter, themeFilter],
  )

  // Initialize columns for Kanban board
  useEffect(() => {
    const filteredItems = filterActionItems(actionItems)

    const initialColumns: Record<string, Column> = {
      not_started: {
        id: "not_started",
        title: "Not Started",
        items: filteredItems.filter((item) => item.status === "not_started"),
      },
      in_progress: {
        id: "in_progress",
        title: "In Progress",
        items: filteredItems.filter((item) => item.status === "in_progress"),
      },
      done: {
        id: "done",
        title: "Done",
        items: filteredItems.filter((item) => item.status === "done"),
      },
    }

    setColumns(initialColumns)
  }, [actionItems, filterActionItems])

  // Filter action items based on search query and filters

  // Fix the getCountryName function to return just the name when needed
  // Create a separate function for rendering country with flag
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

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // If dropped in the same column but different position
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
    // If dropped in a different column
    else {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)

      // Update the status of the item
      const updatedItem = {
        ...removed,
        status: destination.droppableId as "not_started" | "in_progress" | "done",
      }

      destItems.splice(destination.index, 0, updatedItem)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })

      // Update the action items array with the new status
      setActionItems(actionItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }
  }

  // Handle adding a new action item
  const handleAddItem = (newItem: Omit<ActionItem, "id">) => {
    const id = Date.now().toString()
    const item: ActionItem = {
      id,
      ...newItem,
    }

    setActionItems([...actionItems, item])
    setIsAddingItem(false)
  }

  // Handle editing an action item
  const handleEditItem = (updatedItem: ActionItem) => {
    setActionItems(actionItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  // Handle deleting an action item
  const handleDeleteItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id))
  }

  // Add this function to handle viewing an action item
  const handleViewItem = (item: ActionItem) => {
    setViewingItem(item)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return (
          <Badge variant="outline" className="bg-gray-100 flex justify-center items-center">
            Not Started
          </Badge>
        )
      case "in_progress":
        return <Badge className="bg-blue-500 flex justify-center items-center">In Progress</Badge>
      case "done":
        return <Badge className="bg-green-500 flex justify-center items-center">Done</Badge>
      default:
        return null
    }
  }

  // Get theme badge
  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case "Trade":
        return <Badge className="bg-blue-500 flex justify-center items-center">{theme}</Badge>
      case "Investment":
        return <Badge className="bg-green-500 flex justify-center items-center">{theme}</Badge>
      case "Human Capital":
        return <Badge className="bg-purple-500 flex justify-center items-center">{theme}</Badge>
      case "Knowledge Sharing":
        return <Badge className="bg-amber-500 flex justify-center items-center">{theme}</Badge>
      default:
        return <Badge className="bg-gray-500 flex justify-center items-center">{theme}</Badge>
    }
  }

  // Render Kanban board view
  const renderKanbanView = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {column.id === "not_started" && <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />}
                  {column.id === "in_progress" && <Clock className="mr-2 h-5 w-5 text-blue-500" />}
                  {column.id === "done" && <CheckSquare className="mr-2 h-5 w-5 text-green-500" />}
                  {column.title}
                </h3>
                <Badge>{column.items.length}</Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 bg-gray-50 rounded-md p-2 min-h-[500px] overflow-y-auto"
                  >
                    {column.items.length > 0 ? (
                      column.items.map((item, index) => {
                        const profile = getProfileInfo(item.profileId)
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Card
                                key={item.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3 cursor-grab active:cursor-grabbing"
                                onClick={(e) => {
                                  // Prevent triggering when clicking on dropdown menu or links
                                  if (
                                    !(e.target as HTMLElement).closest("[data-radix-popper-content-wrapper]") &&
                                    !(e.target as HTMLElement).closest("a")
                                  ) {
                                    handleViewItem(item)
                                  }
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <Link
                                      href={`/dashboard/action-items/country/${item.country}`}
                                      className="flex items-center hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <img
                                        src={`https://flagcdn.com/${item.country.toLowerCase()}.svg`}
                                        alt={`${getCountryName(item.country)} flag`}
                                        className="h-4 w-6 mr-1 rounded-sm object-cover"
                                      />
                                      <span className="text-sm font-medium">{getCountryName(item.country)}</span>
                                    </Link>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setEditingItem(item)}>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => handleDeleteItem(item.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <div className="mb-2">
                                    <p className="font-medium">{item.actionItem}</p>
                                  </div>

                                  <div className="flex items-center mb-2">
                                    <Link
                                      href={`/dashboard/countries?profile=${profile.id}`}
                                      className="flex items-center hover:underline text-blue-600 dark:text-blue-400 text-sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {profile.imageUrl ? (
                                        <img
                                          src={profile.imageUrl || "/placeholder.svg"}
                                          alt={profile.fullName}
                                          className="h-5 w-5 rounded-full mr-1 object-cover"
                                        />
                                      ) : (
                                        <User className="h-3 w-3 mr-1" />
                                      )}
                                      {profile.fullName}
                                    </Link>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {getThemeBadge(item.theme)}
                                    <Badge variant="outline" className="bg-gray-100">
                                      <Briefcase className="mr-1 h-3 w-3" />
                                      {item.industry}
                                    </Badge>
                                  </div>

                                  <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <User className="h-3 w-3 mr-1" />
                                      {item.owner}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {item.dueDate}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        )
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <p className="text-sm">No items</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    )
  }

  // Add a function to get profile information
  const getProfileInfo = (profileId: string) => {
    const profile = mockProfiles.find((p) => p.id === profileId)
    return profile || { id: "", fullName: "Unknown Profile", position: "", country: "", type: "ambassador" }
  }

  // Render table view
  const renderTableView = () => {
    const filteredItems = filterActionItems(actionItems)

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Country</TableHead>
                  <TableHead className="w-[180px]">Profile</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead className="w-[120px]">Theme</TableHead>
                  <TableHead className="w-[150px]">Industry</TableHead>
                  <TableHead className="min-w-[300px]">Action Item</TableHead>
                  <TableHead className="min-w-[200px]">Updates</TableHead>
                  <TableHead className="w-[150px]">Entities</TableHead>
                  <TableHead className="w-[150px]">Entities (Other)</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Owner</TableHead>
                  <TableHead className="w-[120px]">Due Date</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const profile = getProfileInfo(item.profileId)
                    return (
                      <TableRow
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleViewItem(item)}
                      >
                        <TableCell>
                          <Link
                            href={`/dashboard/action-items/country/${item.country}`}
                            className="flex items-center hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={`https://flagcdn.com/${item.country.toLowerCase()}.svg`}
                              alt={`${getCountryName(item.country)} flag`}
                              className="h-4 w-6 mr-2 rounded-sm object-cover"
                            />
                            <span>{getCountryName(item.country)}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/dashboard/countries?profile=${profile.id}`}
                            className="flex items-center hover:underline text-blue-600 dark:text-blue-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {profile.imageUrl ? (
                              <img
                                src={profile.imageUrl || "/placeholder.svg"}
                                alt={profile.fullName}
                                className="h-6 w-6 rounded-full mr-2 object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 mr-2" />
                            )}
                            {profile.fullName}
                          </Link>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>{getThemeBadge(item.theme)}</TableCell>
                        <TableCell>{item.industry}</TableCell>
                        <TableCell className="font-medium">{item.actionItem}</TableCell>
                        <TableCell>{item.updates || "-"}</TableCell>
                        <TableCell>{item.entities}</TableCell>
                        <TableCell>{item.entitiesOther || "-"}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.owner}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center h-24">
                      No action items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Action Item Form component
  const ActionItemForm = ({
    onSubmit,
    initialData = {
      country: "",
      profileId: "",
      date: new Date().toISOString().split("T")[0],
      source: "",
      theme: "",
      industry: "",
      actionItem: "",
      updates: "",
      entities: "",
      entitiesOther: "",
      status: "not_started" as const,
      owner: "",
      dueDate: "",
    },
    isEdit = false,
  }: {
    onSubmit: (data: any) => void
    initialData?: Partial<ActionItem>
    isEdit?: boolean
  }) => {
    const [formData, setFormData] = useState(initialData)
    const [availableProfiles, setAvailableProfiles] = useState<typeof mockProfiles>([])

    const updateProfiles = useCallback(() => {
      if (formData.country) {
        const countryProfiles = mockProfiles.filter((profile) => profile.country === formData.country)
        setAvailableProfiles(countryProfiles)

        // If the current profileId doesn't belong to this country, reset it
        if (formData.profileId && !countryProfiles.some((p) => p.id === formData.profileId)) {
          setFormData({
            ...formData,
            profileId: "",
          })
        }
      } else {
        setAvailableProfiles([])
      }
    }, [formData.country, formData.profileId])

    useEffect(() => {
      updateProfiles()
    }, [updateProfiles])

    const handleChange = (field: string, value: string) => {
      setFormData({
        ...formData,
        [field]: value,
      })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(value) => handleChange("country", value)} required>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {mockCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code || "none"}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">Profile</Label>
            <Select
              value={formData.profileId}
              onValueChange={(value) => handleChange("profileId", value)}
              disabled={!formData.country || availableProfiles.length === 0}
              required
            >
              <SelectTrigger id="profile">
                <SelectValue placeholder={!formData.country ? "Select a country first" : "Select a profile"} />
              </SelectTrigger>
              <SelectContent>
                {availableProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center">
                      {profile.imageUrl ? (
                        <img
                          src={profile.imageUrl || "/placeholder.svg"}
                          alt={profile.fullName}
                          className="h-6 w-6 rounded-full mr-2 object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      {profile.fullName} - {profile.position}
                    </div>
                  </SelectItem>
                ))}
                {availableProfiles.length === 0 && formData.country && (
                  <SelectItem value="none" disabled>
                    No profiles available for this country
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
              placeholder="e.g., Bilateral Meeting, Conference"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={formData.theme} onValueChange={(value) => handleChange("theme", value)} required>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trade">Trade</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Human Capital">Human Capital</SelectItem>
                <SelectItem value="Knowledge Sharing">Knowledge Sharing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              placeholder="e.g., Technology, Manufacturing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value as any)} required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => handleChange("owner", e.target.value)}
              placeholder="Person responsible for this action"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionItem">Action Item</Label>
          <Textarea
            id="actionItem"
            value={formData.actionItem}
            onChange={(e) => handleChange("actionItem", e.target.value)}
            placeholder="Describe the action item"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="updates">Updates</Label>
          <Textarea
            id="updates"
            value={formData.updates}
            onChange={(e) => handleChange("updates", e.target.value)}
            placeholder="Any updates on progress (optional)"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entities">Entities</Label>
            <Input
              id="entities"
              value={formData.entities}
              onChange={(e) => handleChange("entities", e.target.value)}
              placeholder="Local entities involved"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entitiesOther">Entities (Other)</Label>
            <Input
              id="entitiesOther"
              value={formData.entitiesOther}
              onChange={(e) => handleChange("entitiesOther", e.target.value)}
              placeholder="Foreign entities involved (optional)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">{isEdit ? "Update" : "Add"} Action Item</Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search action items..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {mockCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code || "none"}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={themeFilter} onValueChange={setThemeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  <SelectItem value="Trade">Trade</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Human Capital">Human Capital</SelectItem>
                  <SelectItem value="Knowledge Sharing">Knowledge Sharing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="border rounded-md p-1">
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                  className="px-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="px-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={() => setIsAddingItem(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Action Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "kanban" ? renderKanbanView() : renderTableView()}

      {/* Add Action Item Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Action Item</DialogTitle>
          </DialogHeader>
          <ActionItemForm onSubmit={handleAddItem} />
        </DialogContent>
      </Dialog>

      {/* Edit Action Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Action Item</DialogTitle>
            </DialogHeader>
            <ActionItemForm onSubmit={handleEditItem} initialData={editingItem} isEdit={true} />
          </DialogContent>
        </Dialog>
      )}

      {/* View/Edit Action Item Dialog */}
      {viewingItem && (
        <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <img
                  src={`https://flagcdn.com/${viewingItem.country.toLowerCase()}.svg`}
                  alt={`${getCountryName(viewingItem.country)} flag`}
                  className="h-5 w-8 mr-2 rounded-sm object-cover"
                />
                Action Item Details
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{viewingItem.actionItem}</h3>
                {getStatusBadge(viewingItem.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <div className="flex items-center mt-1">
                    <img
                      src={`https://flagcdn.com/${viewingItem.country.toLowerCase()}.svg`}
                      alt={`${getCountryName(viewingItem.country)} flag`}
                      className="h-4 w-6 mr-2 rounded-sm object-cover"
                    />
                    <span>{getCountryName(viewingItem.country)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Profile</Label>
                  <div className="mt-1">
                    {(() => {
                      const profile = getProfileInfo(viewingItem.profileId)
                      return (
                        <Link
                          href={`/dashboard/countries?profile=${profile.id}`}
                          className="flex items-center hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {profile.imageUrl ? (
                            <img
                              src={profile.imageUrl || "/placeholder.svg"}
                              alt={profile.fullName}
                              className="h-6 w-6 rounded-full mr-2 object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 mr-2" />
                          )}
                          {profile.fullName}
                          <span className="ml-2 text-sm text-gray-500">({profile.position})</span>
                        </Link>
                      )
                    })()}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <div className="mt-1">{getThemeBadge(viewingItem.theme)}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="mt-1">{viewingItem.industry}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <p className="mt-1">{viewingItem.source}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="mt-1">{viewingItem.date}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Owner</Label>
                  <p className="mt-1">{viewingItem.owner}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="mt-1">{viewingItem.dueDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Updates</Label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[60px]">
                  {viewingItem.updates || "No updates provided yet."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Entities</Label>
                  <p className="mt-1">{viewingItem.entities}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Entities (Other)</Label>
                  <p className="mt-1">{viewingItem.entitiesOther || "N/A"}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                <Button variant="destructive" onClick={() => handleDeleteItem(viewingItem.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setViewingItem(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditingItem(viewingItem)
                    setViewingItem(null)
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

