"use client";

import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

export function LoadingState() {
  return (
    <Stack spacing={2}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Skeleton height={22} width="45%" />
          <Skeleton height={94} width="55%" />
          <Stack direction="row" spacing={1}>
            <Skeleton height={36} width={96} />
            <Skeleton height={36} width={136} />
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, 1fr)" },
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton width="65%" />
              <Skeleton height={42} width="50%" />
              <Skeleton width="45%" />
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton width="45%" />
              <Skeleton height={260} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
