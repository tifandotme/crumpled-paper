import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { EditProfileInputs } from "@/types"
import type { User } from "@/types/api"
import { updateProfile } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { profileSchema } from "@/lib/validations/profile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export function UserProfile() {
  const user = useStore((state) => state.user)

  if (!user) return null

  return (
    <>
      <section className="space-y-5">
        <h2 className="text-xl font-semibold sm:text-2xl">My Profile</h2>
        <Card className="grid max-w-3xl gap-4 p-6">
          <h3 className="text-lg font-semibold sm:text-xl">Email</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Full Name</h3>
          <p className="text-sm text-muted-foreground">{user.name}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Phone Number</h3>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Address</h3>
          <p className="text-sm text-muted-foreground">{user.address}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Referral</h3>
          <p className="text-sm text-muted-foreground">
            {user.referral || "-"}
          </p>
        </Card>

        <EditProfile initialData={user} />
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-destructive sm:text-2xl">
          Delete Account
        </h2>
        <p className="text-sm sm:text-base">
          Once you delete your account, there is no going back. Please be
          certain
        </p>
        <Button variant="destructive" size="sm">
          Delete your account
        </Button>
      </section>
    </>
  )
}

interface EditProfileProps {
  initialData: User
}

function EditProfile({ initialData }: EditProfileProps) {
  const updateUser = useStore((state) => state.updateUser)
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const form = useForm<EditProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      address: initialData.address,
      phone: initialData.phone,
    },
  })

  const onSubmit = async (data: EditProfileInputs) => {
    setIsLoading(true)

    const {
      success,
      message,
      data: updatedData,
    } = await updateProfile(initialData.id, data)
    success ? toast.success(message) : toast.error(message)

    updatedData && updateUser(updatedData)

    setOpen(false)
    setIsLoading(false)
  }

  React.useEffect(() => {
    form.setFocus("name")
  }, [form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid w-full max-w-2xl gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="flex h-10 items-center text-sm text-muted-foreground">
                {initialData.email}
              </div>
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="+62 8888888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="123 Sesame St."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-fit">
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
