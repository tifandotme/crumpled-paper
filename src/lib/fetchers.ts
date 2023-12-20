import type {
  PostInputs,
  Response,
  SignInInputs,
  SignUpInputs,
  SubscriptionPlan,
} from "@/types"
import type { Post, Subscription, Transaction, User } from "@/types/api"
import { subscriptionPlans } from "@/config"
import { convertToCloudinaryURL, generateUUID, slugify } from "@/lib/utils"

/**
 * Generic fetcher for `swr`
 */
export async function fetcher<TData>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData> {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error("Failed to fetch at " + endpoint)
  }

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
      `/posts/${mode === "edit" ? id : ""}`,
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
        likers: mode === "add" ? [] : undefined,
        updatedAt: new Date().toString(),
        createdAt: mode === "add" ? new Date().toString() : undefined,
        slug: mode === "add" ? slugify(data.title) : undefined,
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

export async function deletePost(id: number): Promise<Response> {
  try {
    const url = new URL(`/posts/${id}`, process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a post")
    }

    return {
      success: true,
      message: `Post deleted`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function addTransaction(
  usersId: number,
  type: SubscriptionPlan["id"],
): Promise<Response<Transaction>> {
  try {
    const url = new URL("/transactions", process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usersId,
        amount: subscriptionPlans.find((plan) => plan.id === type)?.price ?? 0,
        status: "unpaid",
        type,
        createdAt: new Date().toISOString(),
      } satisfies Partial<Omit<Transaction, "id">>),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to add a transaction")
    }

    return {
      success: true,
      message: "Transaction added",
      data: await res.json(),
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}
