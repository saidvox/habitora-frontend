// src/feature/dashboard/components/OccupancyChart.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@/components/theme-provider";
import type { OcupacionPiso } from "../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OccupancyChartProps {
  data: OcupacionPiso[];
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = data.map((item) => item.pisoCodigo);
  const ocupadas = data.map((item) => item.ocupadas);
  const disponibles = data.map((item) => item.disponibles);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Ocupadas",
        data: ocupadas,
        backgroundColor: isDark ? "rgba(99, 102, 241, 0.8)" : "rgba(99, 102, 241, 0.9)",
        borderColor: isDark ? "rgba(99, 102, 241, 1)" : "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Disponibles",
        data: disponibles,
        backgroundColor: isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(203, 213, 225, 0.8)",
        borderColor: isDark ? "rgba(148, 163, 184, 0.8)" : "rgba(148, 163, 184, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0.9)",
          font: { size: 12, weight: "500" },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.95)",
        bodyColor: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(15, 23, 42, 0.85)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          lineWidth: 1,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)",
          font: { size: 11 },
        },
        border: { color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)",
          font: { size: 11, weight: "500" },
        },
        border: { color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
      },
    },
    animation: {
      duration: 800,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ocupación por Piso</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución de habitaciones ocupadas y disponibles
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ height: "350px", position: "relative" }}>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
