"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Globe,
  Menu,
  X,
  LogOut,
  User,
  Database,
  CheckSquare,
  FileSignature,
  MessageSquare,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const reportItems: NavItem[] = [
    {
      name: "Report Generation",
      href: "/dashboard/reports",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  const countryItems: NavItem[] = [
    {
      name: "Countries",
      href: "/dashboard/countries",
      icon: <Globe className="h-5 w-5" />,
    },
  ]

  const mainItems: NavItem[] = [
    {
      name: "Profiles",
      href: "/dashboard/profiles",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Data Sources",
      href: "/dashboard/data-sources",
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Action Items",
      href: "/dashboard/action-items",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: "Talking Points",
      href: "/dashboard/talking-points",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Bilateral Agreements",
      href: "/dashboard/agreements",
      icon: <FileSignature className="h-5 w-5" />,
    },
  ]

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
          pathname === item.href ||
          (
            pathname.startsWith(`${item.href}/`) &&
              // Special case for countries to prevent overlap
              !(item.href === "/dashboard/countries" && pathname.startsWith("/dashboard/countries/selector"))
          )
            ? "bg-primary text-primary-foreground"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {item.icon}
        <span className="ml-3">{item.name}</span>
      </Link>
    ))
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 flex-col items-start justify-center border-b border-gray-200 dark:border-gray-700 px-4">
            <Link href="/dashboard" className="group hover:opacity-90 transition-opacity">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                BiLat
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bilateral Agreements Management</div>
            </Link>
            <div className="absolute right-4">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {/* Reports Section */}
              <div className="mb-2">{renderNavItems(reportItems)}</div>

              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-3 mx-1"></div>

              {/* Countries Section */}
              <div className="mb-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Countries
                </div>
                {renderNavItems(countryItems)}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-3 mx-1"></div>

              {/* Main Items Section */}
              <div>
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Management
                </div>
                {renderNavItems(mainItems)}
              </div>
            </nav>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 p-1" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium dark:text-white">Staff Member</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">staff@example.com</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full justify-start dark:text-gray-200 dark:border-gray-700"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

