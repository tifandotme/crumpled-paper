import { http, HttpResponse } from "msw"

import type { Post } from "@/types/api"
import { slugify } from "@/lib/utils"

const title = "Crux sub urbanus aperiam tutis abundans talio"

export const posts: Post[] = [
  {
    id: 1,
    title,
    content:
      "Virgo concido thermae amitto acidus tantillus terra eum. Coniecto curriculum summisse suus. Concido adaugeo ipsa vulnus amplexus paulatim conspergo contabesco. Artificiose ab delicate urbanus vetus truculenter cruentus vae. Vobis a ver cogito thema. Nemo suffoco cupressus capillus caput aurum suscipio.\nAppello depromo patrocinor tricesimus suppellex dens laudantium caute. Claudeo alienus dicta despecto vigor deporto centum vis absorbeo. Ceno acerbitas tutis abeo ambitus cornu ab adsidue. Circumvenio tondeo sustineo vulnus. Vesica arceo stella ara quis decumbo adaugeo. Adfero apparatus tui ducimus brevis defungo uberrime aestivus solio. Ustilo summopere patior crux averto. Sit cena compono. Candidus vulariter contra velociter in ipsam. Dolores fugiat valens aliquam cotidie perspiciatis statua copiose.\nAmicitia curatio velut aeger coaegresco solum. Doloribus tempora cruciamentum. Votum cultura denuo velum facere decimus. Ratione tertius ultra universe damno canis earum aperte titulus. Ter tollo cultellus officia vigor. Quaerat velut sulum solvo audeo caput fuga verecundia tactus. Cui abscido atavus paens sit coma eveniet patria similique distinctio. Crur vespillo vulgo caute cohaero auctor amplexus vero.\nVicissitudo architecto admoneo cattus harum valens quam absorbeo baiulus adeo. Triumphus sono tripudio civitas credo aperiam surgo. Laborum vicinus cras vinculum patruus vilitas cimentarius tyrannus. Tempore textor soleo cupressus careo curis decimus sumo victus tutamen. Una utrum coniuratio vulariter ocer laborum curriculum creta tricesimus textor.\nCorreptius aer velum. Degusto dignissimos sto atque delectatio. Cernuus tempore sint tollo spiritus veritas cerno vigilo sufficio. Copia varius commodi.\nAstrum amor aggero. Vae cilicium deduco canto ulciscor supra ad adstringo amaritudo solvo. Sonitus nostrum apto beatae tempus. Urbs debitis capio via facere vulgaris officiis thorax crinis. Depereo virga tego compello patior inflammatio ulciscor viscus aliquid aptus. Sortitus toties sordeo vallum vulgivagus velit ascisco vito. Curso cohors comedo. Tertius tot condico ocer curriculum adsum complectus abduco error. Triumphus acerbitas cupiditas viscus. Verecundia comprehendo versus tergeo audax.",
    isPremium: false,
    category: "culture",
    createdAt: new Date("August 10, 2023 12:00:00").toISOString(),
    updatedAt: new Date("December 25, 2023 11:00:00").toISOString(),
    likers: [186, 191, 62, 144, 87, 24, 190, 198, 115],
    shareCount: 111,
    image: "https://picsum.photos/seed/9yLNX/1600/1000",
    slug: slugify(title),
  },
]

export const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_DB_URL}/posts`, ({ request }) => {
    const url = new URL(request.url)
    const slug = url.searchParams.get("slug")

    if (!slug || slug !== posts[0]!.slug) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(posts, {
      status: 200,
    })
  }),
]
