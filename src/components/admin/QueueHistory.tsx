import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Queue } from "@/lib/firestore"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

const TIME_ZONE = 'Asia/Singapore'

interface QueueHistoryProps {
  queuesByDay: Record<string, Queue[]>
}

const QueueHistory = ({ queuesByDay }: QueueHistoryProps) => {
  const formatDate = (date: Date) => {
    const zonedDate = toZonedTime(date, TIME_ZONE)
    return format(zonedDate, 'HH:mm:ss')
  }

  const formatDayDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy')
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Riwayat Antrian</h2>
      {Object.keys(queuesByDay).length === 0 ? (
        <p className="text-center py-4">Belum ada riwayat antrian</p>
      ) : (
        Object.entries(queuesByDay).map(([date, queues]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{formatDayDate(date)}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Antrian</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queues.map((queue: Queue) => (
                  <TableRow key={queue.id}>
                    <TableCell className="font-mono font-bold">{queue.number}</TableCell>
                    <TableCell>{queue.service}</TableCell>
                    <TableCell>{formatDate(queue.createdAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          queue.status === "waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {queue.status === "waiting" ? "Menunggu" : "Dipanggil"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )}
    </Card>
  )
}

export default QueueHistory