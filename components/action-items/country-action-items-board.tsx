"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react"
import { mockCountries, mockProfiles } from "@/lib/mock-data"
import { mockActionItems, ActionItem } from "@/lib/mock-action-items"

// Define the column type for the Kanban board
interface Column {
  id: string
  title: string
  items: ActionItem[]
}

interface CountryActionItemsBoardProps {
  countryCode: string
}

export default function CountryActionItemsBoard({ countryCode }: CountryActionItemsBoardProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")
  const [searchQuery, setSearchQuery] = useState("")
  const [themeFilter, setThemeFilter] = useState<string>("all")
  const [columns, setColumns] = useState<Record<string, Column>>({})
  const [actionItems, setActionItems] = useState<ActionItem[]>([])

  // Filter action items for this country
  useEffect(() => {
    const countryItems = mockActionItems.filter((item) => item.country === countryCode)
    setActionItems(countryItems)
  }, [countryCode])

  // Set up columns for the Kanban board
  useEffect(() => {
    const filteredItems = actionItems.filter((item) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          item.actionItem.toLowerCase().includes(query) ||
          item.owner.toLowerCase().includes(query) ||
          item.theme.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      if (themeFilter !== "all" && item.theme !== themeFilter) {
        return false
      }

      return true
    })

    const newColumns: Record<string, Column> = {
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
        title: "Completed",
        items: filteredItems.filter((item) => item.status === "done"),
      },
    }

    setColumns(newColumns)
  }, [actionItems, searchQuery, themeFilter])

  // Handle item drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // If dropped in a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)

      // Update the status of the item to match the destination column
      const updatedItem = { ...removed, status: destination.droppableId as "not_started" | "in_progress" | "done" }
      destItems.splice(destination.index, 0, updatedItem)

      // Update action items with the new status
      const updatedActionItems = actionItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )

      setActionItems(updatedActionItems)
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
    } else {
      // If reordering within the same column
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
  }

  // Get status badge for display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Not Started</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "done":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return null
    }
  }

  // Get theme badge for display
  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case "Trade":
        return <Badge className="bg-blue-500">{theme}</Badge>
      case "Investment":
        return <Badge className="bg-green-500">{theme}</Badge>
      case "Human Capital":
        return <Badge className="bg-purple-500">{theme}</Badge>
      case "Knowledge Sharing":
        return <Badge className="bg-amber-500">{theme}</Badge>
      default:
        return <Badge className="bg-gray-500">{theme}</Badge>
    }
  }

  // Get profile information from profile ID
  const getProfileInfo = (profileId: string) => {
    const profile = mockProfiles.find((p) => p.id === profileId)
    return profile || null
  }

  // Render the Kanban board view
  const renderKanbanView = () => {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(columns).map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="outline">{column.items.length}</Badge>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[200px]"
                  >
                    {column.items.map((item, index) => {
                      const profile = getProfileInfo(item.profileId)
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="hover:shadow-md transition-shadow"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-sm">
                                      {item.actionItem}
                                    </h4>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Due: {item.dueDate}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {getThemeBadge(item.theme)}
                                  <Badge variant="outline">{item.industry}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs flex items-center">
                                    {profile?.imageUrl ? (
                                      <img
                                        src={profile.imageUrl}
                                        alt={profile.fullName}
                                        className="w-6 h-6 rounded-full mr-1"
                                      />
                                    ) : (
                                      <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-1">
                                        {profile?.fullName?.charAt(0)}
                                      </span>
                                    )}
                                    <span className="text-muted-foreground truncate">{item.owner}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                                    <Link href={`/dashboard/action-items/${item.id}`}>
                                      <Edit className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    )
  }

  // Render the table view
  const renderTableView = () => {
    return (
      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action Item</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionItems
                .filter((item) => {
                  if (searchQuery) {
                    const query = searchQuery.toLowerCase()
                    const matchesSearch =
                      item.actionItem.toLowerCase().includes(query) ||
                      item.owner.toLowerCase().includes(query) ||
                      item.theme.toLowerCase().includes(query)
                    if (!matchesSearch) return false
                  }
                  if (themeFilter !== "all" && item.theme !== themeFilter) {
                    return false
                  }
                  return true
                })
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.actionItem}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getThemeBadge(item.theme)}</TableCell>
                    <TableCell>{item.owner}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                          <Link href={`/dashboard/action-items/${item.id}`}>
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => {}}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="flex space-x-2 items-center">
          <Input
            placeholder="Search action items..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={themeFilter} onValueChange={setThemeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by theme" />
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

        <div className="flex space-x-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "table")}>
            <TabsList>
              <TabsTrigger value="kanban">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="h-4 w-4 mr-2" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button asChild>
            <Link href={`/dashboard/action-items/new?country=${countryCode}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Action Item
            </Link>
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? renderKanbanView() : renderTableView()}
    </div>
  )
} 