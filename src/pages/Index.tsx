import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const services = [
    { id: 1, name: "Tata Usaha", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { id: 2, name: "Pendidikan Madrasah", color: "bg-gradient-to-br from-emerald-400 to-emerald-500" },
    { id: 3, name: "Diniyah dan Pontren", color: "bg-gradient-to-br from-amber-400 to-amber-500" },
    { id: 4, name: "P.A.I", color: "bg-gradient-to-br from-purple-400 to-purple-500" },
    { id: 5, name: "Layanan Haji", color: "bg-gradient-to-br from-rose-400 to-rose-500" },
    { id: 6, name: "Bimas Islam", color: "bg-gradient-to-br from-cyan-400 to-cyan-500" },
    { id: 7, name: "Zakat", color: "bg-gradient-to-br from-indigo-400 to-indigo-500" },
    { id: 8, name: "Wakaf", color: "bg-gradient-to-br from-teal-400 to-teal-500" },
    { id: 9, name: "Lainnya", color: "bg-gradient-to-br from-orange-400 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Sistem Antrian Kementerian Agama Kota Gorontalo
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`${service.color} hover:scale-105 transform transition-all duration-200 rounded-xl shadow-lg group`}
            >
              <div className="p-6 h-full flex items-center justify-center backdrop-blur-sm backdrop-brightness-110 rounded-xl">
                <h2 className="text-xl font-semibold text-white text-center group-hover:scale-105 transition-transform duration-200">
                  {service.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;