// src/feature/dashboard/components/IncomeChart.tsx

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
import type { IngresoMensual } from "../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface IncomeChartProps {
  data: IngresoMensual[];
}

export function IncomeChart({ data }: IncomeChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = data.map((item) => item.mesNombre.split(" ")[0]);
  const montos = data.map((item) => item.monto);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: montos,
        backgroundColor: isDark
          ? "rgba(16, 185, 129, 0.8)"
          : "rgba(16, 185, 129, 0.9)",
        borderColor: isDark
          ? "rgba(16, 185, 129, 1)"
          : "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: isDark
          ? "rgba(16, 185, 129, 1)"
          : "rgba(16, 185, 129, 1)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `Ingresos: S/ ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)",
          font: { size: 11, weight: "500" },
        },
        border: { color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          lineWidth: 1,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)",
          font: { size: 11 },
          callback: (value) => `S/ ${value}`,
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <p className="text-sm text-muted-foreground">
          Evolución de ingresos en los últimos 6 meses
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
