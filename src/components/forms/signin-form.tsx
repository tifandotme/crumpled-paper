import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { SignInInputs } from "@/types"
import { setCookie } from "@/lib/cookie"
import { getUser } from "@/lib/fetchers"
import { useStore } from "@/lib/store"
import { signInSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
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
import { PasswordInput } from "@/components/password-input"

export function SignInForm() {
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)
  const updateUser = useStore((state) => state.updateUser)

  const form = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInInputs) => {
    setIsLoading(true)

    const { success, message, data: user } = await getUser(data)

    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)

    if (success && user) {
      updateUser(user)
      setCookie("token", user.token)
      setCookie("role", user.role)

      await router.push("/")
      router.reload()
    }
  }

  React.useEffect(() => {
    form.setFocus("email")
  }, [form])

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  )
}
