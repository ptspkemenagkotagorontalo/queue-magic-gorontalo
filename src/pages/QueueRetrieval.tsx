import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const services = [
  { id: "tata-usaha", name: "Tata Usaha" },
  { id: "pendidikan-madrasah", name: "Pendidikan Madrasah" },
  { id: "diniyah-pontren", name: "Diniyah dan Pontren" },
  { id: "pai", name: "P.A.I" },
  { id: "haji", name: "Layanan Haji" },
  { id: "bimas-islam", name: "Bimas Islam" },
  { id: "zakat", name: "Zakat" },
  { id: "wakaf", name: "Wakaf" },
  { id: "lainnya", name: "Lainnya" },
];

const QueueRetrieval = () => {
  const [selectedService, setSelectedService] = useState("");
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGetNumber = () => {
    if (!selectedService) {
      toast({
        title: "Pilih Layanan",
        description: "Silakan pilih jenis layanan terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // Simulate queue number generation
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setQueueNumber(newNumber);
  };

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: 'Courier New', monospace; text-align: center; padding: 20px;">
        <h2 style="margin: 0;">KEMENTERIAN AGAMA</h2>
        <h3 style="margin: 5px 0;">KOTA GORONTALO</h3>
        <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
        <p style="margin: 5px 0;">Nomor Antrian:</p>
        <h1 style="font-size: 48px; margin: 10px 0;">${queueNumber}</h1>
        <p style="margin: 5px 0;">Layanan:</p>
        <h3 style="margin: 5px 0;">${services.find(s => s.id === selectedService)?.name}</h3>
        <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
        <p style="font-size: 12px;">${new Date().toLocaleString('id-ID')}</p>
      </div>
    `;

    const printWindow = window.open('', '', 'width=300,height=400');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F0FB] to-[#E6E9F0] p-8">
      <Navigation />
      <div className="max-w-4xl mx-auto mt-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Sistem Antrian
            </CardTitle>
            <p className="text-muted-foreground">
              Kementerian Agama Kota Gorontalo
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-md mx-auto">
              <Select onValueChange={setSelectedService} value={selectedService}>
                <SelectTrigger className="w-full text-lg">
                  <SelectValue placeholder="Pilih Layanan" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-base">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!queueNumber ? (
              <Button
                onClick={handleGetNumber}
                className="w-full max-w-md mx-auto h-12 text-lg bg-primary hover:bg-primary/90"
              >
                Ambil Nomor Antrian
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-secondary/10 p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-2">Nomor Antrian Anda</h2>
                  <div className="font-mono text-6xl font-bold text-primary">
                    {queueNumber}
                  </div>
                  <p className="mt-2 text-lg text-muted-foreground">
                    {services.find(s => s.id === selectedService)?.name}
                  </p>
                </div>
                <Button
                  onClick={handlePrint}
                  className="bg-accent hover:bg-accent/90"
                >
                  Cetak Nomor Antrian
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueRetrieval;