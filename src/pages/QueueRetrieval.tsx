import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { addQueueNumber, getNextQueueNumber } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/Navigation"

const services = [
  { id: 1, name: "Sekretariat", color: "bg-gradient-to-br from-blue-400 to-blue-500" },
  { id: 2, name: "Pendidikan Madrasah", color: "bg-gradient-to-br from-emerald-400 to-emerald-500" },
  { id: 3, name: "Diniyah dan Pontren", color: "bg-gradient-to-br from-amber-400 to-amber-500" },
  { id: 4, name: "P.A.I", color: "bg-gradient-to-br from-purple-400 to-purple-500" },
  { id: 5, name: "Haji dan Umrah", color: "bg-gradient-to-br from-rose-400 to-rose-500" },
  { id: 6, name: "Bimas Islam", color: "bg-gradient-to-br from-cyan-400 to-cyan-500" },
  { id: 7, name: "Zakat", color: "bg-gradient-to-br from-indigo-400 to-indigo-500" },
  { id: 8, name: "Wakaf", color: "bg-gradient-to-br from-teal-400 to-teal-500" },
]

const QueueRetrieval = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const getQueueNumber = async (service: string) => {
    try {
      setIsLoading(true)
      const nextNumber = await getNextQueueNumber(service)
      const queueId = await addQueueNumber({
        number: nextNumber,
        service,
        status: "waiting",
      })

      navigate(`/queue/${queueId}`)
    } catch (error) {
      console.error("Error getting queue number:", error)
      toast({
        title: "Error",
        description: "Gagal mengambil nomor antrian",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">
          SISTEM ANTRIAN KEMENAG KOTA GORONTALO
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className={`${service.color} text-white p-6`}>
              <h2 className="text-xl font-semibold mb-4">{service.name}</h2>
              <Button
                variant="secondary"
                className="w-full"
                disabled={isLoading}
                onClick={() => getQueueNumber(service.name)}
              >
                Ambil Nomor Antrian
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QueueRetrieval