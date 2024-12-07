import React, { useState } from 'react'
import { Folder, File, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { createClient } from '@/utils/supabase/client'

interface FolderItem {
  id: string
  name: string
  type: 'folder' | 'page'
  children?: FolderItem[]
}

export function FolderStructure() {
  const [structure, setStructure] = useState<FolderItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState<'folder' | 'page'>('folder')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const supabase = createClient()

  const addItem = async () => {
    if (!newItemName.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newItem: FolderItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: newItemType,
      children: newItemType === 'folder' ? [] : undefined
    }

    let updatedStructure
    if (currentFolder) {
      updatedStructure = structure.map(item => {
        if (item.id === currentFolder) {
          return { ...item, children: [...(item.children || []), newItem] }
        }
        return item
      })
    } else {
      updatedStructure = [...structure, newItem]
    }

    setStructure(updatedStructure)
    setNewItemName('')

    // Save to Supabase
    await supabase.from('navfavorites').insert({
      id: newItem.id,
      name: newItem.name,
      type: newItem.type,
      parent_id: currentFolder,
      userid: user.id
    })
  }

  const renderItem = (item: FolderItem) => (
    <div key={item.id} className="ml-4">
      {item.type === 'folder' ? (
        <Collapsible>
          <CollapsibleTrigger className="flex items-center space-x-2 py-1">
            <ChevronRight className="h-4 w-4" />
            <Folder className="h-4 w-4" />
            <span>{item.name}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {item.children?.map(renderItem)}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentFolder(item.id)}
              className="ml-6 mt-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex items-center space-x-2 py-1 ml-6">
          <File className="h-4 w-4" />
          <span>{item.name}</span>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div className="mb-4 space-y-2">
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
        />
        <div className="flex space-x-2">
          <Button
            variant={newItemType === 'folder' ? 'default' : 'outline'}
            onClick={() => setNewItemType('folder')}
          >
            Folder
          </Button>
          <Button
            variant={newItemType === 'page' ? 'default' : 'outline'}
            onClick={() => setNewItemType('page')}
          >
            Page
          </Button>
        </div>
        <Button onClick={addItem}>Add {newItemType}</Button>
      </div>
      <div>{structure.map(renderItem)}</div>
    </div>
  )
}

