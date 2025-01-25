import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

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
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222222] to-[#1a1a1a] text-white p-8">
      <Navigation />
      <div className="max-w-7xl mx-auto mt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Tampilan Antrian
          </h1>
          <p className="text-gray-400 mt-2">
            Kementerian Agama Kota Gorontalo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <Card 
              key={queue.id} 
              className={`
                transform transition-all duration-300 hover:scale-105
                ${queue.status === "called" 
                  ? "bg-accent/10 border-accent/50" 
                  : "bg-secondary/10 border-secondary/50"}
              `}
            >
              <CardContent className="p-6 text-center">
                <div className="font-mono text-5xl font-bold mb-4">
                  {queue.number}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-200">
                  {queue.service}
                </h2>
                <p className={`
                  text-sm font-medium rounded-full px-3 py-1 inline-block
                  ${queue.status === "waiting" 
                    ? "bg-secondary/20 text-secondary" 
                    : "bg-accent/20 text-accent"}
                `}>
                  {queue.status === "waiting" ? "Menunggu" : "Dipanggil"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;