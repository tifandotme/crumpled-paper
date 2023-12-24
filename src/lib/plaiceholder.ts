import { getPlaiceholder } from "plaiceholder"

/**
 * Server-side usage only
 */
export async function getPlaceholder(imgUrl: string) {
  try {
    const res = await fetch(imgUrl)

    if (!res.ok) return null

    const buffer = Buffer.from(await res.arrayBuffer())
    const { base64 } = await getPlaiceholder(buffer, { size: 10 })

    return base64
  } catch (err) {
    console.error(err)
    return null
  }
}
