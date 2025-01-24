import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface QueueDisplay {
  number: number;
  service: string;
  status: "waiting" | "called";
}

const PublicDisplay = () => {
  const [currentQueues, setCurrentQueues] = useState<QueueDisplay[]>([
    { number: 1, service: "Administration", status: "waiting" },
    { number: 2, service: "Madrasah Education", status: "called" },
    { number: 3, service: "PAI", status: "waiting" },
    { number: 4, service: "Hajj and Umrah", status: "waiting" },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentQueues((prev) => {
        const newQueues = [...prev];
        const randomIndex = Math.floor(Math.random() * newQueues.length);
        if (newQueues[randomIndex].status === "waiting") {
          newQueues[randomIndex] = {
            ...newQueues[randomIndex],
            status: "called",
          };
        }
        return newQueues;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Current Queue Status
          </h1>
          <p className="text-xl text-gray-600">
            Ministry of Religious Affairs - Gorontalo City
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentQueues.map((queue, index) => (
            <Card
              key={index}
              className={`p-6 ${
                queue.status === "called"
                  ? "bg-green-50 border-green-200"
                  : "bg-white"
              } animate-fade-in`}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{queue.service}</h3>
                <div
                  className={`text-6xl font-mono font-bold mb-4 ${
                    queue.status === "called"
                      ? "text-green-600"
                      : "text-primary"
                  }`}
                >
                  {queue.number}
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    queue.status === "waiting"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {queue.status.toUpperCase()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;