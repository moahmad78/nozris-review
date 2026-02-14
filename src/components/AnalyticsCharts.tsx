"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

type RatingData = {
    date: string;
    rating: number;
};

type SentimentData = {
    name: string;
    value: number;
    color: string;
};

export function RatingTrendChart({ data }: { data: RatingData[] }) {
    if (data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    domain={[0, 5]}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#4F46E5", strokeWidth: 2, stroke: "#fff" }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function SentimentPieChart({ data }: { data: SentimentData[] }) {
    if (data.every(d => d.value === 0)) return <div className="h-full flex items-center justify-center text-gray-400">No sentiment data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
}
