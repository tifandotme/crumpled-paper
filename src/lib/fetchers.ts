import type { SignInInputs, SignUpInputs } from "@/types"
import type { User } from "@/types/db"
import { generateUUID } from "@/lib/utils"

type Response<T = undefined> = {
  success: boolean
  message: string
  data?: T
}

export async function getUser(payload: SignInInputs): Promise<Response<User>> {
  try {
    const url = new URL("/users", process.env.NEXT_PUBLIC_DB_URL)
    url.searchParams.set("email", payload.email)
    url.searchParams.set("password", payload.password)

    const res = await fetch(url)

    const data: User[] = await res.json()

    const user = data[0]

    if (!user) {
      throw new Error("User not found")
    }

    return {
      success: true,
      message: "Logged in successfully",
      data: user,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "",
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

    const url = new URL("/users", process.env.NEXT_PUBLIC_DB_URL as string)
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        role: "user",
        token: payload.email.split("@")[0] + "-" + generateUUID(),
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
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "",
    }
  }
}
