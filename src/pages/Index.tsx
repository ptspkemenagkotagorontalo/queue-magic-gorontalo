const Index = () => {
  const services = [
    { id: 1, name: "Tata Usaha", color: "bg-blue-500" },
    { id: 2, name: "Pendidikan Madrasah", color: "bg-emerald-500" },
    { id: 3, name: "Diniyah dan Pontren", color: "bg-amber-500" },
    { id: 4, name: "P.A.I", color: "bg-purple-500" },
    { id: 5, name: "Layanan Haji", color: "bg-rose-500" },
    { id: 6, name: "Bimas Islam", color: "bg-cyan-500" },
    { id: 7, name: "Zakat", color: "bg-indigo-500" },
    { id: 8, name: "Wakaf", color: "bg-teal-500" },
    { id: 9, name: "Lainnya", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Sistem Antrian Kementerian Agama Kota Gorontalo
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`${service.color} hover:scale-105 transform transition-all duration-200 rounded-xl shadow-lg`}
            >
              <div className="p-6 h-full flex items-center justify-center">
                <h2 className="text-xl font-semibold text-white text-center">
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