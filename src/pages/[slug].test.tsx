import { render, screen } from "@testing-library/react"

import { posts } from "@/mocks/handlers"
import PostPage, {
  getStaticProps as getStaticPropsSource,
} from "@/pages/[slug]"

vi.mock("../lib/plaiceholder", () => ({
  getPlaceholder: vi.fn(() => Promise.resolve(null)),
}))

const getStaticProps = vi.fn(getStaticPropsSource)

describe("getStaticProps", () => {
  it("Should return post data", async () => {
    // Simulate getStaticProps call from the server
    await getStaticProps({
      params: { slug: "crux-sub-urbanus-aperiam-tutis-abundans-talio" },
    })

    expect(getStaticProps).toHaveReturnedWith({
      props: { post: posts[0], placeholder: null },
    })
  })
})

describe("PostPage", () => {
  it("Should display post title", async () => {
    const props: React.ComponentProps<typeof PostPage> =
      getStaticProps.mock.results[0]?.value.props

    render(<PostPage {...props} />)

    expect(
      screen.getByRole("heading", {
        name: "Crux sub urbanus aperiam tutis abundans talio",
        level: 1,
      }),
    ).toBeDefined()
  })
})
