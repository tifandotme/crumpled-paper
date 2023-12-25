import Cookies from "js-cookie"

const cookies = Cookies.withAttributes({ sameSite: "strict" })

export function getCookie(name: string): string | undefined {
  return cookies.get(name)
}

export function setCookie(name: string, value: string) {
  cookies.set(name, value)
}

export function removeCookie(name: string) {
  cookies.remove(name)
}
