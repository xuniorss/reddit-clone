'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Post as Pt, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { EditorOutput } from '../EditorOutput'

interface PostProps {
   subredditName: string
   post: Pt & { author: User; votes: Array<Vote> }
   commentAmt: number
}

export const Post = ({ subredditName, post, commentAmt }: PostProps) => {
   const pRef = useRef<HTMLDivElement>(null)

   return (
      <div className="rounded-md bg-white shadow">
         <div className="flex justify-between px-6 py-4">
            {/* TODO: PostVotes */}

            <div className="w-0 flex-1">
               <div className="mt-1 max-h-40 text-xs text-gray-500">
                  {subredditName && (
                     <>
                        <a
                           className="text-sm text-zinc-900 underline underline-offset-2"
                           href={`/r/${subredditName}`}
                        >
                           r/{subredditName}
                        </a>
                        <span className="px-1">-</span>
                     </>
                  )}
                  <span>Posted by u/{post.author.name}</span>{' '}
                  {formatTimeToNow(new Date(post.createdAt))}
               </div>
               <a href={`/r/${subredditName}/post/${post.id}`}>
                  <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
                     {post.title}
                  </h1>
               </a>
               <div
                  className="relative max-h-40 w-full overflow-clip text-sm"
                  ref={pRef}
               >
                  <EditorOutput content={post.content} />
                  {pRef.current?.clientHeight === 160 && (
                     <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
                  )}
               </div>
            </div>
         </div>
         <div className="z-20 bg-gray-50 p-4 text-sm sm:px-6">
            <Link
               href={`/r/${subredditName}/post/${post.id}`}
               className="flex w-fit items-center gap-2"
            >
               <MessageSquare className="h-4 w-4" /> {commentAmt} comments
            </Link>
         </div>
      </div>
   )
}
