import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { addQueueNumber, getNextQueueNumber } from "@/lib/firestore";
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

  const generateQueueNumber = async (serviceId: string) => {
    try {
      setSelectedService(serviceId);
      // Get the next number for this service
      const nextNumber = await getNextQueueNumber(serviceId);
      
      // Add the queue to Firestore
      await addQueueNumber({
        number: nextNumber,
        service: services.find((s) => s.id === serviceId)?.name || serviceId,
        status: "waiting"
      });

      setQueueNumber(nextNumber);
      
      toast({
        title: "Nomor Antrian Dibuat",
        description: `Nomor antrian Anda adalah ${nextNumber} untuk layanan ${
          services.find((s) => s.id === serviceId)?.name
        }`,
      });
    } catch (error) {
      console.error('Error generating queue number:', error);
      toast({
        title: "Error",
        description: "Gagal membuat nomor antrian. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: 'Courier New', monospace; text-align: center; padding: 10px; width: 300px;">
        <div style="font-size: 14px; font-weight: bold;">KEMENAG KOTA GORONTALO</div>
        <div style="border-top: 1px dashed #000; margin: 5px 0;"></div>
        <div style="font-size: 36px; font-weight: bold; margin: 5px 0;">${queueNumber}</div>
        <div style="font-size: 12px;">${services.find((s) => s.id === selectedService)?.name}</div>
        <div style="border-top: 1px dashed #000; margin: 5px 0;"></div>
        <div style="font-size: 10px;">${new Date().toLocaleString('id-ID')}</div>
      </div>
    `;

    const printWindow = window.open('', '', 'width=300,height=300');
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
