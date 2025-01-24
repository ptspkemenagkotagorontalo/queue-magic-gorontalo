import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Briefcase,
  Building2,
  GraduationCap,
  Heart,
  Landmark,
  LayoutGrid,
  School,
  Users,
} from "lucide-react";

const services = [
  { id: "tata-usaha", name: "Administration", icon: Briefcase },
  { id: "madrasah", name: "Madrasah Education", icon: School },
  { id: "pontren", name: "Pontren PD", icon: BookOpen },
  { id: "pai", name: "PAI", icon: GraduationCap },
  { id: "haji", name: "Hajj and Umrah", icon: Heart },
  { id: "bimas", name: "Bimas Islam", icon: Users },
  { id: "zakat", name: "Zakat", icon: Landmark },
  { id: "wakaf", name: "Wakaf", icon: Building2 },
  { id: "others", name: "Others", icon: LayoutGrid },
];

const QueueRetrieval = () => {
  const [selectedService, setSelectedService] = useState("");
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const { toast } = useToast();

  const generateQueueNumber = (serviceId: string) => {
    setSelectedService(serviceId);
    const newNumber = Math.floor(Math.random() * 100) + 1; // For demo purposes
    setQueueNumber(newNumber);
    toast({
      title: "Queue Number Generated",
      description: `Your queue number is ${newNumber} for ${
        services.find((s) => s.id === serviceId)?.name
      }`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Ministry of Religious Affairs
          </h1>
          <p className="text-xl text-gray-600">Gorontalo City</p>
        </div>

        {!queueNumber ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Select a Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-primary hover:text-white transition-colors"
                  onClick={() => generateQueueNumber(service.id)}
                >
                  <service.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{service.name}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Queue Number
            </h2>
            <div className="text-8xl font-mono font-bold text-primary mb-6">
              {queueNumber}
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Service:{" "}
              {services.find((s) => s.id === selectedService)?.name}
            </p>
            <Button
              onClick={() => {
                setQueueNumber(null);
                setSelectedService("");
              }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Get Another Number
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QueueRetrieval;