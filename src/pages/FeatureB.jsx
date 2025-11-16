// src/pages/FeatureB.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiSend } from "react-icons/fi";
import { FaFileImage } from "react-icons/fa";
import { generateProductIdea } from "../api.js";

const FeatureB = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ideaGenerated, setIdeaGenerated] = useState(false);

  const [price, setPrice] = useState(5.99);
  const [ecoPackage, setEcoPackage] = useState(75);

  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setIdeaGenerated(false);
    setError("");
    setIdea(null);

    try {
      const result = await generateProductIdea({
        query,
        price: Number(price),
        ecoPackage: Number(ecoPackage),
      });
      setIdea(result);
      setIdeaGenerated(true);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while generating the product idea. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const adjustedAdoption = (() => {
    const base =
      idea && typeof idea.adoptionProbability === "number"
        ? idea.adoptionProbability
        : 70;
    const ecoBonus = (ecoPackage - 75) / 10;
    const pricePenalty = (price - 5.99) * 2;
    return Math.max(
      0,
      Math.min(100, base + ecoBonus - pricePenalty)
    ).toFixed(1);
  })();

  const sentimentMatch =
    idea && typeof idea.sentimentMatchScore === "number"
      ? idea.sentimentMatchScore.toFixed(1)
      : null;
  const trendAlignment =
    idea && typeof idea.trendAlignmentScore === "number"
      ? idea.trendAlignmentScore.toFixed(1)
      : null;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="feature-b-page"
    >
      <div className="page-header">
        <h1>AI Product Ideation Agent</h1>
      </div>

      {/* Query bar */}
      <form onSubmit={handleSubmit} className="query-bar">
        <FiCpu className="query-bar-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Suggest a new energy drink flavor for Gen Z in Asia..."
          className="query-bar-input"
        />
        <button
          type="submit"
          className="query-bar-button"
          disabled={!query.trim() || isLoading}
        >
          <FiSend />
        </button>
      </form>

      {error && (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      )}

      {isLoading && !error && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Letting the AI simulate your product idea...</p>
        </div>
      )}

      {!isLoading && !ideaGenerated && !error && (
        <div className="empty-state">
          <FiCpu />
          <p>
            Ask the AI to propose a new product or variant and it will estimate
            adoption and impact.
          </p>
        </div>
      )}

      {!isLoading && ideaGenerated && idea && !error && (
        <motion.div className="fade-in-up">
          <div className="output-grid">
            {/* Primary mockup / concept */}
            <div className="mockup-card">
              <h3 className="chart-card-title">Primary Concept Mockup</h3>
              <div className="mockup-box">
                <FaFileImage />
                <span>{idea.mockupLabel || "Concept packaging preview"}</span>
              </div>
              <p className="mockup-title">
                {idea.name || "New Product Concept"}
              </p>
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                {idea.shortDescription}
              </p>

              {/* Variant list */}
              {Array.isArray(idea.variants) && idea.variants.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4 className="chart-card-subtitle">
                    Suggested Variants (Flavors / Packs)
                  </h4>
                  <ul className="list-card">
                    {idea.variants.map((v, idx) => (
                      <li key={idx} className="list-card-item">
                        <div>
                          <span className="list-card-item-name">
                            {v.name}
                          </span>
                          <span
                            className="list-card-item-value"
                            style={{ display: "block", fontSize: "0.8rem" }}
                          >
                            {v.description}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span className="list-card-item-value">
                            {typeof v.adoptionProbability === "number"
                              ? `${v.adoptionProbability.toFixed(1)}%`
                              : "—"}
                          </span>
                          <span
                            className="list-card-item-value"
                            style={{ display: "block", fontSize: "0.8rem" }}
                          >
                            {v.forecastedRevenueLabel}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Analysis & Insights */}
            <div className="insights-card">
              <h3 className="chart-card-title">AI Analysis & Market Fit</h3>

              <div className="insights-stats">
                <div className="stat-item">
                  <span className="stat-item-label">Adoption Probability</span>
                  <span
                    className="stat-item-value"
                    style={{ color: "var(--success)" }}
                  >
                    {typeof idea.adoptionProbability === "number"
                      ? `${idea.adoptionProbability.toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-item-label">
                    Forecasted Sales (Year 1)
                  </span>
                  <span
                    className="stat-item-value"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {typeof idea.forecastedSalesUnitsYear1 === "number"
                      ? `~${idea.forecastedSalesUnitsYear1.toLocaleString()} units`
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="insights-stats" style={{ marginTop: "1rem" }}>
                <div className="stat-item">
                  <span className="stat-item-label">Sentiment Match</span>
                  <span className="stat-item-value">
                    {sentimentMatch ? `${sentimentMatch}%` : "—"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-item-label">
                    Trend Alignment Score
                  </span>
                  <span className="stat-item-value">
                    {trendAlignment ? `${trendAlignment}%` : "—"}
                  </span>
                </div>
              </div>

              {idea.buzzPredictionLabel && (
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Buzz prediction: {idea.buzzPredictionLabel}
                </p>
              )}

              <h4
                className="chart-card-title"
                style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}
              >
                Reasoning Chain
              </h4>
              <ul className="reasoning-list">
                {(idea.reasoning || []).map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                  marginTop: "1.5rem",
                }}
              >
                <div>
                  <h4 className="chart-card-subtitle">
                    Consumer Pain Points Covered
                  </h4>
                  <ul className="reasoning-list">
                    {(idea.consumerPainPointsCovered || []).map(
                      (line, idx) => (
                        <li key={idx}>{line}</li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="chart-card-subtitle">
                    Competitive Differentiation
                  </h4>
                  <ul className="reasoning-list">
                    {(idea.competitiveDifferentiation || []).map(
                      (line, idx) => (
                        <li key={idx}>{line}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <h4 className="chart-card-subtitle">
                  Strategic Recommendations
                </h4>
                <ul className="reasoning-list">
                  {(idea.strategicRecommendations || []).map(
                    (line, idx) => (
                      <li key={idx}>{line}</li>
                    )
                  )}
                </ul>
              </div>

              {Array.isArray(idea.proactiveAlerts) &&
                idea.proactiveAlerts.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h4 className="chart-card-subtitle">
                      Proactive Alerts (Competitors / Market)
                    </h4>
                    <ul className="reasoning-list">
                      {idea.proactiveAlerts.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {/* Scenario sliders + simulation notes */}
          <div className="slider-card">
            <h3 className="chart-card-title">What-If Scenario Sliders</h3>

            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-name">Price Point</span>
                <span className="slider-label-value">
                  ${(price * 80).toFixed(0)}
                </span>
              </div>
              <input
                type="range"
                min="2.99"
                max="9.99"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-name">
                  Eco-Friendly Packaging %
                </span>
                <span className="slider-label-value">{ecoPackage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={ecoPackage}
                onChange={(e) => setEcoPackage(parseInt(e.target.value, 10))}
              />
            </div>

            <p className="text-sm text-gray-400 mt-4">
              New forecasted adoption:{" "}
              <span className="text-white font-bold">
                ~{adjustedAdoption}%
              </span>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                marginTop: "1.25rem",
              }}
            >
              <div>
                <h4 className="chart-card-subtitle">
                  Cannibalization Risk
                </h4>
                <p className="text-sm text-gray-300">
                  {idea.cannibalizationRiskLabel || "—"}
                </p>
              </div>
              <div>
                <h4 className="chart-card-subtitle">
                  Sustainability Alignment
                </h4>
                <p className="text-sm text-gray-300">
                  {idea.sustainabilityAlignmentLabel || "—"}
                </p>
              </div>
            </div>

            {Array.isArray(idea.simulationNotes) &&
              idea.simulationNotes.length > 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  <h4 className="chart-card-subtitle">
                    Simulation Notes
                  </h4>
                  <ul className="reasoning-list">
                    {idea.simulationNotes.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeatureB;
