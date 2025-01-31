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
import { format, subDays } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"

const TIME_ZONE = 'Asia/Singapore'

interface QueueHistoryProps {
  queuesByDay: Record<string, Queue[]>
}

const QueueHistory = ({ queuesByDay }: QueueHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  
  const formatDate = (date: Date) => {
    const zonedDate = toZonedTime(date, TIME_ZONE)
    return format(zonedDate, 'HH:mm:ss')
  }

  const formatDayDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy')
  }

  // Filter dates to show only the last 3 days
  const threeDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd')
  const filteredDates = Object.keys(queuesByDay)
    .filter(date => date >= threeDaysAgo)
    .sort((a, b) => b.localeCompare(a))

  // Calculate pagination
  const totalPages = Math.ceil(filteredDates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDates = filteredDates.slice(startIndex, startIndex + itemsPerPage)

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Riwayat Antrian (3 Hari Terakhir)</h2>
      {filteredDates.length === 0 ? (
        <p className="text-center py-4">Belum ada riwayat antrian</p>
      ) : (
        <>
          {paginatedDates.map((date) => (
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
                  {queuesByDay[date].map((queue: Queue) => (
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
          ))}

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </Card>
  )
}

export default QueueHistory