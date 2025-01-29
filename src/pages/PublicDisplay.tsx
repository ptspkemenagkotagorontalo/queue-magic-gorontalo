import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { getTodayQueues } from "@/lib/firestore";
import { useQuery } from "@tanstack/react-query";
import { Queue } from "@/lib/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const PublicDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: queues = [], isLoading } = useQuery({
    queryKey: ['todayQueues'],
    queryFn: getTodayQueues,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Service color mapping
  const serviceColors: { [key: string]: string } = {
    "Tata Usaha": "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    "Pendidikan Madrasah": "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    "P.A.I": "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    "Haji & Umrah": "from-amber-500/20 to-amber-600/20 border-amber-500/30",
    "Bimas Islam": "from-rose-500/20 to-rose-600/20 border-rose-500/30",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Memuat data antrian...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-6xl mx-auto p-8 w-full">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Sistem Antrian PTSP Kantor Kementerian Agama Kota Gorontalo
        </h1>
        
        <div className="text-xl text-gray-300 mb-8 text-center">
          {format(currentTime, "EEEE, dd MMMM yyyy - HH:mm:ss", { locale: id })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <div
              key={queue.id}
              className={`p-6 rounded-lg bg-gradient-to-br ${
                serviceColors[queue.service] || "from-gray-500/20 to-gray-600/20 border-gray-500/30"
              } backdrop-blur-sm border`}
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
      
      <footer className="text-center py-4 text-gray-400 bg-black/20 backdrop-blur-sm">
        Tolopani 2025
      </footer>
    </div>
  );
};

export default PublicDisplay;