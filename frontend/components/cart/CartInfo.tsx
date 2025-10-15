"use client"
import { api } from "@/api/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { handleError } from "@/lib/handleError"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { SelectGroup } from "@radix-ui/react-select"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type data = {
  id: number
  quantity: number
  restaurant_id: number
  menus: {
    item_name: string
    image_url: string
  }
  menu_variants: {
    variety_name: string
    price: number
  }
}
type address = {
  id: number
  address: string
  cities: {
    city_name: string
    states: {
      state_name: string
      countries: {
        country_name: string
      }
    }
  }
}
type userplan = {
  user_id: number | undefined
}

const CartInfo = () => {
  const router = useRouter()

  const [cartInfo, setcartInfo] = useState<data[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(true)
  const [address, setAddress] = useState<address[]>([])
  const [storage, setStorage] = useState("")
  const [payment, setPayment] = useState("")
  const [paymentstatus, setPaymentstatus] = useState("")
  const [userplan, setUserplan] = useState<userplan>()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (await api.get("/cart")).data
        setcartInfo(res)
        const userplan = (await api.get("/extra/userplan")).data
        setUserplan(userplan)
      } catch (error) {
        const err = handleError(error)
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [quantity])

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await api.get("/users/address")
        setAddress(res.data)
      } catch (error) {
        const err = handleError(error)
        console.log(err)
        throw err
      }
    }
    fetchAddress()
  }, [])

  async function updateQuantity(qty: number, cartId: number) {
    try {
      await api.patch(`/cart/${cartId}`, { quantity: qty })
      setQuantity((prev) => !prev)
      console.log(cartInfo[0].restaurant_id)
    } catch (error) {
      const err = handleError(error)
      console.log(err)
      throw err
    }
  }

  const TotalAmount = cartInfo.reduce((sum, item) => sum + item.menu_variants.price * item.quantity, 0)

  if (!cartInfo || cartInfo.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center shadow-sm rounded-2xl border border-border">
          <CardHeader>
            <div className="flex justify-center mb-3">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" aria-hidden />
              <span className="sr-only">Empty cart</span>
            </div>
            <CardTitle className="text-xl font-semibold text-foreground">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Looks like you haven’t added anything yet. Start exploring our menu!
            </p>
            <Link href="/restaurant">
              <Button size="lg" className="rounded-xl">
                Browse Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const resId: number = cartInfo[0].restaurant_id

  async function handleCheckout() {
    try {
      const res = (
        await api.post("/auths/create-payment-intent", {
          address_id: Number(storage),
          restaurant_id: resId,
        })
      ).data
      router.push(res.url)
    } catch (error) {
      const err = handleError(error)
      console.log(err)
      throw err
    }
  }

  async function Orders() {
    try {
      const res = await api.post("/orders", {
        addressId: Number(storage),
        amount: TotalAmount,
        payment: payment,
        payment_status: paymentstatus,
        restaurant_id: resId,
      })
      console.log("success", res.data.order.id)
      router.push(`/delivery/${res.data.order.id}/user`)
    } catch (error) {
      const err = handleError(error)
      console.log(err)
      throw err
    }
  }

  function calculateTotal(value: number) {
    return cartInfo.reduce((sum, item) => sum + item.menu_variants.price * item.quantity, value)
  }

  const hasPlan = userplan !== undefined
  const deliveryCharge = hasPlan ? 0 : 50

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your cart…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <ShoppingCart className="w-8 h-8 text-primary" aria-hidden />
          <span className="sr-only">Cart</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Your Cart</h1>
        <p className="text-muted-foreground">Review your delicious selections</p>
      </header>

      <section className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartInfo.map((items) => (
                <div key={items.id} className="flex items-center gap-6 p-4 rounded-xl border border-border">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${items.menus.image_url}`}
                      alt={items.menus.item_name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground text-pretty">{items.menus.item_name}</h3>
                    <p className="text-sm text-muted-foreground">{items.menu_variants.variety_name}</p>
                    <p className="text-sm font-medium text-foreground">
                      ${Number(items.menu_variants.price * items.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl">
                    <button
                      className="w-9 h-9 rounded-md border border-border bg-background hover:bg-muted transition-colors"
                      onClick={() => updateQuantity(items.quantity - 1, items.id)}
                      aria-label="Decrease quantity"
                    >
                      <span className="sr-only">Decrease quantity</span>
                      <span aria-hidden className="block text-foreground text-lg leading-none">
                        −
                      </span>
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold text-foreground">
                      {items.quantity}
                    </span>
                    <button
                      className="w-9 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => updateQuantity(items.quantity + 1, items.id)}
                      aria-label="Increase quantity"
                    >
                      <span className="sr-only">Increase quantity</span>
                      <span aria-hidden className="block text-primary-foreground text-lg leading-none">
                        +
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-1">
          <Card className="rounded-2xl border border-border sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  Delivery Address
                </label>
                <div className="flex items-center gap-2 overflow-hidden">
                  <Button
                    variant="outline"
                    className="rounded-lg bg-transparent"
                    onClick={() => router.push("/user/address?redirect=/cart")}
                  >
                    Add Address
                  </Button>
                  <Select onValueChange={(value) => setStorage(value)} required >
                    <SelectTrigger className="h-10 rounded-lg w-[220px]">
                      <SelectValue placeholder="Select delivery address" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 w-[220px] overflow-y-auto">
                      <SelectGroup>
                        {address.map((details) => (
                          <SelectItem
                            key={details.id}
                            value={String(details.id)}
                            className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            <div
                              className="w-[220px] overflow-hidden text-ellipsis whitespace-nowrap"
                              title={details.address}
                            >
                              {details.address}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>


              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Method
                </label>
                <Select
                  onValueChange={(value) => {
                    if (value === "COD") {
                      setPaymentstatus("not_paid")
                    } else {
                      setPaymentstatus("paid")
                    }
                    setPayment(value)
                  }}
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="COD">Cash On Delivery</SelectItem>
                      <SelectItem value="Debit_Credit_Card">Card Payment</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>


              <div className="rounded-xl border border-border p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${TotalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={hasPlan ? "text-primary " : "text-foreground"}>
                      {hasPlan ? "Free (with plan)" : `$${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-center justify-between text-lg font-semibold text-foreground">
                    <span>Total</span>
                    <span>${hasPlan ? calculateTotal(0).toFixed(2) : calculateTotal(50).toFixed(2)}</span>
                  </div>
                </div>
              </div>


              {payment === "Debit_Credit_Card" && (
                <Button className="w-full h-12 rounded-xl" onClick={handleCheckout}>
                  Checkout
                </Button>
              )}

              {payment === "COD" && (
                <Button className="w-full h-12 rounded-xl" onClick={Orders}>
                  Place Order - Cash on Delivery
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}

export default CartInfo
