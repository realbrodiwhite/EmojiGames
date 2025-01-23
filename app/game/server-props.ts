import { kv } from "@vercel/kv"
import { themes } from "@/lib/themes"

export async function getServerSideProps(themeName: string) {
  const jackpot = (await kv.get("jackpot")) || 1000
  const theme = themes.find((t) => t.name === themeName) || themes[0]

  return {
    initialJackpot: jackpot,
    theme,
  }
}

