import { Suspense } from "react"
import { Nav } from "../components/nav"
import { StoreComponent } from "../components/store-component"
import { getUserData } from "@/lib/user-data"
import { redirect } from "next/navigation"

export const revalidate = 0 // disable static generation

export default async function Store() {
  const userData = await getUserData()

  if (!userData) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">CRDS Store</h1>
        <Suspense fallback={<div>Loading store...</div>}>
          <StoreComponent initialBalance={userData.balance} />
        </Suspense>
      </main>
    </div>
  )
}

