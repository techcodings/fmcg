// src/pages/FeatureA.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiDownload,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
  FiHeart,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { generateTrendForecast } from "../api.js";

const SENTIMENT_COLORS = [
  "var(--accent-green)",
  "var(--accent-yellow)",
  "var(--accent-red)",
];

const StatBox = ({ title, value, change, changeType, icon, iconClass }) => {
  const isPositive = changeType === "positive";
  return (
    <div className="stat-box">
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
    </div>
  );
};

const FeatureA = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [priceInsights, setPriceInsights] = useState([]);
  const [competitorInsights, setCompetitorInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await generateTrendForecast();
        if (!mounted) return;
        setSummary(data.summary || null);
        setForecastData(data.forecastSeries || []);
        setSentimentData(data.sentimentBreakdown || []);
        setTrendsData(data.topTrends || []);
        setRecommendationsData(data.recommendations || []);
        setPriceInsights(data.pricePromotionInsights || []);
        setCompetitorInsights(data.competitorInsights || []);
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load AI trend forecast. Please try again.");
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
    forecastData.length ||
    sentimentData.length ||
    trendsData.length ||
    recommendationsData.length ||
    priceInsights.length ||
    competitorInsights.length ||
    alerts.length;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="feature-a-page"
    >
      <div className="page-header">
        <h1>Multimodal Trend Forecasting</h1>
        <div className="page-header-actions">
          <button className="button">
            <FiFilter />
            <span>Scenario Filters</span>
          </button>
          <button className="button button-outline">
            <FiDownload />
            <span>Export Insights</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Letting the AI crunch sales, sentiment and trend signals...</p>
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
        <motion.div
          className="feature-a-grid"
          variants={containerVariants}
          initial="initial"
          animate="in"
        >
          {/* KPI cards */}
          <div className="stat-grid">
            <StatBox
              title="Total Forecasted Revenue"
              value={summary?.totalForecastedRevenueLabel || "—"}
              change={
                summary?.totalForecastedRevenueChangeLabel ||
                "vs previous period"
              }
              changeType="positive"
              icon={<FiDollarSign />}
              iconClass="blue"
            />
            <StatBox
              title={
                summary?.hotSkuName
                  ? `Hot SKU: ${summary.hotSkuName}`
                  : "Hot SKU"
              }
              value={summary?.hotSkuUnitsLabel || "—"}
              change={summary?.hotSkuChangeLabel || "vs last week"}
              changeType="positive"
              icon={<FiPackage />}
              iconClass="blue"
            />
            <StatBox
              title="Emerging Trends"
              value={summary?.emergingTrendsCountLabel || "—"}
              change={summary?.emergingTrendsChangeLabel || "vs last month"}
              changeType="positive"
              icon={<FiBarChart2 />}
              iconClass="purple"
            />
            <StatBox
              title="Overall Sentiment"
              value={summary?.overallSentimentLabel || "—"}
              change={
                summary?.overallSentimentChangeLabel || "vs last period"
              }
              changeType={
                (summary?.overallSentimentChangeLabel || "")
                  .trim()
                  .startsWith("-")
                  ? "negative"
                  : "positive"
              }
              icon={<FiHeart />}
              iconClass="green"
            />
          </div>

          {/* SKU forecast chart */}
          <div className="chart-card forecast-chart">
            <h3 className="chart-card-title">
              SKU Demand Forecast (Next 5 Weeks)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecastData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-glass)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Citrus Soda"
                  stroke="var(--accent-green)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Berry Blast"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment + trends */}
          <div className="chart-card sentiment-trends">
            <h3 className="chart-card-title">
              Social Sentiment & Trend Probabilities
            </h3>
            <div className="sentiment-trends-grid">
              <div className="sentiment-pie">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-glass)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="sentiment-legend">
                  {sentimentData.map((item, index) => (
                    <div key={item.name} className="sentiment-legend-item">
                      <span
                        className="sentiment-dot"
                        style={{
                          backgroundColor:
                            SENTIMENT_COLORS[index % SENTIMENT_COLORS.length],
                        }}
                      />
                      <span className="sentiment-label">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trends-list">
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
            </div>
          </div>

          {/* Price/promo + competitor + alerts + recos */}
          <div className="chart-card">
            <h3 className="chart-card-title">
              Price & Promotion Insights, Competitors & Alerts
            </h3>
            <div className="dashboard-secondary-grid">
              <div>
                <h4 className="chart-card-subtitle">
                  Price & Promotion Insights
                </h4>
                <ul className="reasoning-list">
                  {priceInsights.map((p, idx) => (
                    <li key={idx}>
                      <strong>{p.scenario}</strong>{" "}
                      {typeof p.expectedLiftPercent === "number" &&
                        `→ ~${p.expectedLiftPercent.toFixed(1)}% lift.`}{" "}
                      {p.notes}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="chart-card-subtitle">
                  Competitor & Market Snapshot
                </h4>
                <ul className="reasoning-list">
                  {competitorInsights.map((c, idx) => (
                    <li key={idx}>
                      <strong>{c.event}</strong> — {c.impact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4 className="chart-card-subtitle">Alerts & Actions</h4>
              <ul className="reasoning-list">
                {alerts.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4 className="chart-card-subtitle">
                Recommended Actions (AI)
              </h4>
              <ul className="reasoning-list">
                {recommendationsData.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeatureA;
