import React, { useContext } from "react";
import {
  Card,
  CardContent,
  GridLegacy as Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeModeContext } from "../theme";

const ProgressChart = ({ analytics }) => {
  const { mode } = useContext(ThemeModeContext);
  const isDarkMode = mode === "dark";

  const safeAnalytics = {
    completion_percentage: 0,
    topics_completed: 0,
    total_sessions: 0,
    total_hours: 0,
    topic_progress: {},
    ...(analytics || {}),
  };

  const transformAnalyticsData = (analyticsData) => {
    try {
      const tp = analyticsData?.topic_progress;
      if (tp && typeof tp === 'object' && Object.keys(tp).length > 0) {
        return Object.entries(tp)
          .filter(([topic, progress]) => topic && progress && typeof progress === 'object')
          .map(([topic, progress]) => ({
            name: String(topic).substring(0, 20),
            completed: Number(progress.completed) || 0,
            remaining: Math.max(0, (Number(progress.total) || 0) - (Number(progress.completed) || 0)),
            total: Number(progress.total) || 0,
          }))
          .filter(item => item.total > 0);
      }
      return [];
    } catch (error) {
      console.error('Error transforming analytics data:', error);
      return [];
    }
  };

  const chartData = transformAnalyticsData(safeAnalytics);

  const completionPercentage = Math.min(100, Math.max(0, Number(safeAnalytics.completion_percentage) || 0));
  const topicsCompleted = Number(safeAnalytics.topics_completed) || 0;
  const totalSessions = Number(safeAnalytics.total_sessions) || 0;
  const totalHours = Number(safeAnalytics.total_hours) || 0;

  const pieCompleted = Math.max(0, topicsCompleted);
  const pieRemaining = completionPercentage === 100 ? 0 : Math.max(0, 1);
  const pieTotal = pieCompleted + pieRemaining;

  const pieData = [
    { name: "Completed", value: pieTotal > 0 ? pieCompleted : 0, color: "#10B981" },
    { name: "Remaining", value: pieTotal > 0 ? pieRemaining : 1, color: isDarkMode ? "#374151" : "#F3F4F6" },
  ];

  const avgTimePerTopic = totalSessions > 0
    ? Math.round((totalHours * 60) / totalSessions)
    : 0;

  // Theme-aware colors
  const cardGradients = {
    teal: isDarkMode 
      ? "linear-gradient(145deg, #134e4a 0%, #0d3f3a 100%)" 
      : "linear-gradient(145deg, #0f766e 0%, #0d9488 100%)",
    amber: isDarkMode 
      ? "linear-gradient(145deg, #78350f 0%, #54230f 100%)" 
      : "linear-gradient(145deg, #d97706 0%, #b45309 100%)",
    green: isDarkMode 
      ? "linear-gradient(145deg, #065f46 0%, #034e37 100%)" 
      : "linear-gradient(145deg, #059669 0%, #047857 100%)",
    cyan: isDarkMode 
      ? "linear-gradient(145deg, #0c4a6e 0%, #0a3c54 100%)" 
      : "linear-gradient(145deg, #0891b2 0%, #0e7490 100%)",
  };

  const cardBoxShadow = isDarkMode
    ? "0 8px 24px rgba(34, 197, 94, 0.1)"
    : "0 8px 24px rgba(15, 118, 110, 0.15)";

  const cardBorder = isDarkMode
    ? "1px solid rgba(34, 197, 94, 0.2)"
    : "1px solid rgba(15, 118, 110, 0.1)";

  const cardBackground = isDarkMode
    ? "rgba(10, 20, 15, 0.8)"
    : "#ffffff";

  const chartGridColor = isDarkMode ? "#374151" : "#e2e8f0";
  const chartAxisColor = isDarkMode ? "#9ca3af" : "#64748b";
  const chartAxisTextColor = isDarkMode ? "#d1d5db" : "#475569";
  const chartTooltipBg = isDarkMode ? "#1f2937" : "#ffffff";
  const chartTooltipBorder = isDarkMode ? "#4b5563" : "#cbd5e1";

  return (
    <Box className="progress-chart" sx={{
      mt: 0,
      width: "100%",
      maxWidth: "100%",
      overflow: "hidden",
      background: isDarkMode 
        ? "linear-gradient(135deg, #0a1f18 0%, #0f3d2f 50%, #0a2818 100%)" 
        : "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)",
      borderRadius: 3,
      p: { xs: 2, sm: 2.5, md: 3 }
    }}>
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Overall Stats */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            background: cardGradients.teal,
            height: "100%",
            minHeight: { xs: 180, md: 210 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            "&:hover": {
              boxShadow: isDarkMode 
                ? "0 12px 40px rgba(34, 197, 94, 0.2)" 
                : "0 12px 40px rgba(15, 118, 110, 0.25)",
              transform: "translateY(-4px)",
              border: isDarkMode 
                ? "1px solid rgba(34, 197, 94, 0.4)" 
                : "1px solid rgba(15, 118, 110, 0.2)"
            }
          }}>
            <CardContent sx={{ textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: { xs: 1.5, sm: 2 }, gap: 1.1 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: { xs: "0.62rem", sm: "0.72rem" }, lineHeight: 1.4 }}>
                📊 Overall Progress
              </Typography>
              <Box sx={{ position: "relative", display: "inline-flex", my: 0.5, mx: "auto" }}>
                <CircularProgress
                  variant="determinate"
                  value={completionPercentage}
                  size={80}
                  thickness={3.5}
                  sx={{
                    color: "#34d399",
                    filter: "drop-shadow(0 2px 8px rgba(52, 211, 153, 0.4))"
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h5" component="div" sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.2rem", sm: "1.35rem" }, lineHeight: 1.1 }}>
                    {Math.round(completionPercentage)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 600, mt: 0.25, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
                Topics mastered
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Sessions */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            background: cardGradients.amber,
            height: "100%",
            minHeight: { xs: 180, md: 210 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            "&:hover": {
              boxShadow: isDarkMode 
                ? "0 12px 40px rgba(34, 197, 94, 0.2)" 
                : "0 12px 40px rgba(245, 158, 11, 0.25)",
              transform: "translateY(-4px)",
              border: isDarkMode 
                ? "1px solid rgba(34, 197, 94, 0.4)" 
                : "1px solid rgba(245, 158, 11, 0.2)"
            }
          }}>
            <CardContent sx={{ textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: { xs: 1.5, sm: 2 }, gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: { xs: "0.62rem", sm: "0.72rem" }, lineHeight: 1.4 }}>
                ⏱️ Study Sessions
              </Typography>
              <Typography variant="h3" sx={{ my: 0.75, fontWeight: 800, color: "#fff", fontSize: { xs: "1.75rem", sm: "2rem" }, lineHeight: 1.1 }}>
                {totalSessions}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: { xs: "0.76rem", sm: "0.84rem" }, lineHeight: 1.4 }}>
                {totalHours}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 500, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
                total hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Topics Completed */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            background: cardGradients.green,
            height: "100%",
            minHeight: { xs: 180, md: 210 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            "&:hover": {
              boxShadow: isDarkMode 
                ? "0 12px 40px rgba(34, 197, 94, 0.2)" 
                : "0 12px 40px rgba(16, 185, 129, 0.25)",
              transform: "translateY(-4px)",
              border: isDarkMode 
                ? "1px solid rgba(34, 197, 94, 0.4)" 
                : "1px solid rgba(16, 185, 129, 0.2)"
            }
          }}>
            <CardContent sx={{ textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: { xs: 1.5, sm: 2 }, gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: { xs: "0.62rem", sm: "0.72rem" }, lineHeight: 1.4 }}>
                ✅ Topics Completed
              </Typography>
              <Typography variant="h3" sx={{ my: 0.75, fontWeight: 800, color: "#fff", fontSize: { xs: "1.75rem", sm: "2rem" }, lineHeight: 1.1 }}>
                {topicsCompleted}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: { xs: "0.76rem", sm: "0.84rem" }, lineHeight: 1.4 }}>
                out of
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 500, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
                total topics
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Per Topic */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            background: cardGradients.cyan,
            height: "100%",
            minHeight: { xs: 180, md: 210 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            "&:hover": {
              boxShadow: isDarkMode 
                ? "0 12px 40px rgba(34, 197, 94, 0.2)" 
                : "0 12px 40px rgba(6, 182, 212, 0.25)",
              transform: "translateY(-4px)",
              border: isDarkMode 
                ? "1px solid rgba(34, 197, 94, 0.4)" 
                : "1px solid rgba(6, 182, 212, 0.2)"
            }
          }}>
            <CardContent sx={{ textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: { xs: 1.5, sm: 2 }, gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: { xs: "0.62rem", sm: "0.72rem" }, lineHeight: 1.4 }}>
                ⏳ Avg Time/Topic
              </Typography>
              <Typography variant="h3" sx={{ my: 0.75, fontWeight: 800, color: "#fff", fontSize: { xs: "1.75rem", sm: "2rem" }, lineHeight: 1.1 }}>
                {avgTimePerTopic}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: { xs: "0.76rem", sm: "0.84rem" }, lineHeight: 1.4 }}>
                per topic
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 500, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
                minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Pie Chart */}
        <Grid item xs={12}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            p: { xs: 2, sm: 2.5, md: 3 },
            background: cardBackground,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden"
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: isDarkMode ? "#6ee7b7" : "#0f766e", fontSize: { xs: "1rem", md: "1.1rem" }, letterSpacing: 0.5 }}>
              📈 Completion Status
            </Typography>
            <Box sx={{ width: "100%", height: { xs: 260, md: 350 }, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartTooltipBg, 
                      border: `1px solid ${chartTooltipBorder}`,
                      borderRadius: "8px",
                      boxShadow: isDarkMode 
                        ? "0 4px 12px rgba(0,0,0,0.3)" 
                        : "0 4px 12px rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#e5e7eb" : "#000"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Progress by Topic */}
        <Grid item xs={12}>
          <Card sx={{ 
            boxShadow: cardBoxShadow,
            borderRadius: 4,
            border: cardBorder,
            p: { xs: 2, sm: 2.5, md: 3 },
            background: cardBackground,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden"
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: isDarkMode ? "#6ee7b7" : "#0f766e", fontSize: { xs: "1rem", md: "1.1rem" }, letterSpacing: 0.5 }}>
              📊 Progress by Topic
            </Typography>
            {!chartData || chartData.length === 0 ? (
              <Box sx={{ 
                height: 300, 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                gap: 2,
                color: isDarkMode ? "#9ca3af" : "#94a3b8"
              }}>
                <Typography sx={{ fontSize: "2.5rem" }}>📊</Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? "#9ca3af" : "#64748b", fontWeight: 600 }}>
                  No topic data yet
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? "#6b7280" : "#94a3b8", textAlign: "center", maxWidth: 300 }}>
                  Mark topics as completed in your study plan to see your progress chart
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", overflowX: "auto", pb: 1 }}>
                <Box sx={{ minWidth: Math.max(380, chartData.length * 90), height: { xs: 320, md: 400 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={36} margin={{ top: 20, right: 18, left: 0, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke={chartAxisColor}
                        tick={{ fontSize: 12, fontWeight: 600, fill: chartAxisTextColor }}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        minTickGap={8}
                        height={80}
                      />
                      <YAxis
                        stroke={chartAxisColor}
                        tick={{ fontSize: 12, fontWeight: 600, fill: chartAxisTextColor }}
                        allowDecimals={false}
                        width={42}
                      />
                      <Tooltip 
                        cursor={{ fill: isDarkMode ? "rgba(34, 197, 94, 0.1)" : "rgba(15, 118, 110, 0.05)" }}
                        contentStyle={{ 
                          backgroundColor: chartTooltipBg, 
                          border: `1px solid ${chartTooltipBorder}`,
                          borderRadius: "12px",
                          boxShadow: isDarkMode 
                            ? "0 8px 24px rgba(0,0,0,0.3)" 
                            : "0 8px 24px rgba(0,0,0,0.12)",
                          fontSize: 14,
                          fontWeight: 500,
                          color: isDarkMode ? "#e5e7eb" : "#000"
                        }}
                        formatter={(value, name) => [value, name === 'completed' ? '✅ Completed' : '⏳ Remaining']}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 14, fontWeight: 700, paddingBottom: 20, color: isDarkMode ? "#d1d5db" : "#000" }}
                        iconType="circle"
                        formatter={(value) => value === 'completed' ? '✅ Completed' : '⏳ Remaining'}
                        verticalAlign="top"
                        align="right"
                      />
                      <Bar dataKey="completed" fill="#10b981" name="completed" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="remaining" fill={isDarkMode ? "#4b5563" : "#cbd5e1"} name="remaining" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressChart;
