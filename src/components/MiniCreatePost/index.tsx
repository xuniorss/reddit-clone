'use client'

import { ImageIcon, Link2 } from 'lucide-react'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { UserAvatar } from '../UserAvatar'

interface MiniCreatePostProps {
   session: Session | null
}

export const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
   const router = useRouter()
   const pathname = usePathname()

   return (
      <li className="overflow-hidden rounded-md bg-white shadow">
         <div className="flex h-full justify-between gap-6 px-6 py-4">
            <div className="relative">
               <UserAvatar
                  user={{
                     name: session?.user.name || null,
                     image: session?.user.image || null,
                  }}
               />
               <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>
            <Input
               readOnly
               onClick={() => router.push(pathname + '/submit')}
               placeholder="Create post"
            />

            <Button
               onClick={() => router.push(pathname + '/submit')}
               variant="ghost"
            >
               <ImageIcon className="text-zinc-600" />
            </Button>

            <Button
               onClick={() => router.push(pathname + '/submit')}
               variant="ghost"
            >
               <Link2 className="text-zinc-600" />
            </Button>
         </div>
      </li>
   )
}
