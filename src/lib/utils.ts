import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID() {
  return crypto.randomUUID()
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date(date))
}

/**
 * @example toSentenceCase("helloWorld") // "Hello World"
 */
export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export async function convertToCloudinaryURL(url: string) {
  try {
    // Skip if already a cloudinary url
    if (!url.startsWith("blob")) {
      return url
    }

    const file = await fetch(url).then((res) => res.blob())

    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "qpost_admin")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tifan/image/upload",
      {
        method: "POST",
        body: data,
      },
    )

    if (!res.ok) {
      throw new Error("failed to upload product photo")
    }

    const json = await res.json()

    // remove version
    const secureUrl = new URL(json.secure_url as string)
    const segments = secureUrl.pathname.split("/")
    segments.splice(4, 1)
    secureUrl.pathname = segments.join("/")

    return secureUrl.toString()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }

    return null
  }
}
