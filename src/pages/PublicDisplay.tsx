import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

const PublicDisplay = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    // Simulate fetching queue data
    const fetchQueues = () => {
      const today = new Date();
      const initialQueues = [
        { id: 1, number: 1, service: "Tata Usaha", status: "waiting", createdAt: today },
        { id: 2, number: 2, service: "Pendidikan Madrasah", status: "called", createdAt: today },
        { id: 3, number: 3, service: "P.A.I", status: "waiting", createdAt: today },
      ];
      setQueues(initialQueues);
    };

    fetchQueues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Tampilan Antrian
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <div key={queue.id} className="p-6 border rounded-lg bg-white shadow">
              <h2 className="text-xl font-semibold">Nomor Antrian: {queue.number}</h2>
              <p>Layanan: {queue.service}</p>
              <p>Status: {queue.status === "waiting" ? "Menunggu" : "Dipanggil"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;
