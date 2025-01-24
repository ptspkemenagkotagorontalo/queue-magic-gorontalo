import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Queue {
  id: number;
  number: number;
  service: string;
  status: "waiting" | "called";
  createdAt: Date;
}

const AdminDashboard = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const { toast } = useToast();

  // Function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Initialize queues with today's date
  useEffect(() => {
    const initialQueues: Queue[] = [
      { id: 1, number: 1, service: "Tata Usaha", status: "waiting" as const, createdAt: new Date() },
      { id: 2, number: 2, service: "Pendidikan Madrasah", status: "waiting" as const, createdAt: new Date() },
      { id: 3, number: 3, service: "P.A.I", status: "waiting" as const, createdAt: new Date() },
    ];
    setQueues(initialQueues);
  }, []);

  // Reset numbers if it's a new day
  useEffect(() => {
    const checkAndResetNumbers = () => {
      const hasOldNumbers = queues.some(queue => !isToday(queue.createdAt));
      if (hasOldNumbers) {
        setQueues([]);
      }
    };

    // Check every minute
    const interval = setInterval(checkAndResetNumbers, 60000);
    return () => clearInterval(interval);
  }, [queues]);

  const callNumber = (id: number) => {
    setQueues((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "called" as const } : q
      )
    );

    const queue = queues.find((q) => q.id === id);
    if (queue) {
      const announcement = `Nomor antrian ${queue.number} untuk layanan ${queue.service}, silakan menuju ke loket`;
      
      const speech = new SpeechSynthesisUtterance(announcement);
      speech.lang = 'id-ID';
      window.speechSynthesis.speak(speech);

      toast({
        title: "Nomor Antrian Dipanggil",
        description: `Memanggil nomor ${queue.number} untuk ${queue.service}`,
      });
    }
  };

  // Get only today's queues
  const todayQueues = queues.filter(queue => isToday(queue.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Antrian Aktif</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Antrian</TableHead>
                <TableHead>Layanan</TableHead>
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
                      Panggil Nomor
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
