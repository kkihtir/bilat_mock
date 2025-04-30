"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCountries } from "@/lib/mock-data"
import { mockProfiles } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"
import { mockActionItems } from "@/lib/mock-action-items"
import { mockReports } from "@/lib/mock-reports"
import { Globe, Search, User, FileSignature, CheckSquare, FileText } from "lucide-react"

export default function CountrySelector() {
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")

  // Get unique regions from countries
  const regions = Array.from(new Set(mockCountries.map((country) => country.region)))

  // Filter countries based on search and region
  const filteredCountries = mockCountries.filter((country) => {
    // Apply search filter
    if (searchQuery && !country.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Apply region filter
    if (regionFilter !== "all" && country.region !== regionFilter) {
      return false
    }

    return true
  })

  // Get statistics for a country
  const getCountryStats = (countryCode: string) => {
    const profiles = mockProfiles.filter((p) => p.country === countryCode).length
    const agreements = mockAgreements.filter((a) => a.country === countryCode).length
    const actionItems = mockActionItems.filter((ai) => ai.country === countryCode).length
    const reports = mockReports.filter((r) => r.country === countryCode).length

    return { profiles, agreements, actionItems, reports }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCountries.map((country) => {
          const stats = getCountryStats(country.code)
          return (
            <Card key={country.code} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/dashboard/countries/${country.code}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      alt={`${country.name} flag`}
                      className="h-8 w-12 rounded-sm object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{country.name}</h3>
                      <p className="text-sm text-muted-foreground">{country.region}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{stats.profiles} {stats.profiles === 1 ? 'Profile' : 'Profiles'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileSignature className="h-4 w-4 text-muted-foreground" />
                      <span>{stats.agreements} {stats.agreements === 1 ? 'Agreement' : 'Agreements'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{stats.actionItems} {stats.actionItems === 1 ? 'Action Item' : 'Action Items'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{stats.reports} {stats.reports === 1 ? 'Report' : 'Reports'}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}

        {filteredCountries.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No countries found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

