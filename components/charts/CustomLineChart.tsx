"use client";

import React, { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomLineChartProps {
  data: any[];
  dataKey: string;
  color?: string;
  label?: string;
}

function CustomLineChartComponent({
  data,
  dataKey,
  color = "#355441",
  label
}: CustomLineChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <Tooltip 
            content={({ active, payload, label: timeLabel }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1c1c1a] text-white p-3 rounded-xl shadow-lg text-sm">
                    <p className="text-zinc-400 mb-1">{timeLabel}</p>
                    <p className="font-bold">
                      {label}: {Number(payload[0].value).toFixed(1)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#gradient-${dataKey})`}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Custom comparator: only re-render if the last data point's time/value changes, or length changes
function propsAreEqual(prev: CustomLineChartProps, next: CustomLineChartProps) {
  if (prev.data.length !== next.data.length) return false;
  if (prev.dataKey !== next.dataKey || prev.color !== next.color || prev.label !== next.label) return false;
  
  const prevLast = prev.data[prev.data.length - 1];
  const nextLast = next.data[next.data.length - 1];
  
  if (!prevLast || !nextLast) return prevLast === nextLast;
  
  return prevLast.time === nextLast.time && prevLast[prev.dataKey] === nextLast[next.dataKey];
}

export const CustomLineChart = memo(CustomLineChartComponent, propsAreEqual);
