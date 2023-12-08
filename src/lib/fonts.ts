import { Inter, Lora } from "next/font/google"

const fontSans = Inter({
  subsets: ["latin"],
})

const fontSerif = Lora({
  subsets: ["latin"],
})

export const fonts = [fontSans, fontSerif]
