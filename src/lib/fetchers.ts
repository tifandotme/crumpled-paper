import type { PostInputs, Response, SignInInputs, SignUpInputs } from "@/types"
import type { Post, Subscription, User } from "@/types/api"
import { convertToCloudinaryURL, generateUUID } from "@/lib/utils"

/**
 * Generic fetcher for useSWR
 */
export async function fetcher<TData>(endpoint: string): Promise<TData> {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)

  return res.json()
}

export async function getUser(payload: SignInInputs): Promise<Response<User>> {
  try {
    const url = new URL("/users", process.env.NEXT_PUBLIC_DB_URL)
    url.searchParams.set("email", payload.email)
    url.searchParams.set("password", payload.password)

    const res = await fetch(url)

    const user = (await res.json())[0]

    if (!user) {
      throw new Error("User not found")
    }

    return {
      success: true,
      message: "Logged in successfully",
      data: user,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function registerUser(payload: SignUpInputs): Promise<Response> {
  try {
    const { success } = await getUser({
      email: payload.email,
      password: payload.password,
    })

    if (success) {
      throw new Error("User already exists")
    }

    delete payload.confirmPassword

    const url = new URL("/users", process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        role: "user",
        token: payload.email.split("@")[0] + "-" + generateUUID(),
        subscription: {
          type: "free",
          expiryDate: null,
          isSubscribed: false,
        },
      } satisfies Omit<User, "id">),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to sign up")
    }

    return {
      success: true,
      message: "Signed up successfully",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updateSubscription(
  userId: number,
  payload: Subscription,
): Promise<Response> {
  try {
    const url = new URL(`/users/${userId}`, process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription: payload }),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update user's subscription")
    }

    return {
      success: true,
      message: "Subscription updated",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updatePost(
  mode: "add" | "edit",
  payload: PostInputs,
  id?: number,
): Promise<Response> {
  try {
    const { image, ...data } = payload
    const convertedImage = await convertToCloudinaryURL(image)

    if (!convertedImage) {
      throw new Error("Failed to upload the image. Try again later")
    }

    const url = new URL(
      `/posts/${mode === "add" ? id : ""}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        image: convertedImage,
        likes: mode === "add" ? 0 : undefined,
        createdAt: mode === "add" ? new Date() : undefined,
        updatedAt: new Date(),
      } satisfies Partial<Omit<Post, "id">>),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a post")
    }

    return {
      success: true,
      message: `Post ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}
