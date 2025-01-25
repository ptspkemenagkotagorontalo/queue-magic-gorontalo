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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Tampilan Antrian
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <div
              key={queue.id}
              className={`p-6 rounded-lg bg-gradient-to-br ${
                queue.status === "waiting"
                  ? "from-blue-500/20 to-blue-600/20 border border-blue-500/30"
                  : "from-green-500/20 to-green-600/20 border border-green-500/30"
              } backdrop-blur-sm`}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Nomor Antrian: {queue.number}
              </h2>
              <p className="text-gray-300 text-lg">Layanan: {queue.service}</p>
              <p className="text-gray-300 text-lg">
                Status: {queue.status === "waiting" ? "Menunggu" : "Dipanggil"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;