"use client";

import { Box, Chip } from "@mui/material";
import type { PeriodFilter } from "@/types/response";

const filters: { label: string; value: PeriodFilter }[] = [
  { label: "Hoje", value: "today" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "Tudo", value: "all" },
];

type FilterBarProps = {
  value: PeriodFilter;
  onChange: (value: PeriodFilter) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 0.5,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {filters.map((filter) => (
        <Chip
          clickable
          color={value === filter.value ? "primary" : "default"}
          key={filter.value}
          label={filter.label}
          onClick={() => onChange(filter.value)}
          variant={value === filter.value ? "filled" : "outlined"}
          sx={{ minHeight: 40, px: 0.5 }}
        />
      ))}
    </Box>
  );
}
