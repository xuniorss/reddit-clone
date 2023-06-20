'use client'

import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/useCustomToast'
import { cn } from '@/lib/utils'
import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PostVoteClientProps {
   postId: string
   initialVoteAmt: number
   initialVote?: VoteType | null
}

export const PostVoteClient = ({
   postId,
   initialVoteAmt,
   initialVote,
}: PostVoteClientProps) => {
   const [votesAmt, setVotesAmt] = useState<number>(initialVoteAmt)
   const [currentVote, setCurrentVote] = useState(initialVote)

   const { loginToast } = useCustomToast()
   const prevVote = usePrevious(currentVote)

   useEffect(() => {
      setCurrentVote(initialVote)
   }, [initialVote])

   const { mutate: vote } = useMutation({
      mutationFn: async (voteType: VoteType) => {
         const payload: PostVoteRequest = { postId, voteType }

         await axios.patch('/api/subreddit/post/vote', payload)
      },
      onError: (err, voteType) => {
         if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
         else setVotesAmt((prev) => prev + 1)

         setCurrentVote(prevVote)

         if (err instanceof AxiosError) {
            if (err.response?.status === 401) return loginToast()
         }

         return toast({
            title: 'Something went wrong',
            description: 'Your vote was not registered, please try again.',
            variant: 'destructive',
         })
      },
      onMutate: (type: VoteType) => {
         if (currentVote === type) {
            setCurrentVote(undefined)
            if (type === 'UP') setVotesAmt((prev) => prev - 1)
            else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
         } else {
            setCurrentVote(type)
            if (type === 'UP')
               setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
            else if (type === 'DOWN')
               setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
         }
      },
   })

   return (
      <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
         <Button
            onClick={() => vote('UP')}
            size="sm"
            variant="ghost"
            aria-label="upvote"
         >
            <ArrowBigUp
               className={cn('h-5 w-5 text-zinc-700', {
                  'fill-emerald-500 text-emerald-500': currentVote === 'UP',
               })}
            />
         </Button>
         <p className="py-2 text-center text-sm font-medium text-zinc-900">
            {votesAmt}
         </p>
         <Button
            onClick={() => vote('DOWN')}
            size="sm"
            variant="ghost"
            aria-label="downvote"
         >
            <ArrowBigDown
               className={cn('h-5 w-5 text-zinc-700', {
                  'fill-red-500 text-red-500': currentVote === 'DOWN',
               })}
            />
         </Button>
      </div>
   )
}
