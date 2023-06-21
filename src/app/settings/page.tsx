import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
   title: 'Settings',
   description: 'Manage account and website settings.',
}

export default async function Settings() {
   const session = await getAuthSession()

   if (!session?.user) redirect(authOptions.pages?.signIn || '/sign-in')

   return (
      <div className="mx-auto max-w-4xl py-12">
         <div className="grid items-start gap-8">
            <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
         </div>
         <div className="grid gap-10">
            <UserNameForm
               user={{
                  id: session.user.id,
                  username: session.user.username || '',
               }}
            />
         </div>
      </div>
   )
}
