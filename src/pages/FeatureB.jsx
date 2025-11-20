// src/pages/FeatureB.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiSend, FiZap } from "react-icons/fi";
import { FaFileImage } from "react-icons/fa";
import {
  generateProductIdea,
  generateProductMockup, // 👈 NEW
} from "../api.js";

const FeatureB = () => {
  // Chat messages
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content:
        "Hi, I’m your AI Product Ideation Agent. Tell me what kind of FMCG product you’re thinking about – for example:\n\n“Suggest a new energy drink flavor for Gen Z in Southeast Asia with eco-friendly packaging.”",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");

  // For image mockup
  const [mockupUrl, setMockupUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Scenario sliders
  const [price, setPrice] = useState(5.99); // USD
  const [ecoPackage, setEcoPackage] = useState(75); // %

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  // Turn JSON idea into ChatGPT-style text message
  // Turn JSON idea into display text (no markdown like ** or ##)
const formatIdeaToMessage = (ideaObj) => {
  if (!ideaObj) return "I couldn’t generate a valid product idea this time.";

  const adoption =
    typeof ideaObj.adoptionProbability === "number"
      ? `${ideaObj.adoptionProbability.toFixed(1)}%`
      : "—";

  const sales =
    typeof ideaObj.forecastedSalesUnitsYear1 === "number"
      ? `~${ideaObj.forecastedSalesUnitsYear1.toLocaleString()} units in year 1`
      : "—";

  const sentiment =
    typeof ideaObj.sentimentMatchScore === "number"
      ? `${ideaObj.sentimentMatchScore.toFixed(1)}%`
      : "—";

  const trend =
    typeof ideaObj.trendAlignmentScore === "number"
      ? `${ideaObj.trendAlignmentScore.toFixed(1)}%`
      : "—";

  const variantsText =
    Array.isArray(ideaObj.variants) && ideaObj.variants.length > 0
      ? ideaObj.variants
          .slice(0, 3)
          .map((v) => {
            const vAdopt =
              typeof v.adoptionProbability === "number"
                ? `${v.adoptionProbability.toFixed(1)}%`
                : "—";
            return `• ${v.name} – ${v.description} (Adoption ~${vAdopt}, ${v.forecastedRevenueLabel})`;
          })
          .join("\n")
      : "• (No specific variants returned.)";

  const strategyBullets = (ideaObj.strategicRecommendations || [])
    .slice(0, 3)
    .map((s) => `• ${s}`)
    .join("\n");

  return [
    `Concept: ${ideaObj.name}`,
    ideaObj.shortDescription,
    "",
    `Adoption: ~${adoption} | Forecasted sales: ${sales}`,
    `Sentiment match: ${sentiment} | Trend alignment: ${trend}`,
    "",
    "Suggested variants",
    variantsText,
    "",
    "Why this makes sense (high level):",
    ...(ideaObj.reasoning || []).slice(0, 4).map((r) => `• ${r}`),
    "",
    strategyBullets ? "Go-to-market highlights:\n" + strategyBullets : "",
  ]
    .filter(Boolean)
    .join("\n");
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setError("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: prev.length, role: "user", content: userText },
    ]);

    setIsLoading(true);
    setIsImageLoading(false);
    setMockupUrl(null);

    try {
      // 1) Get structured product idea JSON
      const result = await generateProductIdea({
        query: userText,
        price: Number(price),
        ecoPackage: Number(ecoPackage),
      });

      setIdea(result);

      // 2) Push AI message into chat
      const aiMessageText = formatIdeaToMessage(result);
      setMessages((prev) => [
        ...prev,
        { id: prev.length, role: "assistant", content: aiMessageText },
      ]);

      // 3) (Optional) Generate image mockup
      try {
        setIsImageLoading(true);
        const url = await generateProductMockup({
          name: result.name,
          shortDescription: result.shortDescription,
        });
        setMockupUrl(url);
      } catch (imgErr) {
        console.warn("Image generation failed:", imgErr);
      } finally {
        setIsImageLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while generating the product idea. Please try again."
      );
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          role: "assistant",
          content:
            "Sorry, I hit an error while ideating this concept. Please try again with the same brief or tweak it slightly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

      <div className="featureb-intro">
        <p>
          This agent helps FMCG teams design{" "}
          <strong>new products and variants</strong> that are likely to win in
          the market. It pretends to use product images (CV), reviews & social
          media (NLP), historical sales (tabular) and industry reports (RAG) –
          but for this demo the numbers are synthetic.
        </p>
        <p>
          Ask questions like{" "}
          <span className="featureb-example">
            “Suggest a spicy mango snack for teenagers in India with
            eco-friendly packaging.”
          </span>
        </p>
      </div>

      <div className="featureb-layout">
        {/* LEFT: Chat window */}
        <div className="chat-column">
          <div className="chat-window">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`chat-message ${
                  msg.role === "user"
                    ? "chat-message-user"
                    : "chat-message-assistant"
                }`}
              >
                <div className="chat-avatar">
                  {msg.role === "user" ? (
                    <span>U</span>
                  ) : (
                    <FiCpu className="chat-avatar-icon" />
                  )}
                </div>
                <div className="chat-bubble">
                  {msg.content.split("\n").map((line, idx) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={idx} className="chat-bubble-heading">
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("• ")) {
                      return (
                        <p key={idx} className="chat-bubble-bullet">
                          {line}
                        </p>
                      );
                    }
                    return (
                      <p key={idx} className="chat-bubble-text">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message-assistant">
                <div className="chat-avatar">
                  <FiCpu className="chat-avatar-icon" />
                </div>
                <div className="chat-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Chat input bar */}
          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <div className="chat-input-inner">
              <textarea
                rows={1}
                className="chat-input"
                placeholder="Type your FMCG product brief here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || isLoading}
              >
                <FiSend />
              </button>
            </div>
            <div className="chat-hint-row">
              <span className="chat-hint">
                <FiZap />
                Demo: AI imagines it’s using images, reviews, sales and reports
                behind the scenes.
              </span>
            </div>
          </form>

          {error && (
            <div className="empty-state" style={{ marginTop: "0.5rem" }}>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT: Insights & sliders */}
        <div className="side-column">
          {!idea && (
            <div className="info-card side-placeholder">
              <h3 className="chart-card-title">Idea details</h3>
              <p className="info-text">
                When you send a brief, this panel will show adoption, sales,
                pain points, competition, and{" "}
                <strong>what-if sliders</strong> for the latest concept.
              </p>
            </div>
          )}

          {idea && (
            <>
              <div className="info-card">
                <h3 className="chart-card-title">Concept Snapshot</h3>

                <div className="mockup-box compact">
                  {mockupUrl ? (
                    <img
                      src={mockupUrl}
                      alt={idea.mockupLabel || idea.name}
                      className="mockup-image"
                    />
                  ) : (
                    <>
                      <FaFileImage />
                      <span>
                        {isImageLoading
                          ? "Generating packaging mockup..."
                          : idea.mockupLabel || "Concept packaging preview"}
                      </span>
                    </>
                  )}
                </div>

                <p className="mockup-title">{idea.name}</p>
                <p className="info-text">{idea.shortDescription}</p>

                <div className="insights-stats" style={{ marginTop: "1rem" }}>
                  <div className="stat-item">
                    <span className="stat-item-label">
                      Adoption Probability
                    </span>
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
              </div>

              {/* <div className="slider-card">
                <h3 className="chart-card-title">What-If Scenario Sliders</h3>

                <div className="slider-group">
                  <div className="slider-label">
                    <span className="slider-label-name">
                      Price Point (USD)
                    </span>
                    <span className="slider-label-value">
                      ${price.toFixed(2)}
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
                      Eco-friendly Packaging %
                    </span>
                    <span className="slider-label-value">{ecoPackage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={ecoPackage}
                    onChange={(e) =>
                      setEcoPackage(parseInt(e.target.value, 10))
                    }
                  />
                </div>

                <p className="slider-note">
                  New simulated adoption (demo):{" "}
                  <span className="slider-note-value">
                    ~{adjustedAdoption}%
                  </span>
                </p>

                <div className="slider-meta-grid">
                  <div>
                    <h4 className="chart-card-subtitle">
                      Cannibalization Risk
                    </h4>
                    <p className="slider-meta-text">
                      {idea.cannibalizationRiskLabel || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="chart-card-subtitle">
                      Sustainability Alignment
                    </h4>
                    <p className="slider-meta-text">
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
              </div> */}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureB;
