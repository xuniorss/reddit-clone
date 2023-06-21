'use client'

import { toast } from '@/hooks/use-toast'
import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/Button'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'

interface UsernameFormProps {
   user: Pick<User, 'id' | 'username'>
}

export const UserNameForm = ({ user }: UsernameFormProps) => {
   const router = useRouter()

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = useForm<UsernameRequest>({
      resolver: zodResolver(UsernameValidator),
      defaultValues: { name: user?.username || '' },
   })

   const { mutate: updateUsername, isLoading } = useMutation({
      mutationFn: async ({ name }: UsernameRequest) => {
         const payload: UsernameRequest = { name }

         const { data } = await axios.patch(`/api/username`, payload)
         return data
      },
      onError: (err) => {
         if (err instanceof AxiosError) {
            if (err.response?.status === 409) {
               return toast({
                  title: 'Username already taken.',
                  description: 'Please choose another username.',
                  variant: 'destructive',
               })
            }
         }

         return toast({
            title: 'Something went wrong.',
            description: 'Your username was not updated. Please try again.',
            variant: 'destructive',
         })
      },
      onSuccess: () => {
         toast({ description: 'Your username has been updated.' })
         router.refresh()
      },
   })

   return (
      <form onSubmit={handleSubmit((e) => updateUsername(e))}>
         <Card>
            <CardHeader>
               <CardTitle>Your username</CardTitle>
               <CardDescription>
                  Please enter a display name you are comfortable with.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="relative grid gap-1">
                  <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
                     <span className="text-sm text-zinc-400">u/</span>
                  </div>
               </div>
               <Label className="sr-only" htmlFor="name">
                  Name
               </Label>
               <Input
                  id="name"
                  className="w-[25rem] pl-6"
                  size={32}
                  {...register('name')}
               />
               {errors?.name && (
                  <p className="px-1 text-xs text-red-600">
                     {errors.name.message}
                  </p>
               )}
            </CardContent>
            <CardFooter>
               <Button isLoading={isLoading}>Change name</Button>
            </CardFooter>
         </Card>
      </form>
   )
}
