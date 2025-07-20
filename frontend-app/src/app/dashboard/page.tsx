"use client";
import { useDashboardSummary } from "../../hooks/use-dashboard-summary";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) return <div>Caricamento...</div>;
  if (error) return <div>Errore nel caricamento dei dati.</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Prodotti Totali</h2>
          <p className="text-3xl font-bold text-blue-600">
            {data?.totalProducts || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Vendite Previste Totali
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {data?.totalForecastedSales || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
