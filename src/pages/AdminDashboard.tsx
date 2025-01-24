import { useState } from "react";
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
}

const AdminDashboard = () => {
  const [queues, setQueues] = useState<Queue[]>([
    { id: 1, number: 1, service: "Administration", status: "waiting" },
    { id: 2, number: 2, service: "Madrasah Education", status: "waiting" },
    { id: 3, number: 3, service: "PAI", status: "waiting" },
  ]);

  const { toast } = useToast();

  const callNumber = (id: number) => {
    setQueues((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "called" as const } : q
      )
    );

    const queue = queues.find((q) => q.id === id);
    if (queue) {
      // Use speech synthesis
      const speech = new SpeechSynthesisUtterance(
        `Queue number ${queue.number} for ${queue.service}, please proceed to the counter`
      );
      window.speechSynthesis.speak(speech);

      toast({
        title: "Queue Number Called",
        description: `Called number ${queue.number} for ${queue.service}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Queue Management Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Waiting</h3>
            <p className="text-4xl font-bold text-primary">
              {queues.filter((q) => q.status === "waiting").length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Called</h3>
            <p className="text-4xl font-bold text-accent">
              {queues.filter((q) => q.status === "called").length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Today</h3>
            <p className="text-4xl font-bold text-secondary">
              {queues.length}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Queues</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queue Number</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues.map((queue) => (
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
                      {queue.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => callNumber(queue.id)}
                      disabled={queue.status === "called"}
                      variant={queue.status === "called" ? "outline" : "default"}
                    >
                      Call Number
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