import { useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { SLDetailContext } from "./SLDetailProvider";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

function ItemChart() {
  const { data } = useContext(SLDetailContext);
  const theme = useTheme();
  const { t } = useTranslation();

  const resolvedItems = data?.itemList.filter((item) => item.resolved) || [];
  const unresolvedItems = data?.itemList.filter((item) => !item.resolved) || [];

  const chartData = [
    { name: t("itemList.resolved"), value: resolvedItems.length },
    { name: t("itemList.unresolved"), value: unresolvedItems.length },
  ];

  const COLORS = [`url(#colorResolved)`, `url(#colorUnresolved)`];

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <defs>
            <radialGradient
              id="colorResolved"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="10%" stopColor={theme.palette.success.light} />
              <stop offset="90%" stopColor={theme.palette.success.main} />
            </radialGradient>
            <radialGradient
              id="colorUnresolved"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="10%" stopColor={theme.palette.error.light} />
              <stop offset="90%" stopColor={theme.palette.error.main} />
            </radialGradient>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ItemChart;
