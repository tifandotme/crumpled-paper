import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import url from "node:url"
import jsonServer from "json-server"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "db.json")

if (!fs.existsSync(dbPath)) {
  const { status } = spawnSync("node", [`${__dirname}/generate.js`], {
    stdio: "inherit",
  })

  if (status !== 0) {
    console.error("Failed to generate data")
    process.exit(1)
  }
}

const server = jsonServer.create()
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use((_, res, next) => {
  res.header("Access-Control-Allow-Headers", "*")

  setTimeout(() => {
    next()
  }, 1000)
})
server.use(router)

const dbUrl = new URL(process.env.NEXT_PUBLIC_DB_URL)

server.listen(dbUrl.port, () => {
  console.log(`JSON Server is running at ${dbUrl.toString()}`)
})