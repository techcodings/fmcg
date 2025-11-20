// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiCpu,
  FiUploadCloud,
  FiTrendingUp,
  FiArrowRight,
  FiDatabase,
  FiLink,
  FiZap,
} from "react-icons/fi";
import { motion } from "framer-motion";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: delay, ease: "easeOut" },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: delay, ease: "easeOut" },
  }),
};

const HomePage = () => {
  // which “Read more” card is open: "A" | "B" | null
  const [expandedFeature, setExpandedFeature] = useState(null);

  return (
    <div className="homepage-container">
      {/* ========== 1. HERO ========== */}
      <section className="hero-section v2">
        <div className="hero-content v2">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="pulse-dot"></span>
            FMCG AI Product Studio
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Create Successful Products with
            <span className="gradient-text"> AI-Driven Insights</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Our AI-powered product studio analyzes trends, simulates market
            scenarios, and suggests new products with predicted success rates.
          </motion.p>
        </div>

        {/* Animated mockup */}
        <motion.div
          className="platform-mockup"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
        >
          <div className="platform-header">
            <div className="platform-dots">
              <span
                className="platform-dot"
                style={{ background: "#ff6b6b" }}
              />
              <span
                className="platform-dot"
                style={{ background: "#f4ff4e" }}
              />
              <span
                className="platform-dot"
                style={{ background: "#34d399" }}
              />
            </div>
            <div className="platform-title">TrendForecast_Dashboard.ai</div>
          </div>
          <div className="platform-body">
            <div className="platform-sidebar">
              <div className="platform-sidebar-item active" />
              <div className="platform-sidebar-item" />
              <div className="platform-sidebar-item" />
            </div>
            <div className="platform-content">
              <div
                className="platform-chart-line"
                style={{ width: "80%" }}
              />
              <div
                className="platform-chart-line"
                style={{ width: "90%" }}
              />
              <div
                className="platform-chart-line"
                style={{ width: "70%" }}
              />
              <div
                className="platform-chart-line"
                style={{ width: "85%" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== 2. WHAT EACH AGENT DOES – READ MORE ========== */}
      <motion.section
        className="agents-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>What Each AI Agent Actually Does</h2>
        <p className="section-subtitle">
          Short summaries by default, with extra details only when you click{" "}
          <strong>Read more</strong>.
        </p>

        <div className="homepage-features-grid">
          {/* ===== Feature A Card – Multimodal Trend Forecasting ===== */}
          <motion.div variants={cardVariants} custom={0.2}>
            <div className="feature-card homepage-feature-card feature-description-card">
              <div className="card-header">
                <div className="card-icon">
                  <FiBarChart2 />
                </div>
                <span className="feature-pill">Feature A</span>
              </div>

              <h3 className="card-title">
                Multimodal Trend Forecasting Agent
              </h3>

              {/* always visible short description */}
              <p className="card-description">
                Always-on <strong>market radar</strong> that blends sales,
                social chatter, reviews and product images to show where demand
                is building or fading across SKUs, flavours and regions.
              </p>

              {/* Read more toggle */}
              <div className="read-more-row">
                <button
                  type="button"
                  className={`read-more-btn ${
                    expandedFeature === "A" ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setExpandedFeature(
                      expandedFeature === "A" ? null : "A"
                    )
                  }
                >
                  {expandedFeature === "A" ? "Show less" : "Read more"}
                  <FiArrowRight className="read-more-icon" />
                </button>
              </div>

              {/* extra details only when expanded */}
              {expandedFeature === "A" && (
                <motion.div
                  className="feature-meta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="feature-meta-block">
                    <h4>What it looks at</h4>
                    <ul className="feature-meta-list">
                      <li>
                        Historical SKU sales, pricing changes and promo
                        calendars.
                      </li>
                      <li>
                        Social buzz, ratings and basic signals from product
                        photos.
                      </li>
                      <li>
                        Store / channel performance across regions and time
                        windows.
                      </li>
                    </ul>
                  </div>

                  <div className="feature-meta-block">
                    <h4>What it gives you</h4>
                    <ul className="feature-meta-list">
                      <li>
                        <strong>Demand curves</strong> for each SKU / flavour
                        to see true lift or decline.
                      </li>
                      <li>
                        <strong>Risk flags</strong> for saturation,
                        cannibalisation and price–war zones.
                      </li>
                      <li>
                        “Hot vs cold” micro-segments for precise targeting and
                        inventory planning.
                      </li>
                    </ul>
                  </div>

                  <div className="feature-meta-block">
                    <h4>Best used for</h4>
                    <ul className="feature-meta-list">
                      <li>Quarterly production &amp; inventory planning.</li>
                      <li>
                        Finding under-served packs / flavours before competitors
                        react.
                      </li>
                      <li>
                        Answering:{" "}
                        <em>
                          “Where exactly is demand shifting right now?”
                        </em>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ===== Feature B Card – AI Product Ideation ===== */}
          <motion.div variants={cardVariants} custom={0.4}>
            <div className="feature-card homepage-feature-card feature-description-card">
              <div className="card-header">
                <div className="card-icon">
                  <FiCpu />
                </div>
                <span className="feature-pill">Feature B</span>
              </div>

              <h3 className="card-title">AI Product Ideation Agent</h3>

              {/* always visible short description */}
              <p className="card-description">
                A creative <strong>R&amp;D partner</strong> that turns
                plain-language briefs into concrete product concepts, with
                flavour ideas, pack notes and success estimates.
              </p>

              {/* Read more toggle */}
              <div className="read-more-row">
                <button
                  type="button"
                  className={`read-more-btn ${
                    expandedFeature === "B" ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setExpandedFeature(
                      expandedFeature === "B" ? null : "B"
                    )
                  }
                >
                  {expandedFeature === "B" ? "Show less" : "Read more"}
                  <FiArrowRight className="read-more-icon" />
                </button>
              </div>

              {/* extra details only when expanded */}
              {expandedFeature === "B" && (
                <motion.div
                  className="feature-meta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="feature-meta-block">
                    <h4>Input you provide</h4>
                    <ul className="feature-meta-list">
                      <li>
                        Simple prompts like “spicy mango snack for teens in
                        India”.
                      </li>
                      <li>
                        Target consumer, price band, category and format (drink,
                        snack, etc.).
                      </li>
                      <li>
                        Constraints such as sugar-free, vegan, recyclable,
                        low-calorie, etc.
                      </li>
                    </ul>
                  </div>

                  <div className="feature-meta-block">
                    <h4>What it generates</h4>
                    <ul className="feature-meta-list">
                      <li>
                        2–4 named concepts with flavour notes, hero claims and
                        usage occasions.
                      </li>
                      <li>
                        Simulated <strong>adoption probability</strong>,
                        Year-1 sales band and risk flags (cannibalisation,
                        sustainability, price fit).
                      </li>
                      <li>
                        A fast <strong>packaging mockup</strong> image for
                        quick visualisation in workshops.
                      </li>
                    </ul>
                  </div>

                  <div className="feature-meta-block">
                    <h4>Best used for</h4>
                    <ul className="feature-meta-list">
                      <li>
                        Early-stage ideation sprints with marketing &amp; R&amp;D.
                      </li>
                      <li>
                        Shortlisting 2–3 candidates before consumer testing.
                      </li>
                      <li>
                        Answering:{" "}
                        <em>
                          “If we launch this, how big could it be and what are
                          the pitfalls?”
                        </em>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== 3. HOW IT WORKS ========== */}
      <motion.section
        className="how-it-works-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>A Smarter Way to Innovate</h2>
        <div className="how-it-works-grid">
          <motion.div
            className="step-card"
            variants={cardVariants}
            custom={0.2}
          >
            <div className="step-icon">
              <FiUploadCloud />
            </div>
            <h3>1. Ingest Data</h3>
            <p>
              Connect multimodal data: sales figures, product images, social
              media chatter, and competitor reports.
            </p>
          </motion.div>
          <motion.div
            className="step-card"
            variants={cardVariants}
            custom={0.4}
          >
            <div className="step-icon">
              <FiCpu />
            </div>
            <h3>2. Analyze &amp; Predict</h3>
            <p>
              Our AI agents process and fuse this data to find hidden patterns,
              forecast trends, and run simulations.
            </p>
          </motion.div>
          <motion.div
            className="step-card"
            variants={cardVariants}
            custom={0.6}
          >
            <div className="step-icon">
              <FiBarChart2 />
            </div>
            <h3>3. Generate Insights</h3>
            <p>
              Receive actionable insights, new product ideas, and visual
              mockups with clear success probabilities.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== 4. EXPLORE AGENTS (NAV CARDS) ========== */}
      <motion.section
        className="agents-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>Explore the AI Agents</h2>
        <div className="homepage-features-grid">
          <motion.div variants={cardVariants} custom={0.2}>
            <Link to="/trend-forecasting" className="feature-card-link">
              <div className="feature-card homepage-feature-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FiBarChart2 />
                  </div>
                </div>
                <h3 className="card-title">
                  Multimodal Trend Forecasting
                </h3>
                <p className="card-description">
                  An AI market analyst that scans data to spot opportunities,
                  predict demand, and guide inventory decisions.
                </p>
                <div className="card-capabilities">
                  <h4>Key Capabilities:</h4>
                  <ul>
                    <li>SKU Demand Forecast</li>
                    <li>Sentiment Analysis</li>
                    <li>Price Elasticity Modeling</li>
                    <li>Competitor Launch Tracking</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <span className="card-link">
                    Explore Agent <FiArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants} custom={0.4}>
            <Link to="/product-ideation" className="feature-card-link">
              <div className="feature-card homepage-feature-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FiCpu />
                  </div>
                </div>
                <h3 className="card-title">AI Product Ideation Agent</h3>
                <p className="card-description">
                  An AI R&amp;D analyst that suggests new product ideas,
                  generates mockups, and predicts market adoption.
                </p>
                <div className="card-capabilities">
                  <h4>Key Capabilities:</h4>
                  <ul>
                    <li>New Product Suggestions</li>
                    <li>Market Adoption Propensity</li>
                    <li>Generative Visual Mockups</li>
                    <li>"What-If" Scenario Sliders</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <span className="card-link">
                    Explore Agent <FiArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== 5. CORE TECH ========== */}
      <motion.section
        className="core-tech-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>Powered by an Advanced AI Stack</h2>
        <p className="section-subtitle">
          We don&apos;t just use AI, we use the right AI for every data type.
        </p>
        <div className="tech-grid">
          <motion.div
            className="tech-feature"
            variants={cardVariants}
            custom={0.1}
          >
            <div className="tech-icon">
              <FiZap />
            </div>
            <div>
              <h4>Multimodal Fusion</h4>
              <p>
                Combines signals from images (ViT), text (NLP), and sales data
                (Tabular) for a complete market view.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="tech-feature"
            variants={cardVariants}
            custom={0.2}
          >
            <div className="tech-icon">
              <FiDatabase />
            </div>
            <div>
              <h4>RAG Pipeline</h4>
              <p>
                Uses Retrieval-Augmented Generation to pull real-time insights
                from industry reports and market news.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="tech-feature"
            variants={cardVariants}
            custom={0.3}
          >
            <div className="tech-icon">
              <FiLink />
            </div>
            <div>
              <h4>Autonomous Reasoning</h4>
              <p>
                Simulates product scenarios and plans launch strategies,
                uncovering opportunities competitors miss.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="tech-feature"
            variants={cardVariants}
            custom={0.4}
          >
            <div className="tech-icon">
              <FiTrendingUp />
            </div>
            <div>
              <h4>Real-time Analytics</h4>
              <p>
                Connects directly to your data sources via API so forecasts are
                always based on the latest data.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== 6. CTA ========== */}
      <motion.section
        className="cta-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2>Ready to Build What&apos;s Next?</h2>
        <p>
          Stop guessing and start innovating. Use our AI agents to find your
          next winning product.
        </p>
        <Link to="/trend-forecasting" className="btn-glitch large">
          Start Forecasting
        </Link>
      </motion.section>
    </div>
  );
};

export default HomePage;
