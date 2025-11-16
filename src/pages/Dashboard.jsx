// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCpu,
  FiPackage,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { generateDashboardOverview } from "../api.js";

const StatBox = ({ title, value, change, changeType, icon, iconClass }) => {
  const isPositive = changeType === "positive";
  return (
    <motion.div
      className="stat-box"
      variants={{
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
      }}
    >
      <div className="stat-box-header">
        <span className="stat-box-title">{title}</span>
        <span className={`stat-box-icon ${iconClass}`}>{icon}</span>
      </div>
      <h2 className="stat-box-value">{value}</h2>
      <div
        className={`stat-box-change ${
          isPositive ? "positive" : "negative"
        }`}
      >
        {isPositive ? <FiArrowUp /> : <FiArrowDown />}
        <span>{change}</span>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [aiBullets, setAiBullets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await generateDashboardOverview();
        if (!mounted) return;
        setSummary(data.summary || null);
        setSalesData(data.salesData || []);
        setTrendsData(data.topTrends || []);
        setAiBullets(data.aiSummaryBullets || []);
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load AI dashboard overview. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const hasData =
    salesData.length || trendsData.length || aiBullets.length || alerts.length;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="dashboard-page"
    >
      <h1 className="page-title">Welcome Back, Product Manager</h1>
      <p className="page-subtitle">
        Here is your AI-powered portfolio overview at a glance.
      </p>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Letting the AI assemble your dashboard...</p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="empty-state">
          <p>No AI data returned. Try refreshing the page.</p>
        </div>
      )}

      {!loading && !error && hasData && (
        <>
          <motion.div className="stat-grid" variants={containerVariants}>
            <StatBox
              title="Forecasted Revenue"
              value={summary?.forecastedRevenueLabel || "—"}
              change={
                summary?.forecastedRevenueChangeLabel || "vs last month"
              }
              changeType="positive"
              icon={<FiDollarSign />}
              iconClass="blue"
            />
            <StatBox
              title="Active Trends Tracked"
              value={summary?.activeTrendsTrackedLabel || "—"}
              change={summary?.activeTrendsChangeLabel || "vs last month"}
              changeType="positive"
              icon={<FiTrendingUp />}
              iconClass="blue"
            />
            <StatBox
              title="New Products Ideated"
              value={summary?.newProductsIdeatedLabel || "—"}
              change={summary?.newProductsChangeLabel || "vs last cycle"}
              changeType="positive"
              icon={<FiCpu />}
              iconClass="purple"
            />
            <StatBox
              title={
                summary?.hotSkuName
                  ? `Hot SKU: ${summary.hotSkuName}`
                  : "Hot SKU"
              }
              value={summary?.hotSkuVolumeLabel || "—"}
              change={summary?.hotSkuChangeLabel || "vs last week"}
              changeType={
                (summary?.hotSkuChangeLabel || "").trim().startsWith("-")
                  ? "negative"
                  : "positive"
              }
              icon={<FiPackage />}
              iconClass="purple"
            />
          </motion.div>

          <div className="dashboard-grid">
            {/* Revenue chart */}
            <div className="chart-card">
              <h3 className="chart-card-title">
                Revenue Forecast (Next 6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--accent-blue)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--accent-blue)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-secondary)"
                  />
                  <YAxis stroke="var(--text-secondary)" />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-glass)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--accent-blue)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Trends + AI bullets + alerts */}
            <div className="chart-card">
              <h3 className="chart-card-title">
                AI-Prioritized Trends, Highlights & Alerts
              </h3>
              <div className="dashboard-secondary-grid">
                <div>
                  <h4 className="chart-card-subtitle">Top Emerging Trends</h4>
                  <ul className="list-card">
                    {trendsData.map((trend, index) => (
                      <li key={index} className="list-card-item">
                        <span className="list-card-item-name">
                          {trend.name}
                        </span>
                        <span className="list-card-item-value">
                          {typeof trend.probability === "number"
                            ? `${trend.probability.toFixed(1)}%`
                            : trend.probability || "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="chart-card-subtitle">AI Summary</h4>
                  <ul className="reasoning-list">
                    {aiBullets.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <h4 className="chart-card-subtitle">
                  Alerts & Notifications
                </h4>
                <ul className="reasoning-list">
                  {alerts.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;
