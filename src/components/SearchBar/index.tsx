'use client'

import { Prisma, Subreddit } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '../ui/Command'

export const SearchBar = () => {
   const [input, setInput] = useState<string>('')

   const {
      data: queryResults,
      refetch,
      isFetched,
      isFetching,
   } = useQuery({
      queryFn: async () => {
         if (!input) return []
         const { data } = await axios.get(`/api/search?q=${input}`)
         return data as (Subreddit & {
            _count: Prisma.SubredditCountOutputType
         })[]
      },
      queryKey: ['search-query'],
      enabled: false,
   })

   const router = useRouter()

   const request = debounce(async () => refetch(), 300)

   const debounceRequest = useCallback(() => request(), [request])

   return (
      <Command className="relative z-50 max-w-lg overflow-visible rounded-lg border">
         <CommandInput
            value={input}
            onValueChange={(text) => {
               setInput(text)
               debounceRequest()
            }}
            className="border-none outline-none ring-0 focus:border-none focus:outline-none"
            placeholder="Search communities..."
         />

         {input.length > 0 && (
            <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
               {isFetched && <CommandEmpty>No results found</CommandEmpty>}
               {(queryResults?.length ?? 0) > 0 && (
                  <CommandGroup heading="Communities">
                     {queryResults?.map((subreddit) => (
                        <CommandItem
                           key={subreddit.id}
                           onSelect={(e) => {
                              router.push(`/r/${e}`)
                              router.refresh()
                           }}
                           value={subreddit.name}
                        >
                           <Users className="mr-2 h-4 w-4" />
                           <a href={`/r/${subreddit.name}`}>
                              r/{subreddit.name}
                           </a>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               )}
            </CommandList>
         )}
      </Command>
   )
}
