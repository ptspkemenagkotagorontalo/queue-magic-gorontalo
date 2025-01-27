import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/Navigation"
import { getTodayQueues, updateQueueStatus, getQueuesByDay } from "@/lib/firestore"
import QueueStats from "@/components/admin/QueueStats"
import ActiveQueues from "@/components/admin/ActiveQueues"
import QueueHistory from "@/components/admin/QueueHistory"
import { Queue } from "@/lib/firestore"

const AdminDashboard = () => {
  const [todayQueues, setTodayQueues] = useState<Queue[]>([])
  const [queuesByDay, setQueuesByDay] = useState<Record<string, Queue[]>>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const [today, historical] = await Promise.all([
          getTodayQueues(),
          getQueuesByDay()
        ])
        setTodayQueues(today as Queue[])
        setQueuesByDay(historical)
      } catch (error) {
        console.error('Error fetching queues:', error)
        toast({
          title: "Error",
          description: "Gagal mengambil data antrian",
          variant: "destructive",
        })
      }
    }

    fetchQueues()
    const interval = setInterval(fetchQueues, 30000)
    return () => clearInterval(interval)
  }, [toast])

  const callNumber = async (id: string) => {
    const queueToCall = todayQueues.find((q) => q.id === id)
    
    if (!queueToCall || queueToCall.status === "called") {
      return
    }

    try {
      await updateQueueStatus(id, "called")
      setTodayQueues(prev =>
        prev.map(q =>
          q.id === id ? { ...q, status: "called" } : q
        )
      )

      const announcement = `Nomor antrian ${queueToCall.number} untuk layanan ${queueToCall.service}, silakan menuju ke loket`
      
      const speech = new SpeechSynthesisUtterance(announcement)
      speech.lang = 'id-ID'
      window.speechSynthesis.speak(speech)

      toast({
        title: "Nomor Antrian Dipanggil",
        description: `Memanggil nomor ${queueToCall.number} untuk ${queueToCall.service}`,
      })
    } catch (error) {
      console.error('Error calling number:', error)
      toast({
        title: "Error",
        description: "Gagal memanggil nomor antrian",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Sistem Manajemen Antrian
        </h1>

        <QueueStats todayQueues={todayQueues} />
        <ActiveQueues queues={todayQueues} onCallNumber={callNumber} />
        <QueueHistory queuesByDay={queuesByDay} />
      </div>
    </div>
  )
}

export default AdminDashboard