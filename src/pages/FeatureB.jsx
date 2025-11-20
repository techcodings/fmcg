// src/pages/FeatureB.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiSend, FiZap } from "react-icons/fi";
import { FaFileImage } from "react-icons/fa";
import {
  generateProductIdea,
  generateProductMockup,
} from "../api.js";

const FeatureB = () => {
  // Chat messages – shorter, more “system message” style
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content:
        "Hi, I’m your AI Product Ideation Agent.\n\nDescribe the FMCG product you want to launch and I’ll turn it into a concept with numbers and a packaging mockup.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");

  // For image mockup
  const [mockupUrl, setMockupUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Scenario sliders (kept for future use)
  const [price, setPrice] = useState(5.99); // USD
  const [ecoPackage, setEcoPackage] = useState(75); // %

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  // Quick example prompts (chips under the intro)
  const quickPrompts = [
    "Suggest a new energy drink flavor for Gen Z in Southeast Asia with eco-friendly packaging.",
    "Give me a low-sugar biscuit concept for working professionals in India.",
    "Propose a premium cold coffee drink for college students with recyclable bottles.",
  ];

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

      // 3) Generate image mockup (demo)
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

  // (Kept for future slider use – currently hidden in UI)
  const adjustedAdoption = (() => {
    const base =
      idea && typeof idea.adoptionProbability === "number"
        ? idea.adoptionProbability
        : 70;
    const ecoBonus = (ecoPackage - 75) / 10;
    const pricePenalty = (price - 5.99) * 2;
    return Math.max(0, Math.min(100, base + ecoBonus - pricePenalty)).toFixed(
      1
    );
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
        <div>
          <h1>AI Product Ideation Agent</h1>
          <p className="page-subtitle">
            Chat with an AI R&amp;D partner that turns your FMCG briefs into
            launch-ready concepts.
          </p>
        </div>
      </div>

      {/* Top strip like ChatGPT – short and clean */}
      <div className="featureb-intro">
        <div className="featureb-pill">
          <FiCpu />
          <span>Describe a product you want to launch. I’ll handle the rest.</span>
        </div>
        <p>
          Behind the scenes the demo imagines using product images, reviews,
          sales data and industry reports – but here the numbers are synthetic,
          just to show the workflow.
        </p>

        <div className="featureb-prompts">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="featureb-prompt-chip"
              onClick={() => setInput(prompt)}
            >
              {idx === 0 && "⚡ "}
              {prompt}
            </button>
          ))}
        </div>
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
                Demo only – AI imagines images, reviews, sales & reports behind
                the scenes.
              </span>
            </div>
          </form>

          {error && (
            <div className="empty-state" style={{ marginTop: "0.5rem" }}>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT: Insights & snapshot (unchanged layout) */}
        <div className="side-column">
          {!idea && (
            <div className="info-card side-placeholder">
              <h3 className="chart-card-title">Concept snapshot</h3>
              <p className="info-text">
                Once you send a brief, this panel will show a quick packaging
                mockup plus adoption, sales and other key signals for the latest
                concept.
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

              {/* Sliders kept in code, can be re-enabled when you want */}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureB;
