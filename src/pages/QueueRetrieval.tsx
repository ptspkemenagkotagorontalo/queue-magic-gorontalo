import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
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
  Printer,
} from "lucide-react";

const services = [
  { id: "tata-usaha", name: "Tata Usaha", icon: Briefcase },
  { id: "madrasah", name: "Pendidikan Madrasah", icon: School },
  { id: "pontren", name: "Diniyah dan Pontren", icon: BookOpen },
  { id: "pai", name: "P.A.I", icon: GraduationCap },
  { id: "haji", name: "Layanan Haji", icon: Heart },
  { id: "bimas", name: "Bimas Islam", icon: Users },
  { id: "zakat", name: "Zakat", icon: Landmark },
  { id: "wakaf", name: "Wakaf", icon: Building2 },
  { id: "others", name: "Lainnya", icon: LayoutGrid },
];

const QueueRetrieval = () => {
  const [selectedService, setSelectedService] = useState("");
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const { toast } = useToast();

  const generateQueueNumber = (serviceId: string) => {
    setSelectedService(serviceId);
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setQueueNumber(newNumber);
    toast({
      title: "Nomor Antrian Dibuat",
      description: `Nomor antrian Anda adalah ${newNumber} untuk layanan ${
        services.find((s) => s.id === serviceId)?.name
      }`,
    });
  };

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: 'Courier New', monospace; text-align: center; padding: 20px;">
        <h2 style="margin: 0;">Kementerian Agama</h2>
        <h3 style="margin: 5px 0;">Kota Gorontalo</h3>
        <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
        <h1 style="font-size: 48px; margin: 10px 0;">${queueNumber}</h1>
        <p style="margin: 5px 0;">${services.find((s) => s.id === selectedService)?.name}</p>
        <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
        <small>${new Date().toLocaleString('id-ID')}</small>
      </div>
    `;

    const printWindow = window.open('', '', 'width=300,height=400');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Navigation />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Kementerian Agama
          </h1>
          <p className="text-xl text-gray-600">Kota Gorontalo</p>
        </div>

        {!queueNumber ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Pilih Layanan
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
              Nomor Antrian Anda
            </h2>
            <div className="text-8xl font-mono font-bold text-primary mb-6">
              {queueNumber}
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Layanan:{" "}
              {services.find((s) => s.id === selectedService)?.name}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setQueueNumber(null);
                  setSelectedService("");
                }}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Ambil Nomor Baru
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Cetak Nomor
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QueueRetrieval;