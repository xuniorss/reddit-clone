'use client'

import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { HTMLAttributes, useCallback, useState } from 'react'
import { Icons } from '../Icons'
import { Button } from '../ui/Button'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const { toast } = useToast()

   const loginWithGoogle = useCallback(async () => {
      setIsLoading(true)

      try {
         await signIn('google')
      } catch (error) {
         toast({
            title: 'There was a problem.',
            description: 'There was an error logging in with Google',
            variant: 'destructive',
         })
      } finally {
         setIsLoading(false)
      }
   }, [toast])

   return (
      <div className={cn('flex justify-center', className)} {...props}>
         <Button
            onClick={loginWithGoogle}
            isLoading={isLoading}
            size="sm"
            className="w-full"
         >
            {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
            Google
         </Button>
      </div>
   )
}
