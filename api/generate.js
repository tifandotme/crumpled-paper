import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import { faker } from "@faker-js/faker"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "db.json")

const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@qpost.com",
    password: "Kebo43-del",
    address: "123 Sesame St",
    phone: "+62 81234567890",
    referral: "",
    role: "admin",
    token: "admin-e6913fb6-052f-42ee-b3fe-8faded8ae466",
    subscription: {
      type: "free",
      expiryDate: null,
      isSubscribed: false,
    },
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@mail.com",
    password: "Qq123*123",
    address: "123 asd",
    phone: "123123123123",
    referral: "",
    role: "user",
    token: "john-5aea0b04-68df-4efe-b33b-4cc153185b50",
    subscription: {
      type: "free",
      expiryDate: null,
      isSubscribed: false,
    },
  },
]

const posts = Array.from({ length: 100 }, (_, i) => {
  const title = faker.lorem.sentence().replace(/\./g, "")

  return {
    id: i + 1,
    title: title,
    content: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () =>
      faker.lorem.sentences({ min: 4, max: 10 }),
    ).join("\n"),
    isPremium: faker.datatype.boolean(),
    category: faker.helpers.arrayElement([
      "uncategorized",
      "lifestyle",
      "food",
      "travel",
      "business",
      "culture",
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent({ days: 90 }),
    likes: faker.number.int({ min: 0, max: 3000 }),
    image: faker.image.urlPicsumPhotos({
      height: 1000,
      width: 1600,
    }),
    slug: faker.helpers.slugify(title).toLowerCase(),
  }
})

const data = {
  users,
  posts,
}

try {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath))
  }

  console.log("db.json generated")

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
} catch (error) {
  console.error(error.message)
}
