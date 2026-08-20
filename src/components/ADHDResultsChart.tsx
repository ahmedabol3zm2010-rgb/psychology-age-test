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
import { getScoreLevel, ALL_LEVELS } from '../data/scoreLevels';
import type { ResultRow } from '../types/adhd';
import './adhd-results-chart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ADHDResultsChartProps {
  results: ResultRow[];
}

interface ChartBarData {
  label: string;
  value: number | string | null;
}

export default function ADHDResultsChart({ results }: ADHDResultsChartProps) {
  const bars = useMemo<ChartBarData[]>(() => {
    return results.map((row) => ({
      label: row.measure,
      value: row.normativeScore,
    }));
  }, [results]);

  const chartData = useMemo(() => ({
    labels: bars.map((b) => b.label),
    datasets: [
      {
        label: 'الدرجة المعيارية',
        data: bars.map((b) => {
          const v = Number(b.value);
          return Number.isNaN(v) ? 0 : v;
        }),
        backgroundColor: bars.map((b) => getScoreLevel(b.value).color),
        borderColor: bars.map((b) => getScoreLevel(b.value).color),
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.65,
      },
    ],
  }), [bars]);

  const maxScore = useMemo(() => {
    const nums = bars
      .map((b) => Number(b.value))
      .filter((n) => !Number.isNaN(n) && n > 0);
    const highest = nums.length > 0 ? Math.max(...nums) : 50;
    return Math.ceil(highest / 10) * 10 + 10;
  }, [bars]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'الرسم البياني للدرجات المعيارية حسب مجالات ADHD-T',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
        },
        color: '#f1f5f9',
        padding: { bottom: 16 },
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl' as const,
        titleFont: {
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          size: 13,
        },
        bodyFont: {
          family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          size: 12,
        },
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const bar = bars[ctx.dataIndex];
            const level = getScoreLevel(bar.value);
            return `الدرجة المعيارية: ${bar.value} — ${level.label}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxScore,
        ticks: {
          color: '#94a3b8',
          font: { size: 12 },
          stepSize: 10,
        },
        grid: {
          color: 'rgba(148,163,184,0.12)',
        },
        title: {
          display: true,
          text: 'الدرجة المعيارية',
          color: '#cbd5e1',
          font: {
            size: 13,
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
        },
        grid: { display: false },
        title: {
          display: true,
          text: 'مجالات الاختبار',
          color: '#cbd5e1',
          font: {
            size: 13,
            family: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
          },
        },
      },
    },
  }), [bars, maxScore]);

  return (
    <div className="adhd-chart-wrapper">
      <div className="adhd-chart-container">
        <Bar data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div className="adhd-chart-legend">
        {ALL_LEVELS.map((lvl) => (
          <div key={lvl.label} className="adhd-legend-item">
            <span className="adhd-legend-dot" style={{ backgroundColor: lvl.color }} />
            <span className="adhd-legend-label">{lvl.label}</span>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="adhd-summary-table-wrapper">
        <table className="adhd-summary-table">
          <thead>
            <tr>
              <th>المجال</th>
              <th>الدرجة المعيارية</th>
              <th>المستوى</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((bar) => {
              const level = getScoreLevel(bar.value);
              return (
                <tr key={bar.label}>
                  <td className="adhd-table-label">{bar.label}</td>
                  <td className="adhd-table-score">{bar.value}</td>
                  <td>
                    <span
                      className="adhd-table-badge"
                      style={{ backgroundColor: level.color }}
                    >
                      {level.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <p className="adhd-chart-disclaimer">
        الرسم البياني توضيحي لعرض الدرجات المعيارية، ولا يُعد تشخيصًا طبيًا نهائيًا.
        يجب تفسير النتائج بواسطة مختص مؤهل.
      </p>
    </div>
  );
}
