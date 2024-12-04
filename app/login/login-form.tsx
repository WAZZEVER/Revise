'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail } from 'lucide-react'
import { motion } from "framer-motion"
import { signInWithGoogle } from "@/app/login/supgoo"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', { email, password })
  }

  

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in with Google or use your email</p>
          </div>
          <Button 
  variant="outline" 
  className="w-full" 
  onClick={signInWithGoogle} // Add the click handler
>
  <Github className="mr-2 h-4 w-4" />
  Sign in with Google
</Button>
        </motion.div>
      </div>
      <div className="flex-1 text-white dark:bg-gray-800 shadow-2xl">
        <div className="h-full flex items-center justify-center p-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md space-y-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" className="w-full">Sign in</Button>
              </div>
            </form>
            <div className="text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Forgot your password?
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}