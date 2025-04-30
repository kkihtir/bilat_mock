"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Search,
  Plus,
  MoreVertical,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  FileText,
  Layers,
  History,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

// Define different status types for automatic and manual sources
type AutomaticStatus = "synced" | "syncing" | "failed" | "pending"
type ManualStatus = "uploaded" | "uploading" | "not_uploaded" | "failed"
type GroupingMode = "source" | "type"

interface VersionHistory {
  version: string
  date: string
  status: string
  changes: string
}

interface DataSource {
  id: string
  type: "automatic" | "manual"
  name: string
  source: string
  version: string
  lastUpdated: string
  status: AutomaticStatus | ManualStatus
  versionHistory?: VersionHistory[]
}

export default function DataSourcesManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingSource, setIsAddingSource] = useState(false)
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(null)
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("source")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)

  // Mock version history data
  const mockVersionHistory: Record<string, VersionHistory[]> = {
    "1": [
      { version: "2024 Q1", date: "2024-03-01", status: "synced", changes: "Updated with latest IMF data" },
      { version: "2023 Q4", date: "2023-12-15", status: "synced", changes: "Quarterly update" },
      { version: "2023 Q3", date: "2023-09-10", status: "synced", changes: "Fixed calculation methodology" },
      { version: "2023 Q2", date: "2023-06-05", status: "synced", changes: "Initial data import" },
    ],
    "8": [
      { version: "2023 Annual", date: "2024-02-15", status: "synced", changes: "Updated with latest World Bank data" },
      { version: "2022 Annual", date: "2023-02-20", status: "synced", changes: "Annual update" },
      { version: "2021 Annual", date: "2022-03-10", status: "synced", changes: "Initial data import" },
    ],
    "12": [
      { version: "2023", date: "2024-01-20", status: "uploaded", changes: "Updated with latest CPI data" },
      { version: "2022", date: "2023-01-25", status: "uploaded", changes: "Annual update" },
      { version: "2021", date: "2022-01-15", status: "uploaded", changes: "Initial data import" },
    ],
    "18": [
      { version: "2023 Q4", date: "2024-01-30", status: "uploaded", changes: "Updated with latest GASTAT data" },
      { version: "2023 Q3", date: "2023-10-20", status: "uploaded", changes: "Quarterly update" },
      { version: "2023 Q2", date: "2023-07-15", status: "uploaded", changes: "Quarterly update" },
      { version: "2023 Q1", date: "2023-04-10", status: "uploaded", changes: "Initial data import" },
    ],
  }

  // Mock data for data sources
  const [dataSources, setDataSources] = useState<DataSource[]>([
    // IMF Data Sources (Automatic)
    {
      id: "1",
      type: "automatic",
      name: "GDP (nominal, growth, per capita)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
      versionHistory: mockVersionHistory["1"],
    },
    {
      id: "2",
      type: "automatic",
      name: "Import Partners (Global)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },
    {
      id: "3",
      type: "automatic",
      name: "Export Partners (Global)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },
    {
      id: "4",
      type: "automatic",
      name: "Export Partners (World)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },
    {
      id: "5",
      type: "automatic",
      name: "Import Partners (World)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },
    {
      id: "6",
      type: "automatic",
      name: "Government Debt (% of GDP)",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },
    {
      id: "7",
      type: "automatic",
      name: "Balance of Trade",
      source: "IMF",
      version: "2024 Q1",
      lastUpdated: "2024-03-01",
      status: "synced",
    },

    // World Bank Data Sources (Automatic)
    {
      id: "8",
      type: "automatic",
      name: "Foreign Direct Investment (% of GDP)",
      source: "World Bank",
      version: "2023 Annual",
      lastUpdated: "2024-02-15",
      status: "synced",
      versionHistory: mockVersionHistory["8"],
    },
    {
      id: "9",
      type: "automatic",
      name: "Foreign Direct Investment",
      source: "World Bank",
      version: "2023 Annual",
      lastUpdated: "2024-02-15",
      status: "synced",
    },
    {
      id: "10",
      type: "automatic",
      name: "Population",
      source: "World Bank",
      version: "2023 Annual",
      lastUpdated: "2024-02-15",
      status: "synced",
    },

    // World Bank Manual Data Sources
    {
      id: "11",
      type: "manual",
      name: "Ease of Doing Business",
      source: "World Bank",
      version: "2023",
      lastUpdated: "2024-01-15",
      status: "uploaded",
    },

    // Transparency International Data Sources
    {
      id: "12",
      type: "manual",
      name: "Corruption Perception Index (Score)",
      source: "Transparency International",
      version: "2023",
      lastUpdated: "2024-01-20",
      status: "uploaded",
      versionHistory: mockVersionHistory["12"],
    },
    {
      id: "13",
      type: "manual",
      name: "Corruption Perception Index (Rank)",
      source: "Transparency International",
      version: "2023",
      lastUpdated: "2024-01-20",
      status: "uploaded",
    },

    // WEF Data Sources
    {
      id: "14",
      type: "manual",
      name: "Global Competitiveness Index (Score)",
      source: "WEF",
      version: "2023",
      lastUpdated: "2024-02-10",
      status: "uploaded",
    },
    {
      id: "15",
      type: "manual",
      name: "Global Competitiveness Index (Rank)",
      source: "WEF",
      version: "2023",
      lastUpdated: "2024-02-10",
      status: "uploaded",
    },

    // UN Comtrade Data Sources
    {
      id: "16",
      type: "manual",
      name: "Export Structure (USD K)",
      source: "UN Comtrade",
      version: "2023",
      lastUpdated: "2024-02-05",
      status: "uploaded",
    },
    {
      id: "17",
      type: "manual",
      name: "Import Structure (USD K)",
      source: "UN Comtrade",
      version: "2023",
      lastUpdated: "2024-02-05",
      status: "uploaded",
    },

    // GASTAT Data Sources
    {
      id: "18",
      type: "manual",
      name: "KSA Exported Products",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "uploaded",
      versionHistory: mockVersionHistory["18"],
    },
    {
      id: "19",
      type: "manual",
      name: "KSA Imported Products",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "uploaded",
    },
    {
      id: "20",
      type: "manual",
      name: "KSA Balance of Trade",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "uploaded",
    },
    {
      id: "21",
      type: "manual",
      name: "KSA Total Exports",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "uploaded",
    },
    {
      id: "22",
      type: "manual",
      name: "KSA Total Imports",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "uploaded",
    },
    {
      id: "23",
      type: "manual",
      name: "KSA Volume of Trade",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "not_uploaded",
    },
    {
      id: "24",
      type: "manual",
      name: "KSA Export Rank",
      source: "GASTAT",
      version: "2023 Q4",
      lastUpdated: "2024-01-30",
      status: "not_uploaded",
    },
  ])

  const filteredSources = dataSources.filter((source) => {
    if (searchQuery === "") return true

    const query = searchQuery.toLowerCase()
    return source.name.toLowerCase().includes(query) || source.source.toLowerCase().includes(query)
  })

  const handleSync = (sourceId: string) => {
    setProcessingSourceId(sourceId)

    // Update status to syncing
    setDataSources((prev) => prev.map((source) => (source.id === sourceId ? { ...source, status: "syncing" } : source)))

    // Simulate sync process
    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((source) =>
          source.id === sourceId
            ? {
                ...source,
                status: "synced",
                lastUpdated: new Date().toISOString().split("T")[0],
                version: source.source === "IMF" ? "2024 Q1" : "2023 Annual",
              }
            : source,
        ),
      )
      setProcessingSourceId(null)
    }, 3000)
  }

  const getStatusBadge = (source: DataSource) => {
    if (source.type === "automatic") {
      switch (source.status) {
        case "synced":
          return <Badge className="bg-green-500">Synced</Badge>
        case "syncing":
          return <Badge className="bg-blue-500">Syncing...</Badge>
        case "failed":
          return <Badge className="bg-red-500">Failed</Badge>
        case "pending":
          return <Badge className="bg-yellow-500">Pending</Badge>
        default:
          return null
      }
    } else {
      // Manual sources
      switch (source.status) {
        case "uploaded":
          return <Badge className="bg-green-500">Uploaded</Badge>
        case "uploading":
          return <Badge className="bg-blue-500">Uploading...</Badge>
        case "not_uploaded":
          return (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              Not Uploaded
            </Badge>
          )
        case "failed":
          return <Badge className="bg-red-500">Failed</Badge>
        default:
          return null
      }
    }
  }

  const getVersionHistoryStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getFileAction = (source: DataSource) => {
    if (source.type === "automatic") {
      if (source.status === "syncing") {
        return (
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Syncing...</span>
          </div>
        )
      }
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSync(source.id)}
          disabled={processingSourceId !== null}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Now
        </Button>
      )
    } else {
      // Manual sources
      if (source.status === "uploading") {
        return (
          <div className="flex items-center">
            <Upload className="h-4 w-4 animate-pulse mr-2" />
            <span>Uploading...</span>
          </div>
        )
      }
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUploadFile(source.id)}
          disabled={processingSourceId !== null}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      )
    }
  }

  // Function to handle file uploads for manual data sources
  const handleUploadFile = (sourceId: string) => {
    // Create a hidden file input element
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".csv,.xlsx,.xls"
    fileInput.style.display = "none"

    // Add event listener for when a file is selected
    fileInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const file = target.files[0]

        // Set the source to uploading status
        setProcessingSourceId(sourceId)
        setDataSources((prev) =>
          prev.map((source) => (source.id === sourceId ? { ...source, status: "uploading" } : source)),
        )

        // Simulate file processing
        setTimeout(() => {
          setDataSources((prev) =>
            prev.map((source) =>
              source.id === sourceId
                ? {
                    ...source,
                    status: "uploaded",
                    lastUpdated: new Date().toISOString().split("T")[0],
                  }
                : source,
            ),
          )
          setProcessingSourceId(null)
        }, 2000)
      }

      // Remove the input element
      document.body.removeChild(fileInput)
    })

    // Append to body and trigger click
    document.body.appendChild(fileInput)
    fileInput.click()
  }

  // Function to view version history
  const handleViewVersionHistory = (source: DataSource) => {
    setSelectedSource(source)
    setShowVersionHistory(true)
  }

  // Group sources based on the selected grouping mode
  const groupedSources: Record<string, DataSource[]> = {}

  if (groupingMode === "source") {
    // Group by source (IMF, World Bank, etc.)
    filteredSources.forEach((source) => {
      if (!groupedSources[source.source]) {
        groupedSources[source.source] = []
      }
      groupedSources[source.source].push(source)
    })
  } else {
    // Group by type (Automatic, Manual)
    filteredSources.forEach((source) => {
      const groupKey = source.type === "automatic" ? "Automatic" : "Manual"
      if (!groupedSources[groupKey]) {
        groupedSources[groupKey] = []
      }
      groupedSources[groupKey].push(source)
    })
  }

  const renderTableView = () => {
    const filteredItems = dataSources // Assuming dataSources is the correct array to filter

    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="w-[150px] dark:text-gray-200">Source</TableHead>
                  <TableHead className="w-[120px] dark:text-gray-200">Type</TableHead>
                  <TableHead className="dark:text-gray-200">Data Name</TableHead>
                  <TableHead className="w-[150px] dark:text-gray-200">Version</TableHead>
                  <TableHead className="w-[150px] dark:text-gray-200">Last Updated</TableHead>
                  <TableHead className="w-[120px] dark:text-gray-200">Status</TableHead>
                  <TableHead className="w-[150px] dark:text-gray-200">Action</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((dataSource) => (
                    <TableRow
                      key={dataSource.id}
                      className={`${dataSource.type === "manual" ? "bg-amber-50 dark:bg-amber-950/20" : ""} dark:bg-gray-800`}
                    >
                      <TableCell className="dark:text-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          {getSourceIcon(dataSource.source)}
                          <span className="ml-2">{dataSource.source}</span>
                        </div>
                      </TableCell>
                      <TableCell className="dark:border-gray-700">
                        <Badge
                          variant={dataSource.type === "automatic" ? "outline" : "secondary"}
                          className={`${
                            dataSource.type === "automatic"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              : "dark:text-gray-200"
                          }`}
                        >
                          {dataSource.type === "automatic" ? "Automatic" : "Manual"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium dark:text-gray-200 dark:border-gray-700">
                        {dataSource.name}
                      </TableCell>
                      <TableCell className="dark:text-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <span>{dataSource.version}</span>
                          {dataSource.versionHistory && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 w-6 p-0"
                              onClick={() => handleViewVersionHistory(dataSource)}
                            >
                              <History className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-200 dark:border-gray-700">
                        {dataSource.lastUpdated}
                      </TableCell>
                      <TableCell className="dark:border-gray-700">{getStatusBadge(dataSource)}</TableCell>
                      <TableCell className="dark:border-gray-700">{getFileAction(dataSource)}</TableCell>
                      <TableCell className="dark:border-gray-700">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-700">
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {dataSource.versionHistory && (
                              <DropdownMenuItem
                                className="dark:text-gray-200 dark:hover:bg-gray-700"
                                onClick={() => handleViewVersionHistory(dataSource)}
                              >
                                <History className="mr-2 h-4 w-4" />
                                Version History
                              </DropdownMenuItem>
                            )}
                            {dataSource.type === "manual" && dataSource.status === "uploaded" && (
                              <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-700">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            )}
                            {dataSource.type === "manual" && (
                              <DropdownMenuItem className="text-destructive dark:text-red-400 dark:hover:bg-gray-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 dark:text-gray-300 dark:border-gray-700">
                      <div className="flex flex-col items-center justify-center">
                        <Database className="h-8 w-8 text-muted-foreground dark:text-gray-400 mb-2" />
                        <p className="text-muted-foreground dark:text-gray-400">No data sources found</p>
                      </div>
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

  const getSourceIcon = (source: string) => {
    // Use actual institution logos
    switch (source) {
      case "IMF":
        return <img src="/placeholder.svg?height=24&width=24" alt="IMF Logo" className="h-6 w-6 rounded" />
      case "World Bank":
        return <img src="/placeholder.svg?height=24&width=24" alt="World Bank Logo" className="h-6 w-6 rounded" />
      case "Transparency International":
        return (
          <img
            src="/placeholder.svg?height=24&width=24"
            alt="Transparency International Logo"
            className="h-6 w-6 rounded"
          />
        )
      case "WEF":
        return <img src="/placeholder.svg?height=24&width=24" alt="WEF Logo" className="h-6 w-6 rounded" />
      case "UN Comtrade":
        return <img src="/placeholder.svg?height=24&width=24" alt="UN Comtrade Logo" className="h-6 w-6 rounded" />
      case "GASTAT":
        return <img src="/placeholder.svg?height=24&width=24" alt="GASTAT Logo" className="h-6 w-6 rounded" />
      case "Automatic":
        return <img src="/placeholder.svg?height=24&width=24" alt="Automatic Logo" className="h-6 w-6 rounded" />
      case "Manual":
        return <img src="/placeholder.svg?height=24&width=24" alt="Manual Logo" className="h-6 w-6 rounded" />
      default:
        return <img src="/placeholder.svg?height=24&width=24" alt="Default Logo" className="h-6 w-6 rounded" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
              <Input
                placeholder="Search data sources..."
                className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                <span className="text-sm font-medium dark:text-gray-200">Group by:</span>
                <Tabs
                  value={groupingMode}
                  onValueChange={(value) => setGroupingMode(value as GroupingMode)}
                  className="w-[200px]"
                >
                  <TabsList className="grid w-full grid-cols-2 dark:bg-gray-700">
                    <TabsTrigger value="source" className="dark:data-[state=active]:bg-gray-900">
                      Source
                    </TabsTrigger>
                    <TabsTrigger value="type" className="dark:data-[state=active]:bg-gray-900">
                      Type
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button onClick={() => setIsAddingSource(true)} className="dark:bg-primary dark:text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Add Data Source
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(groupedSources).length > 0 ? (
        Object.entries(groupedSources).map(([groupName, sources]) => (
          <Card key={groupName} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
                {getSourceIcon(groupName)}
                <span className="ml-2">{groupName}</span>
              </h2>
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-700">
                  <TableRow>
                    {groupingMode === "type" && <TableHead className="w-[150px] dark:text-gray-200">Source</TableHead>}
                    {groupingMode === "source" && <TableHead className="w-[120px] dark:text-gray-200">Type</TableHead>}
                    <TableHead className="dark:text-gray-200">Data Name</TableHead>
                    <TableHead className="w-[150px] dark:text-gray-200">Version</TableHead>
                    <TableHead className="w-[150px] dark:text-gray-200">Last Updated</TableHead>
                    <TableHead className="w-[120px] dark:text-gray-200">Status</TableHead>
                    <TableHead className="w-[150px] dark:text-gray-200">Action</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((dataSource) => (
                    <TableRow
                      key={dataSource.id}
                      className={`${dataSource.type === "manual" ? "bg-amber-50 dark:bg-amber-950/20" : ""} dark:bg-gray-800`}
                    >
                      {groupingMode === "type" && (
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            {getSourceIcon(dataSource.source)}
                            <span className="ml-2">{dataSource.source}</span>
                          </div>
                        </TableCell>
                      )}
                      {groupingMode === "source" && (
                        <TableCell className="dark:border-gray-700">
                          <Badge
                            variant={dataSource.type === "automatic" ? "outline" : "secondary"}
                            className={`${
                              dataSource.type === "automatic"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                : "dark:text-gray-200"
                            }`}
                          >
                            {dataSource.type === "automatic" ? "Automatic" : "Manual"}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="font-medium dark:text-gray-200 dark:border-gray-700">
                        {dataSource.name}
                      </TableCell>
                      <TableCell className="dark:text-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <span>{dataSource.version}</span>
                          {dataSource.versionHistory && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 w-6 p-0"
                              onClick={() => handleViewVersionHistory(dataSource)}
                            >
                              <History className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-200 dark:border-gray-700">
                        {dataSource.lastUpdated}
                      </TableCell>
                      <TableCell className="dark:border-gray-700">{getStatusBadge(dataSource)}</TableCell>
                      <TableCell className="dark:border-gray-700">{getFileAction(dataSource)}</TableCell>
                      <TableCell className="dark:border-gray-700">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-700">
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {dataSource.versionHistory && (
                              <DropdownMenuItem
                                className="dark:text-gray-200 dark:hover:bg-gray-700"
                                onClick={() => handleViewVersionHistory(dataSource)}
                              >
                                <History className="mr-2 h-4 w-4" />
                                Version History
                              </DropdownMenuItem>
                            )}
                            {dataSource.type === "manual" && dataSource.status === "uploaded" && (
                              <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-700">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            )}
                            {dataSource.type === "manual" && (
                              <DropdownMenuItem className="text-destructive dark:text-red-400 dark:hover:bg-gray-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6 text-center py-10">
            <Database className="mx-auto h-12 w-12 text-muted-foreground dark:text-gray-400" />
            <h3 className="mt-4 text-lg font-medium dark:text-white">No data sources found</h3>
            <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
              {searchQuery ? "No data sources match your search criteria." : "Get started by adding a data source."}
            </p>
            <Button className="mt-4" onClick={() => setIsAddingSource(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Data Source
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Version History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedSource && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="mr-3">{getSourceIcon(selectedSource.source)}</div>
                  <div>
                    <h3 className="font-medium dark:text-white">{selectedSource.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{selectedSource.source}</p>
                  </div>
                </div>
                <div className="border rounded-md dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                      <TableRow>
                        <TableHead className="w-[120px] dark:text-gray-200">Version</TableHead>
                        <TableHead className="w-[120px] dark:text-gray-200">Date</TableHead>
                        <TableHead className="w-[100px] dark:text-gray-200">Status</TableHead>
                        <TableHead className="dark:text-gray-200">Changes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSource.versionHistory ? (
                        selectedSource.versionHistory.map((version, index) => (
                          <TableRow key={index} className="dark:hover:bg-gray-700/70">
                            <TableCell className="font-medium dark:text-gray-200 dark:border-gray-700">
                              {version.version}
                            </TableCell>
                            <TableCell className="dark:text-gray-200 dark:border-gray-700">{version.date}</TableCell>
                            <TableCell className="dark:text-gray-200 dark:border-gray-700">
                              <div className="flex items-center">
                                {getVersionHistoryStatusIcon(version.status)}
                                <span className="ml-2">{version.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="dark:text-gray-200 dark:border-gray-700">{version.changes}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center dark:text-gray-300 dark:border-gray-700">
                            No version history available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowVersionHistory(false)}
              className="dark:bg-primary dark:text-primary-foreground"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Data Source Dialog */}
      <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add New Data Source</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="source-type" className="dark:text-gray-200">
                Source Type
              </Label>
              <Select defaultValue="manual">
                <SelectTrigger id="source-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="automatic" className="dark:text-gray-200">
                    Automatic
                  </SelectItem>
                  <SelectItem value="manual" className="dark:text-gray-200">
                    Manual
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-name" className="dark:text-gray-200">
                Data Name
              </Label>
              <Input
                id="data-name"
                placeholder="Enter data name"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-provider" className="dark:text-gray-200">
                Source Provider
              </Label>
              <Select defaultValue="gastat">
                <SelectTrigger id="source-provider" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="imf" className="dark:text-gray-200">
                    IMF
                  </SelectItem>
                  <SelectItem value="world-bank" className="dark:text-gray-200">
                    World Bank
                  </SelectItem>
                  <SelectItem value="transparency" className="dark:text-gray-200">
                    Transparency International
                  </SelectItem>
                  <SelectItem value="wef" className="dark:text-gray-200">
                    WEF
                  </SelectItem>
                  <SelectItem value="un-comtrade" className="dark:text-gray-200">
                    UN Comtrade
                  </SelectItem>
                  <SelectItem value="gastat" className="dark:text-gray-200">
                    GASTAT
                  </SelectItem>
                  <SelectItem value="other" className="dark:text-gray-200">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version" className="dark:text-gray-200">
                Version
              </Label>
              <Input
                id="version"
                placeholder="Enter version"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="dark:text-gray-200">
                Upload File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Accepted formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingSource(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAddingSource(false)} className="dark:bg-primary dark:text-primary-foreground">
              Add Data Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

