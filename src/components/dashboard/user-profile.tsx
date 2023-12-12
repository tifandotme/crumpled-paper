import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function UserProfile() {
  const user = useStore((state) => state.user)

  // TODO add skeleton
  if (!user) return null

  return (
    <>
      <section className="space-y-5">
        <h2 className="text-xl font-semibold sm:text-2xl">My Profile</h2>
        <Card className="grid max-w-3xl gap-4 p-6">
          <h3 className="text-lg font-semibold sm:text-xl">Full Name</h3>
          <p className="text-sm text-muted-foreground">{user.name}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Email</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Phone Number</h3>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Address</h3>
          <p className="text-sm text-muted-foreground">{user.address}</p>
          <h3 className="text-lg font-semibold sm:text-xl">Referral</h3>
          <p className="text-sm text-muted-foreground">
            {user.referral || "-"}
          </p>
        </Card>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-red-500 sm:text-2xl">
          Delete Account
        </h2>
        <p className="text-sm sm:text-base">
          Once you delete your account, there is no going back. Please be
          certain
        </p>
        <Button variant="destructive" size="sm">
          Delete your account
        </Button>
      </section>
    </>
  )
}
