import { Card } from "@/components/ui/card"
import { Queue } from "@/lib/firestore"

interface QueueStatsProps {
  todayQueues: Queue[]
}

const QueueStats = ({ todayQueues }: QueueStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Menunggu</h3>
        <p className="text-4xl font-bold text-primary">
          {todayQueues.filter((q) => q.status === "waiting").length}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Dipanggil</h3>
        <p className="text-4xl font-bold text-accent">
          {todayQueues.filter((q) => q.status === "called").length}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Hari Ini</h3>
        <p className="text-4xl font-bold text-secondary">
          {todayQueues.length}
        </p>
      </Card>
    </div>
  )
}

export default QueueStats