import fs from "node:fs"
import path from "node:path"
import url from "node:url"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "db.json")

const data = {
  users: [],
}

try {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath))
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
} catch (error) {
  console.error(error.message)
}
