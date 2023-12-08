import Cookies from "universal-cookie"

const cookies = new Cookies(null, {
  path: "/",
  secure: process.env.NODE_ENV === "production",
})

export function getCookie(name: string): string | undefined {
  return cookies.get(name)
}

export function setCookie(name: string, value: string) {
  cookies.set(name, value)
}

export function removeCookie(name: string) {
  cookies.remove(name)
}
