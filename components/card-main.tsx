'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/client"

interface Subject {
  id: string
  parentId: string
  created: string
  last_access: string
  title: string
  topics?: Topic[]
}

interface Topic {
  id: string
  parentId: string
  created: string
  last_access: string
  title: string
}

interface LogEntry {
  id: string
  content: string
  timestamp: string
}

export default function SectionPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newTopicName, setNewTopicName] = useState('')
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [newLogEntry, setNewLogEntry] = useState('')

  const supabase = createClient()
  const router = useRouter()
  const noteId = typeof window !== 'undefined' ? window.location.pathname.split("/").pop() : null

  // Fetch existing subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!noteId) return

      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('parentId', noteId)

      if (error) {
        console.error('Error fetching subjects:', error)
        return
      }

      setSubjects(data || [])
    }

    fetchSubjects()
  }, [noteId])

  const createSubject = async () => {
    if (!newSubjectName.trim() || !noteId) return
  
    try {
      console.log(noteId)
  
      // Insert subject into Supabase
      const { data, error } = await supabase
        .from('subjects')
        .insert({
        parentId: noteId, // Assuming noteId is a valid UUID
        created: new Date().toISOString(),
        last_access: new Date().toISOString(),
        title: newSubjectName.trim()
        })
        .select()
  
      if (error) {
        console.error('Detailed Supabase Error:', error)
        throw error
      }
  
      // Update local state
      if (data) {
        setSubjects([...subjects, ...data])
        setNewSubjectName('')
      }
    } catch (err) {
      console.error('Error creating subject:', err)
      // Optionally, show a user-friendly error message
    }
  }

  const fetchTopics = async (subjectId: string) => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('parentId', subjectId)

    if (error) {
      console.error('Error fetching topics:', error)
      return []
    }

    return data || []
  }

  const toggleSubjectTopics = async (subjectId: string) => {
    // If already active, deactivate
    if (activeSubject === subjectId) {
      setActiveSubject(null)
      return
    }

    // Fetch topics and set active subject
    const topics = await fetchTopics(subjectId)

    // Update subjects with fetched topics
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, topics }
        : subject
    ))

    setActiveSubject(subjectId)
  }

  const createTopic = async (subjectId: string) => {
    if (!newTopicName.trim()) return

    const newTopic = {
      parentId: subjectId,
      created: new Date().toISOString(),
      last_access: new Date().toISOString(),
      title: newTopicName
    }

    // Insert topic into Supabase
    const { data, error } = await supabase
      .from('topics')
      .insert(newTopic)
      .select()

    if (error) {
      console.error('Error creating topic:', error)
      return
    }

    // Update local state
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? {
          ...subject,
          topics: subject.topics
            ? [...subject.topics, ...(data || [])]
            : data || []
        }
        : subject
    ))

    setNewTopicName('')
  }

  const navigateToTopic = (topicId: string) => {
    // Navigate to topic page
    router.push(`/dashboard/${noteId}/${topicId}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Section</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
      <div>
  <h2 className="text-2xl font-semibold mb-4">Subjects</h2>
  <div className="flex mb-6">
    <Input
      type="text"
      placeholder="New subject name"
      value={newSubjectName}
      onChange={(e) => setNewSubjectName(e.target.value)}
      className="mr-2"
    />
    <Button onClick={createSubject}>
      <Plus className="mr-2 h-4 w-4" /> Add Subject
    </Button>
  </div>
  {subjects.length === 0 ? (
    <div className="text-muted-foreground">
      <p>No subjects yet. Start by adding a new subject!</p>
    </div>
  ) : (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <Collapsible>
              <CollapsibleTrigger 
                className="w-full" 
                onClick={() => toggleSubjectTopics(subject.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{subject.title}</CardTitle>
                  {activeSubject === subject.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="flex mb-4">
                    <Input
                      type="text"
                      placeholder="New topic name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      className="mr-2"
                    />
                    <Button onClick={() => createTopic(subject.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Topic
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {subject.topics?.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigateToTopic(topic.id)}
                        className="cursor-pointer"
                      >
                        <Card className="hover:bg-accent transition-colors">
                          <CardHeader>
                            <CardTitle className="text-base">{topic.title}</CardTitle>
                          </CardHeader>
                          <CardFooter className="text-sm text-muted-foreground">
                            Created: {new Date(topic.created).toLocaleDateString()}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>
      ))}
    </div>
  )}
</div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Log</h2>
          <Card>
            <CardContent>
              <ScrollArea className="h-[400px] w-full mt-4 p-4">
                {logEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 last:mb-0"
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      <Clock className="inline-block mr-1 h-3 w-3" />
                      {entry.timestamp}
                    </p>
                    <p>{entry.content}</p>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
