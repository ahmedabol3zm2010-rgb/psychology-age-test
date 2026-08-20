import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import type { ConnersDataPoint } from '../data/conners-chart-data';
import '../components/conners-chart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ConnersProfileChartProps {
  data: ConnersDataPoint[];
  title?: string;
}

function getClassificationColor(classification: ConnersDataPoint['classification']): string {
  switch (classification) {
    case 'مرتفع جداً':
      return '#dc2626'; // red-600
    case 'مرتفع':
      return '#f97316'; // orange-500
    case 'فوق المتوسط':
      return '#eab308'; // yellow-500
    case 'متوسط':
      return '#22c55e'; // green-500
    case 'أقل من المتوسط':
      return '#3b82f6'; // blue-500
    case 'منخفض':
      return '#6366f1'; // indigo-500
    default:
      return '#6b7280'; // gray-500
  }
}

export default function ConnersProfileChart({ data, title = 'الرسم البياني لتقرير كونرز' }: ConnersProfileChartProps) {
  const chartData = useMemo(() => ({
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'الدرجة التائية',
        data: data.map((d) => d.tScore),
        backgroundColor: data.map((d) => getClassificationColor(d.classification)),
        borderColor: data.map((d) => getClassificationColor(d.classification)),
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
          weight: 'bold' as const,
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
        },
        color: '#f1f5f9',
        padding: { bottom: 20 },
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl' as const,
        titleFont: {
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          size: 13,
        },
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const item = data[ctx.dataIndex];
            return `الدرجة التائية: ${item.tScore} — التصنيف: ${item.classification}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#94a3b8',
          font: { size: 12 },
          stepSize: 10,
        },
        grid: {
          color: 'rgba(148,163,184,0.15)',
        },
        title: {
          display: true,
          text: 'الدرجة التائية (T-Score)',
          color: '#cbd5e1',
          font: {
            size: 14,
            family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          },
        },
      },
      x: {
        ticks: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  }), [data, title]);

  return (
    <div className="conners-chart-wrapper">
      <div className="conners-chart-container">
        <Bar data={chartData} options={options} />
      </div>
      <div className="conners-chart-legend">
        {(['مرتفع جداً', 'مرتفع', 'فوق المتوسط', 'متوسط', 'أقل من المتوسط', 'منخفض'] as const).map((cls) => (
          <div key={cls} className="conners-legend-item">
            <span
              className="conners-legend-dot"
              style={{ backgroundColor: getClassificationColor(cls) }}
            />
            <span className="conners-legend-label">{cls}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
