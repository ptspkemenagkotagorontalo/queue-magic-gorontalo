import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const services = [
  { id: "tata-usaha", name: "Tata Usaha", color: "bg-[#9b87f5] hover:bg-[#7E69AB]" },
  { id: "pendidikan-madrasah", name: "Pendidikan Madrasah", color: "bg-[#F97316] hover:bg-[#EA580C]" },
  { id: "pontren-pd", name: "Diniyah dan Pontren", color: "bg-[#0EA5E9] hover:bg-[#0284C7]" },
  { id: "pai", name: "P.A.I", color: "bg-[#8B5CF6] hover:bg-[#7C3AED]" },
  { id: "haji-umrah", name: "Layanan Haji", color: "bg-[#D946EF] hover:bg-[#C026D3]" },
  { id: "bimas-islam", name: "Bimas Islam", color: "bg-[#F97316] hover:bg-[#EA580C]" },
  { id: "zakat", name: "Zakat", color: "bg-[#0EA5E9] hover:bg-[#0284C7]" },
  { id: "wakaf", name: "Wakaf", color: "bg-[#8B5CF6] hover:bg-[#7C3AED]" },
  { id: "lainnya", name: "Lainnya", color: "bg-[#D946EF] hover:bg-[#C026D3]" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="container px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Sistem Antrian Kementerian Agama Kota Gorontalo
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.id} to={`/queue/${service.id}`}>
              <Card className={`${service.color} transform hover:scale-105 transition-all duration-300 cursor-pointer h-40 flex items-center justify-center shadow-lg`}>
                <h2 className="text-xl font-semibold text-white px-4 text-center">
                  {service.name}
                </h2>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;