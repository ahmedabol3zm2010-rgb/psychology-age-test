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
  type Chart as ChartType,
  type Plugin,
} from 'chart.js';
import { getBarLabel, ALL_LEVELS } from '../data/scoreLevels';
import type { ResultRow } from '../types/adhd';
import './adhd-results-chart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Plugin: draw score + interpretation above each bar
 * (mirrors the C# point.Label = $"{score}\n({interpretation})")
 */
const dataLabelsPlugin: Plugin<'bar'> = {
  id: 'adhdDataLabels',
  afterDatasetsDraw(chart: ChartType<'bar'>) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (value === null || value === undefined || value === 0) return;

        // Access the bar info we stashed on the dataset
        const barInfos = (dataset as unknown as { barInfos?: Array<{ value: string; interpretation: string }> }).barInfos;
        const info = barInfos?.[index];

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        if (info) {
          // Line 1: score
          ctx.font = 'bold 13px "Segoe UI", "Noto Sans Arabic", sans-serif';
          ctx.fillStyle = '#f1f5f9';
          ctx.fillText(info.value, element.x, (element as { y: number }).y - 28);

          // Line 2: interpretation in parentheses
          ctx.font = 'italic 11px "Segoe UI", "Noto Sans Arabic", sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(`(${info.interpretation})`, element.x, (element as { y: number }).y - 10);
        } else {
          ctx.font = 'bold 13px "Segoe UI", "Noto Sans Arabic", sans-serif';
          ctx.fillStyle = '#f1f5f9';
          ctx.fillText(String(value), element.x, (element as { y: number }).y - 8);
        }

        ctx.restore();
      });
    });
  },
};

/**
 * Plugin: draw a green horizontal strip for the "average range" (8-12)
 * (mirrors the C# StripLine at IntervalOffset=8, StripWidth=4)
 */
const averageStripPlugin: Plugin<'bar'> = {
  id: 'averageStrip',
  beforeDraw(chart: ChartType<'bar'>) {
    const yScale = chart.scales.y;
    if (!yScale) return;

    const yTop = yScale.getPixelForValue(12);
    const yBottom = yScale.getPixelForValue(8);

    const { ctx } = chart;
    ctx.save();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
    ctx.fillRect(chart.chartArea.left, yTop, chart.chartArea.right - chart.chartArea.left, yBottom - yTop);

    // Label on the right side of the strip
    ctx.font = 'italic 10px "Segoe UI", "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('نطاق المتوسط (8 - 12)', chart.chartArea.right - 4, (yTop + yBottom) / 2);
    ctx.restore();
  },
};

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

  const barInfos = useMemo(() => {
    return bars.map((b) => getBarLabel(b.value));
  }, [bars]);

  const chartData = useMemo(() => ({
    labels: bars.map((b) => b.label),
    datasets: [
      {
        label: 'الدرجة المعيارية',
        data: bars.map((b) => {
          const v = Number(b.value);
          return Number.isNaN(v) ? 0 : v;
        }),
        backgroundColor: barInfos.map((info) => info.color),
        borderColor: barInfos.map((info) => info.color),
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
        barInfos,
      },
    ],
  }), [bars, barInfos]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'نتائج اختبار ADHDT - الدرجات المعيارية',
        font: {
          size: 15,
          weight: 'bold' as const,
          family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
        },
        color: '#e2e8f0',
        padding: { bottom: 14 },
      },
      tooltip: {
        rtl: true,
        textDirection: 'rtl' as const,
        titleFont: {
          family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
          size: 13,
        },
        bodyFont: {
          family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
          size: 12,
        },
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const info = barInfos[ctx.dataIndex];
            return `الدرجة المعيارية: ${info.value} — ${info.interpretation}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 20,
        ticks: {
          color: '#94a3b8',
          font: { size: 12 },
          stepSize: 2,
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
            family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
          },
        },
      },
      x: {
        ticks: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
          },
        },
        grid: { display: false },
        title: {
          display: true,
          text: 'الأبعاد والدرجة الكلية',
          color: '#cbd5e1',
          font: {
            size: 13,
            family: "'Segoe UI', 'Noto Sans Arabic', Tahoma, sans-serif",
          },
        },
      },
    },
  }), [barInfos]);

  return (
    <div className="adhd-chart-wrapper">
      <div className="adhd-chart-container">
        <Bar data={chartData} options={options} plugins={[averageStripPlugin, dataLabelsPlugin]} />
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
              <th>التفسير</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((bar, i) => (
              <tr key={bar.label}>
                <td className="adhd-table-label">{bar.label}</td>
                <td className="adhd-table-score">{barInfos[i].value}</td>
                <td>
                  <span
                    className="adhd-table-badge"
                    style={{ backgroundColor: barInfos[i].color }}
                  >
                    {barInfos[i].interpretation}
                  </span>
                </td>
              </tr>
            ))}
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
