import React from "react";
import { Box, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";

const PageHeader = ({
  title,
  description,
  icon: Icon,
  children,
  gradient = "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        background: gradient,
        color: "white",
        borderRadius: { xs: 0, sm: 3 },
        mx: { xs: -2, sm: 0 },
        mt: { xs: -2, sm: 0 },
        mb: 3,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {Icon && (
            <Box
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              }}
            >
              <Icon sx={{ fontSize: { xs: 28, sm: 32 }, color: "white" }} />
            </Box>
          )}
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              fontWeight={700}
              sx={{
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Action Buttons Area */}
        {children}
      </Box>
    </Paper>
  );
};

export default PageHeader;
