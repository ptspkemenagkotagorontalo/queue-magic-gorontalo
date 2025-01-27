import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getTodayQueues, updateQueueStatus, getQueuesByDay } from "@/lib/firestore";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface Queue {
  id: string;
  number: number;
  service: string;
  status: "waiting" | "called";
  createdAt: Date;
}

const TIME_ZONE = 'Asia/Singapore'; // GMT+8

const AdminDashboard = () => {
  const [todayQueues, setTodayQueues] = useState<Queue[]>([]);
  const [queuesByDay, setQueuesByDay] = useState<Record<string, Queue[]>>({});
  const { toast } = useToast();

  // Fetch today's queues and historical data
  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const [today, historical] = await Promise.all([
          getTodayQueues(),
          getQueuesByDay()
        ]);
        setTodayQueues(today as Queue[]);
        setQueuesByDay(historical);
      } catch (error) {
        console.error('Error fetching queues:', error);
      }
    };

    fetchQueues();
    // Refresh data every minute
    const interval = setInterval(fetchQueues, 60000);
    return () => clearInterval(interval);
  }, []);

  const callNumber = async (id: string) => {
    const queueToCall = todayQueues.find((q) => q.id === id);
    
    if (!queueToCall || queueToCall.status === "called") {
      return;
    }

    try {
      await updateQueueStatus(id, "called");
      setTodayQueues(prev =>
        prev.map(q =>
          q.id === id ? { ...q, status: "called" } : q
        )
      );

      const announcement = `Nomor antrian ${queueToCall.number} untuk layanan ${queueToCall.service}, silakan menuju ke loket`;
      
      const speech = new SpeechSynthesisUtterance(announcement);
      speech.lang = 'id-ID';
      window.speechSynthesis.speak(speech);

      toast({
        title: "Nomor Antrian Dipanggil",
        description: `Memanggil nomor ${queueToCall.number} untuk ${queueToCall.service}`,
      });
    } catch (error) {
      console.error('Error calling number:', error);
      toast({
        title: "Error",
        description: "Gagal memanggil nomor antrian",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    const zonedDate = toZonedTime(date, TIME_ZONE);
    return format(zonedDate, 'HH:mm:ss');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Sistem Manajemen Antrian
        </h1>

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
              {todayQueues.map((queue) => (
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
                      onClick={() => callNumber(queue.id)}
                      disabled={queue.status === "called"}
                      variant={queue.status === "called" ? "outline" : "default"}
                    >
                      {queue.status === "called" ? "Sudah Dipanggil" : "Panggil Nomor"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Riwayat Antrian</h2>
          {Object.entries(queuesByDay).map(([date, queues]) => (
            <div key={date} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{format(new Date(date), 'dd MMMM yyyy')}</h3>
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
          ))}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
