// TrendAnalysisChart.tsx
import React, { useEffect, useRef } from 'react';
import '../Admin.module.css/AIMonitoring.css'

interface TrendAnalysisChartProps {
  data: {
    labels: string[];
    smog: number[];
    pollen: number[];
  };
}

const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 250;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width - 60;
    const height = canvas.height - 50;
    const startX = 40;
    const startY = 20;

    const maxValue = Math.max(...data.smog, ...data.pollen) + 50;
    const stepX = width / (data.labels.length - 1);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = startY + (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + width, y);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter';
      ctx.fillText(Math.round(maxValue - (maxValue / 4) * i).toString(), startX - 30, y + 3);
    }

    // Draw X labels
    data.labels.forEach((label, i) => {
      const x = startX + i * stepX;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter';
      ctx.fillText(label, x - 15, canvas.height - 12);
    });

    // Draw lines
    const drawLine = (values: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      values.forEach((value, i) => {
        const x = startX + i * stepX;
        const y = startY + height - (value / maxValue) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawLine(data.smog, '#f59e0b');
    drawLine(data.pollen, '#8b5cf6');

    // Fill area under smog
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.beginPath();
    data.smog.forEach((value, i) => {
      const x = startX + i * stepX;
      const y = startY + height - (value / maxValue) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(startX + width, startY + height);
    ctx.lineTo(startX, startY + height);
    ctx.fill();
  }, [data]);

  return (
    <div className="trend-chart-container">
      <div className="section-header">
        <h3 className="section-title">📈 24-Hour Trend Analysis</h3>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot smog"></span>Smog (AQI)</span>
          <span className="legend-item"><span className="legend-dot pollen"></span>Pollen Count</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="trend-canvas"></canvas>
    </div>
  );
};

export default TrendAnalysisChart;