import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { PostInputs } from "@/types"
import type { Post } from "@/types/api"
import { postCategories } from "@/config"
import { updatePost } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { postSchema } from "@/lib/validations/post"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface PostFormProps {
  mode: "add" | "edit"
  initialData?: Post
}

export function PostForm({ mode, initialData }: PostFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<PostInputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      category:
        initialData?.category ?? postSchema.shape.category._def.defaultValue(),
      image: "",
      isPremium: initialData?.isPremium ?? false,
    },
  })

  const onSubmit = async (data: PostInputs) => {
    setIsLoading(true)

    const { success, message } = await updatePost(mode, data, initialData?.id)
    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)
  }

  React.useEffect(() => {
    form.setFocus("title")
  }, [form])

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Lorem Ipsum" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="content" {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {postCategories.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="capitalize"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return

                      const file = files[0]
                      if (!file) return

                      form.setValue("image", URL.createObjectURL(file))
                    }}
                    ref={field.ref}
                    disabled={field.disabled}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.image?.message}
                />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Premium ✨</FormLabel>
                <FormDescription>
                  Posts marked as premium will only be available to subscribed
                  users.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="w-fit">
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {toSentenceCase(mode)} post
          </Button>
          {mode === "edit" && (
            <Button type="button" variant="destructive" className="w-fit">
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
