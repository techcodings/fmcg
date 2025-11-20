// src/pages/FeatureA.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  FiInfo,
  FiDatabase,
  FiImage,
  FiMessageCircle,
  FiGlobe,
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

  // ➜ User-facing scenario inputs (from your docs: choose category, region, horizon)
  const [category, setCategory] = useState(
    "FMCG – Beverages (carbonated drinks)"
  );
  const [region, setRegion] = useState("Urban India");
  const [timeHorizon, setTimeHorizon] = useState("next 5 weeks");

  const fetchForecast = useCallback(
    async (opts) => {
      const options = opts || {
        category,
        region,
        timeHorizon,
      };

      setLoading(true);
      setError("");
      try {
        const data = await generateTrendForecast(options);

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
        setError("Failed to load AI trend forecast. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [category, region, timeHorizon]
  );

  useEffect(() => {
    // Initial load with default scenario
    fetchForecast();
  }, [fetchForecast]);

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

  const handleRunForecastClick = () => {
    fetchForecast({
      category,
      region,
      timeHorizon,
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="feature-a-page"
    >
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Feature A – Multimodal Trend Forecasting Agent</h1>
          <p className="page-header-subtitle">
            Super-smart FMCG product manager that forecasts SKU demand,
            tracks trends across sales, social, images & market reports,
            and turns them into actions.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="button"
            onClick={handleRunForecastClick}
            disabled={loading}
          >
            <FiFilter />
            <span>{loading ? "Running forecast..." : "Run Forecast"}</span>
          </button>
          <button className="button button-outline">
            <FiDownload />
            <span>Export Insights</span>
          </button>
        </div>
      </div>

      {/* Purpose of the Project (from your doc) */}
      <div className="chart-card feature-a-purpose">
        <div className="feature-a-purpose-icon">
          <FiInfo />
        </div>
        <div className="feature-a-purpose-content">
          <h3 className="chart-card-title">Purpose of the Project</h3>
          <p>
            The main goal is to help companies create new products or
            product variants that are likely to succeed in the market,
            using AI. Think of this as a super-smart product manager that:
          </p>
          <ul className="reasoning-list">
            <li>
              Analyzes current trends (social media, reviews, competitor
              launches).
            </li>
            <li>
              Understands historical performance (what sold well, under
              which conditions and promotions).
            </li>
            <li>
              Suggests new products or improvements with predicted
              success rates.
            </li>
            <li>
              Surfaces visual prototypes, insights and numbers for
              decision-making.
            </li>
          </ul>
          <p className="feature-a-purpose-question">
            Ultimately it tries to answer:{" "}
            <strong>
              “If we launch this product, how likely is it to succeed,
              and what will it look like?”
            </strong>
          </p>
        </div>
      </div>

      {/* Scenario Inputs – directly from "Inputs: (User needs to choose a category...)" */}
      <div className="chart-card feature-a-filters">
        <h3 className="chart-card-title">Scenario Inputs (Demo)</h3>
        <p className="chart-card-caption">
          In a real system, the agent would pull sales, social, images
          and reports for the selected FMCG category and region. Here,
          the numbers are synthetic but follow the same logic.
        </p>
        <div className="filters-grid">
          <div className="filter-group">
            <label>FMCG Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Energy drink for Gen Z in Southeast Asia"
            />
          </div>

          <div className="filter-group">
            <label>Region / Market</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="Bangaldesh">Bangladesh</option>
              <option value="Tier-2 & Tier-3 bangladesh">
                Tier-2 & Tier-3 
              </option>
              <option value="Southeast Asia">Southeast Asia</option>
              <option value="Middle East & North Africa">
                Middle East & North Africa
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>Time Horizon</label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
            >
              <option value="next 5 weeks">Next 5 weeks</option>
              <option value="next 3 months">Next 3 months</option>
              <option value="next 12 months">Next 12 months</option>
            </select>
          </div>

          <div className="filter-group filter-group-button">
            <button
              className="button"
              onClick={handleRunForecastClick}
              disabled={loading}
            >
              <FiFilter />
              <span>{loading ? "Running..." : "Run Forecast"}</span>
            </button>
          </div>
        </div>
        <p className="data-disclaimer">
          <strong>Demo note:</strong> Forecasts below are AI-generated
          synthetic data but structured as if they were driven by these
          inputs.
        </p>
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
          {/* KPI cards – SKU-level & sentiment summary */}
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
              SKU Demand Forecast ({timeHorizon})
            </h3>
            <p className="chart-card-caption">
              Forecasted units for <strong>Citrus Soda</strong> and{" "}
              <strong>Berry Blast</strong> in <strong>{region}</strong>, in the{" "}
              <strong>{category}</strong> category.
            </p>
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
                <p className="chart-card-caption">
                  Maps to trend-adoption probabilities: which flavors,
                  designs or packs are most likely to be adopted.
                </p>
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
                <p className="chart-card-caption">
                  Price elasticity, expected lift for discounts and
                  promo scenarios for your SKUs.
                </p>
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
                <p className="chart-card-caption">
                  Automated competitor launch tracking and expected impact
                  on your SKUs.
                </p>
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
              <p className="chart-card-caption">
                Alerts for low stock, high demand or sudden trend shifts.
              </p>
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
              <p className="chart-card-caption">
                Reorder quantities, bundles, promotions and SKU
                prioritisation – directly from the agent.
              </p>
              <ul className="reasoning-list">
                {recommendationsData.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Architecture / ML Stack */}
          <div className="chart-card feature-a-architecture">
            <h3 className="chart-card-title">
              How This Multimodal Agent Thinks (Architecture / ML Stack)
            </h3>
            <div className="dashboard-secondary-grid">
              <div>
                <h4 className="chart-card-subtitle">Model Pipeline</h4>
                <ul className="reasoning-list">
                  <li>
                    <strong>Vision Transformer (ViT):</strong> extracts
                    visual embeddings from packaging images to detect
                    style trends and color patterns.
                  </li>
                  <li>
                    <strong>Text Transformer + RAG (LangChain):</strong>{" "}
                    processes social posts, reviews and pulls supporting
                    evidence from reports and news.
                  </li>
                  <li>
                    <strong>Tabular Transformer:</strong> models
                    historical sales, promotions, seasonality and price
                    sensitivity.
                  </li>
                  <li>
                    <strong>Multimodal Fusion Transformer:</strong> fuses
                    CV + NLP + Tabular signals to see which designs,
                    flavors and regions are best.
                  </li>
                  <li>
                    <strong>AI Reasoning Layer:</strong> generates SKU
                    forecasts, trend probabilities and actionable
                    recommendations.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="chart-card-subtitle">Output Space</h4>
                <ul className="reasoning-list">
                  <li>SKU-level units and revenue forecasts by region.</li>
                  <li>
                    Price / promotion impact and expected sales uplift.
                  </li>
                  <li>
                    Emerging trends and adoption probabilities by
                    demographic / region.
                  </li>
                  <li>
                    Consumer sentiment and engagement metrics from reviews
                    and social.
                  </li>
                  <li>
                    Competitor impact, white-space opportunities and gaps.
                  </li>
                  <li>
                    Alerts, actions and “what-if” scenario suggestions.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data sources – explicit mapping to your "Inputs" section */}
          <div className="chart-card feature-a-data-sources">
            <h3 className="chart-card-title">
              What the Data on This Screen Is Based On
            </h3>
            <p className="chart-card-caption">
              In production, every chart would be backed by real APIs /
              data pipelines. Below shows the conceptual inputs from your
              design doc.
            </p>
            <div className="data-source-grid">
              <div className="data-source-card">
                <div className="data-source-icon">
                  <FiDatabase />
                </div>
                <h4>Historical Sales & Promotions (Tabular)</h4>
                <ul className="reasoning-list">
                  <li>SKU-level units sold from ERP / POS / sales DB.</li>
                  <li>Revenue per SKU from ERP / accounting system.</li>
                  <li>Sales per region / store and channel.</li>
                  <li>
                    Promotions history (discount %, duration, type) from
                    marketing backend.
                  </li>
                </ul>
              </div>

              <div className="data-source-card">
                <div className="data-source-icon">
                  <FiMessageCircle />
                </div>
                <h4>Social Media & Reviews (NLP)</h4>
                <ul className="reasoning-list">
                  <li>
                    Customer reviews + ratings from e-commerce APIs
                    (Amazon, Shopify, etc.).
                  </li>
                  <li>
                    Social posts from Twitter/X, Instagram, TikTok,
                    Reddit.
                  </li>
                  <li>
                    Engagement metrics (likes, shares, comments) as
                    popularity signal.
                  </li>
                  <li>
                    Hashtags, trending topics, demographics & geolocation.
                  </li>
                </ul>
              </div>

              <div className="data-source-card">
                <div className="data-source-icon">
                  <FiImage />
                </div>
                <h4>Product Images (Computer Vision)</h4>
                <ul className="reasoning-list">
                  <li>
                    Packaging photos from internal product catalog / CMS.
                  </li>
                  <li>
                    Competitor packaging to learn style, eco-friendly
                    cues, premium vs mass.
                  </li>
                  <li>
                    Optional concept sketches / prototypes for new ideas.
                  </li>
                  <li>
                    Brand logos, fonts and colors for brand consistency.
                  </li>
                </ul>
              </div>

              <div className="data-source-card">
                <div className="data-source-icon">
                  <FiGlobe />
                </div>
                <h4>Industry Reports & Competitor Launches (RAG)</h4>
                <ul className="reasoning-list">
                  <li>
                    PDFs and analyst reports (market growth, category
                    trends).
                  </li>
                  <li>
                    News / press releases about competitor product
                    launches.
                  </li>
                  <li>
                    Macro market analysis, economic indicators, weather
                    and seasonality.
                  </li>
                  <li>
                    Regulatory / ESG signals like sugar tax and
                    sustainability trends.
                  </li>
                </ul>
              </div>
            </div>
            <p className="data-disclaimer">
              <strong>Demo note:</strong> this implementation uses AI to
              generate synthetic but realistic-looking data in the same
              shape that real back-end pipelines would produce.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeatureA;
