import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon, ImageIcon, UploadIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { PostInputs } from "@/types"
import type { Post } from "@/types/api"
import { postCategories } from "@/config"
import { deletePost, updatePost } from "@/lib/fetchers"
import { getBase64, toSentenceCase } from "@/lib/utils"
import { postSchema } from "@/lib/validations/post"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface PostFormProps {
  mode: "add" | "edit"
  initialData?: Post
}

export function PostForm({ mode, initialData }: PostFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<PostInputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      category:
        initialData?.category ?? postSchema.shape.category._def.defaultValue(),
      image: initialData?.image ?? "",
      isPremium: initialData?.isPremium ?? false,
    },
  })

  const onSubmit = async (data: PostInputs) => {
    setIsLoading(true)

    const { success, message } = await updatePost(mode, data, initialData?.id)
    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)

    router.push("/dashboard/posts")
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
                <Input
                  type="text"
                  placeholder="Where Great Ideas Begin"
                  {...field}
                />
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
                <Textarea
                  placeholder="Unleash your ideas here..."
                  {...field}
                  rows={10}
                />
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
                <div className="flex gap-2">
                  <FormControl>
                    <>
                      <Input
                        className="hidden"
                        id="imageUpload"
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files
                          if (!files) return

                          const file = files[0]
                          if (!file) return

                          form.setValue("image", URL.createObjectURL(file), {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }}
                        accept="image/*"
                        ref={field.ref}
                        disabled={field.disabled}
                      />
                      <label htmlFor="imageUpload" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer font-medium"
                          asChild
                        >
                          <div>
                            <UploadIcon className="mr-1.5 h-3.5 w-3.5 translate-y-[-1px] stroke-foreground stroke-[0.6px]" />
                            Upload
                          </div>
                        </Button>
                      </label>
                    </>
                  </FormControl>
                  {mode === "add" && form.getFieldState("image").isDirty && (
                    <ViewImageButton src={field.value} alt={"Image preview"} />
                  )}
                  {mode === "edit" && initialData && (
                    <ViewImageButton
                      src={
                        form.getFieldState("image").isDirty
                          ? field.value
                          : initialData.image
                      }
                      alt={initialData.title}
                    />
                  )}
                </div>
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
          {mode === "edit" && initialData && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="destructive" className="w-fit">
                    Delete
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[250px] space-y-4 text-center">
                  <span>Are you sure?</span>
                  <div className="flex gap-2 [&>*]:w-full">
                    <PopoverClose asChild>
                      <Button
                        onClick={() => {
                          const handleDeletion = async () => {
                            const { success } = await deletePost(initialData.id)

                            if (!success) throw new Error()

                            router.push("/dashboard/posts")
                          }

                          toast.promise(handleDeletion(), {
                            loading: "Deleting post...",
                            success: "Post deleted successfully",
                            error: "Failed to delete post",
                          })
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        Yes
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button size="sm" variant="secondary">
                        No
                      </Button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="secondary"
                className="w-fit"
                asChild
              >
                <Link href={`/${initialData?.slug}`} target="_blank">
                  View Post
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

interface ViewImageButtonProps {
  src: string
  alt: string
}

function ViewImageButton({ src, alt }: ViewImageButtonProps) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="w-fit"
              >
                <ImageIcon className="mx-3 h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">View Image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image</DialogTitle>
        </DialogHeader>
        <AspectRatio ratio={16 / 10} asChild>
          <ScrollArea className="h-full">
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1000}
              className="rounded-lg object-cover"
              placeholder={`data:image/svg+xml;base64,${getBase64(
                278,
                173.75,
              )}`}
              sizes="(max-width: 900px) 90vw, 50vw"
              loading="lazy"
            />
          </ScrollArea>
        </AspectRatio>
      </DialogContent>
    </Dialog>
  )
}
