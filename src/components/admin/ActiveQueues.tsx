import { Button } from "@/components/ui/button"
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

interface ActiveQueuesProps {
  queues: Queue[]
  onCallNumber: (id: string) => void
}

const ActiveQueues = ({ queues, onCallNumber }: ActiveQueuesProps) => {
  const formatDate = (date: Date) => {
    const zonedDate = toZonedTime(date, TIME_ZONE)
    return format(zonedDate, 'HH:mm:ss')
  }

  // Sort queues by createdAt in descending order (newest first)
  const sortedQueues = [...queues].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  )

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Antrian Aktif</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor Antrian</TableHead>
            <TableHead>Layanan</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedQueues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Belum ada antrian hari ini
              </TableCell>
            </TableRow>
          ) : (
            sortedQueues.map((queue) => (
              <TableRow key={queue.id}>
                <TableCell className="font-mono font-bold">
                  {queue.number}
                </TableCell>
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
                <TableCell>
                  <Button
                    onClick={() => onCallNumber(queue.id)}
                    disabled={queue.status === "called"}
                    variant={queue.status === "called" ? "outline" : "default"}
                  >
                    {queue.status === "called" ? "Sudah Dipanggil" : "Panggil Nomor"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default ActiveQueues