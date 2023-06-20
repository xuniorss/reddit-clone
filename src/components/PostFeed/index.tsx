'use client'

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRef } from 'react'
import { Post } from '../Post'

interface PostFeedProps {
   initialPosts: Array<ExtendedPost>
   subredditName?: string
}

export const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {
   const lastPostRef = useRef<HTMLElement>(null)

   const { ref, entry } = useIntersection({
      root: lastPostRef.current,
      threshold: 1,
   })

   const { data: session } = useSession()

   const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
         const query =
            `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
            (!!subredditName ? `&subredditName=${subredditName}` : '')

         const { data } = await axios.get(query)
         return data as Array<ExtendedPost>
      },
      {
         getNextPageParam: (_, pages) => pages.length + 1,
         initialData: { pages: [initialPosts], pageParams: [1] },
      }
   )

   const posts = data?.pages.flatMap((page) => page) ?? initialPosts

   return (
      <ul className="col-span-2 flex flex-col space-y-6">
         {posts.map((post, idx) => {
            const votesAmt = post.votes.reduce((acc, vote) => {
               if (vote.type === 'UP') return acc + 1
               if (vote.type === 'DOWN') return acc - 1
               return acc
            }, 0)

            const currentVote = post.votes.find(
               (vote) => vote.userId === session?.user.id
            )

            if (idx === posts.length - 1) {
               return (
                  <li key={post.id} ref={ref}>
                     <Post
                        currentVote={currentVote}
                        votesAmt={votesAmt}
                        commentAmt={post.comments.length}
                        post={post}
                        subredditName={post.subreddit.name}
                     />
                  </li>
               )
            } else {
               return (
                  <Post
                     currentVote={currentVote}
                     votesAmt={votesAmt}
                     commentAmt={post.comments.length}
                     post={post}
                     key={post.id}
                     subredditName={post.subreddit.name}
                  />
               )
            }
         })}
      </ul>
   )
}
