"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  User,
  ListTodo,
  LayoutGrid
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"
import { mockCountries } from "@/lib/mock-data"
import { mockActionItems, ActionItem } from "@/lib/mock-action-items"

// Define the column type for the Kanban board
interface Column {
  id: string
  title: string
  items: ActionItem[]
}

export default function ActionItemsClientPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("")
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [countryActionItems, setCountryActionItems] = useState<ActionItem[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentActionItem, setCurrentActionItem] = useState<ActionItem | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [columns, setColumns] = useState<Record<string, Column>>({})

  // Load existing data if available
  useEffect(() => {
    const reportData = localStorage.getItem("reportData")
    if (reportData) {
      const parsedData = JSON.parse(reportData)
      setSelectedCountry(parsedData.selectedCountry || "")
      
      // If we have action items in the report data, use those
      if (parsedData.actionItems && Array.isArray(parsedData.actionItems)) {
        setActionItems(parsedData.actionItems)
      } else {
        // Otherwise initialize from mock data based on country
        const country = parsedData.selectedCountry
        if (country) {
          const countryItems = mockActionItems.filter(item => item.country === country)
          setActionItems(countryItems)
        }
      }
    }
  }, [])

  // Filter action items for the selected country
  useEffect(() => {
    if (selectedCountry) {
      setCountryActionItems(actionItems.filter(item => item.country === selectedCountry))
    }
  }, [selectedCountry, actionItems])
  
  // Set up columns for the Kanban board
  useEffect(() => {
    if (!countryActionItems.length) return;
    
    const notStartedItems = countryActionItems.filter(item => item.status === "not_started");
    const inProgressItems = countryActionItems.filter(item => item.status === "in_progress");
    const doneItems = countryActionItems.filter(item => item.status === "done");
    
    setColumns({
      not_started: {
        id: "not_started",
        title: "Not Started",
        items: notStartedItems
      },
      in_progress: {
        id: "in_progress",
        title: "In Progress",
        items: inProgressItems
      },
      done: {
        id: "done",
        title: "Done",
        items: doneItems
      }
    });
  }, [countryActionItems]);

  const handleNext = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      actionItems,
      step: "talking-points",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to next step
    router.push("/dashboard/reports/create/talking-points")
  }

  const handlePrevious = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      actionItems,
      step: "agreements",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to previous step
    router.push("/dashboard/reports/create/agreements")
  }
  
  // Handle item drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dropped in a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update the status of the item to match the destination column
      const updatedItem = { 
        ...removed, 
        status: destination.droppableId as "not_started" | "in_progress" | "done" 
      };
      
      destItems.splice(destination.index, 0, updatedItem);
      
      // Update action items with the new status
      const newActionItems = actionItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      
      setActionItems(newActionItems);
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
      });
    } else {
      // If reordering within the same column
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  const handleEditActionItem = (item: ActionItem) => {
    setCurrentActionItem({...item})
    setIsEditDialogOpen(true)
  }

  const handleCreateActionItem = () => {
    // Create a new action item template
    setCurrentActionItem({
      id: `new-${Date.now()}`,
      country: selectedCountry,
      profileId: "",
      date: new Date().toISOString().split('T')[0],
      source: "",
      theme: "",
      industry: "",
      actionItem: "",
      updates: "",
      entities: "",
      entitiesOther: "",
      status: "not_started",
      owner: "",
      dueDate: ""
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveActionItem = () => {
    if (!currentActionItem) return;
    
    // If it's a new item, add it to the list
    if (currentActionItem.id.startsWith('new-')) {
      setActionItems([...actionItems, {...currentActionItem}])
    } else {
      // Otherwise update the existing item
      setActionItems(actionItems.map(item => 
        item.id === currentActionItem.id ? {...currentActionItem} : item
      ))
    }
    
    setIsEditDialogOpen(false)
  }

  const handleDeleteActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: "not_started" | "in_progress" | "done") => {
    setActionItems(actionItems.map(item => 
      item.id === id ? {...item, status: newStatus} : item
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not_started": return <Circle className="h-4 w-4 text-gray-500" />
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />
      case "done": return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Not Started</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "done":
        return <Badge className="bg-green-500">Done</Badge>
      default:
        return null
    }
  }

  const notStartedItems = countryActionItems.filter(item => item.status === "not_started")
  const inProgressItems = countryActionItems.filter(item => item.status === "in_progress")
  const doneItems = countryActionItems.filter(item => item.status === "done")

  const renderActionItemCard = (item: ActionItem) => (
    <Card key={item.id} className="mb-3">
      <CardContent className="pt-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium line-clamp-2">{item.actionItem}</h4>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleEditActionItem(item)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteActionItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {item.updates && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.updates}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {item.theme && (
            <Badge variant="secondary" className="text-xs">{item.theme}</Badge>
          )}
          {item.industry && (
            <Badge variant="outline" className="text-xs">{item.industry}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span className="truncate max-w-[100px]">{item.owner}</span>
        </div>
        {item.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{item.dueDate}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="action-items" />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Action Items for {selectedCountry ? getCountryName(selectedCountry) : ""}
        </h2>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "list")}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={handleCreateActionItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      {!selectedCountry ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Please select a country first in the Report Info tab.</p>
          </CardContent>
        </Card>
      ) : countryActionItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500 py-12">
            <p>No action items found for {getCountryName(selectedCountry)}.</p>
            <Button className="mt-4" onClick={handleCreateActionItem}>
              <Plus className="h-4 w-4 mr-2" /> Create Action Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === "kanban" ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Not Started Column */}
                <div>
                  <div className="bg-background border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Circle className="h-5 w-5 text-gray-500" />
                        <h3 className="font-medium">Not Started</h3>
                      </div>
                      <Badge variant="outline" className="text-gray-500">{notStartedItems.length}</Badge>
                    </div>
                    <Droppable droppableId="not_started">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[100px]"
                        >
                          <ScrollArea className="h-[calc(100vh-340px)]">
                            {notStartedItems.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {renderActionItemCard(item)}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Button 
                              variant="ghost" 
                              className="w-full border border-dashed mt-2 text-muted-foreground"
                              onClick={handleCreateActionItem}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>

                {/* In Progress Column */}
                <div>
                  <div className="bg-background border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">In Progress</h3>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">{inProgressItems.length}</Badge>
                    </div>
                    <Droppable droppableId="in_progress">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[100px]"
                        >
                          <ScrollArea className="h-[calc(100vh-340px)]">
                            {inProgressItems.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {renderActionItemCard(item)}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>

                {/* Done Column */}
                <div>
                  <div className="bg-background border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Done</h3>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">{doneItems.length}</Badge>
                    </div>
                    <Droppable droppableId="done">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[100px]"
                        >
                          <ScrollArea className="h-[calc(100vh-340px)]">
                            {doneItems.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {renderActionItemCard(item)}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            </DragDropContext>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {countryActionItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="cursor-pointer" 
                                onClick={() => {
                                  const nextStatus = item.status === "not_started" 
                                    ? "in_progress" 
                                    : item.status === "in_progress" 
                                      ? "done" 
                                      : "not_started";
                                  handleStatusChange(item.id, nextStatus);
                                }}
                              >
                                {getStatusIcon(item.status)}
                              </div>
                              <h4 className="font-medium">{item.actionItem}</h4>
                            </div>
                            {item.updates && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6 mt-1">{item.updates}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status)}
                            <Button variant="ghost" size="sm" onClick={() => handleEditActionItem(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteActionItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 ml-6">
                          {item.theme && (
                            <Badge variant="secondary" className="text-xs">{item.theme}</Badge>
                          )}
                          {item.industry && (
                            <Badge variant="outline" className="text-xs">{item.industry}</Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground ml-6">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.owner}</span>
                          </div>
                          {item.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{item.dueDate}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Edit/Create Action Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>
              {currentActionItem?.id.startsWith('new-') ? 'Add New Action Item' : 'Edit Action Item'}
            </DialogTitle>
          </DialogHeader>
          
          {currentActionItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="actionItem">Action Item</Label>
                <Textarea
                  id="actionItem"
                  value={currentActionItem.actionItem}
                  onChange={(e) => setCurrentActionItem({ 
                    ...currentActionItem, 
                    actionItem: e.target.value 
                  })}
                  placeholder="What needs to be done?"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={currentActionItem.status}
                    onValueChange={(value: "not_started" | "in_progress" | "done") => 
                      setCurrentActionItem({...currentActionItem, status: value})
                    }
                  >
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
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={currentActionItem.dueDate}
                    onChange={(e) => setCurrentActionItem({
                      ...currentActionItem,
                      dueDate: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={currentActionItem.theme}
                    onValueChange={(value) => 
                      setCurrentActionItem({...currentActionItem, theme: value})
                    }
                  >
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
                  <Select 
                    value={currentActionItem.industry}
                    onValueChange={(value) => 
                      setCurrentActionItem({...currentActionItem, industry: value})
                    }
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Tourism">Tourism</SelectItem>
                      <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={currentActionItem.owner}
                  onChange={(e) => setCurrentActionItem({
                    ...currentActionItem,
                    owner: e.target.value
                  })}
                  placeholder="Who is responsible for this action item?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="updates">Latest Update</Label>
                <Textarea
                  id="updates"
                  value={currentActionItem.updates}
                  onChange={(e) => setCurrentActionItem({
                    ...currentActionItem,
                    updates: e.target.value
                  })}
                  placeholder="Provide the latest status update"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entities">Our Entities</Label>
                  <Input
                    id="entities"
                    value={currentActionItem.entities}
                    onChange={(e) => setCurrentActionItem({
                      ...currentActionItem,
                      entities: e.target.value
                    })}
                    placeholder="Our participating entities"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entitiesOther">Their Entities</Label>
                  <Input
                    id="entitiesOther"
                    value={currentActionItem.entitiesOther}
                    onChange={(e) => setCurrentActionItem({
                      ...currentActionItem,
                      entitiesOther: e.target.value
                    })}
                    placeholder="Their participating entities"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveActionItem} disabled={!currentActionItem?.actionItem}>
              Save Action Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

