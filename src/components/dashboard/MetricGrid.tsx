"use client";

import ChurchRoundedIcon from "@mui/icons-material/ChurchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import { Box } from "@mui/material";
import type { DashboardMetrics } from "@/types/metrics";
import { MetricCard } from "./MetricCard";

type MetricGridProps = {
  metrics: DashboardMetrics;
};

export function MetricGrid({ metrics }: MetricGridProps) {
  const items = [
    {
      label: "Igreja com mais inscritos",
      value: metrics.topChurch,
      helper: "maior grupo representado",
      icon: <ChurchRoundedIcon color="primary" fontSize="small" />,
    },
    {
      label: "Lideres Rede Move",
      value: metrics.moveLeaderCount,
      helper: "respostas marcadas como Sim",
      icon: <GroupsRoundedIcon color="primary" fontSize="small" />,
    },
    {
      label: "Percentual de lideres",
      value: `${metrics.moveLeaderPercent}%`,
      helper: "sobre o total de inscritos",
      icon: <PercentRoundedIcon color="primary" fontSize="small" />,
    },
    {
      label: "Igrejas representadas",
      value: metrics.representedChurches,
      helper: "igrejas com resposta informada",
      icon: <ChurchRoundedIcon color="primary" fontSize="small" />,
    },
    {
      label: "Igrejas sem inscrições",
      value: metrics.missingChurches.length,
      helper: "sem respostas ate agora",
      icon: <ChurchRoundedIcon color="primary" fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: {
          xs: "repeat(auto-fit, minmax(150px, 1fr))",
          md: "repeat(5, 1fr)",
        },
      }}
    >
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </Box>
  );
}
