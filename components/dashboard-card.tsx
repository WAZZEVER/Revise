"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface RecentCardProps {
  id: string
  name: string
  access: string | null
  delay: number
}

export function RecentCard({ id, name, access, delay }: RecentCardProps) {
  // Format last access date
  const formattedLastAccess = access 
    ? new Date(access).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Never accessed'

  // Handle navigation
  const handleNavigation = () => {
    window.location.href = `/dashboard/${id}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="cursor-pointer"
      onClick={handleNavigation}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate w-full">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Last Accessed: {formattedLastAccess}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
