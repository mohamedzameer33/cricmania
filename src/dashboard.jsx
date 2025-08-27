import React, { useContext } from "react";
import "./Dashboard.css";
import { GameStatsContext } from "./GameStatsContext";

const Dashboard = () => {
  const { stats, resetStats } = useContext(GameStatsContext);

  console.log("Dashboard stats:", stats);

  if (!stats) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", color: "#1a3c34" }}
      >
        <h2>Loading stats...</h2>
      </div>
    );
  }

  const strikeRate =
    stats.ballsFaced > 0
      ? ((stats.runs / stats.ballsFaced) * 100).toFixed(2)
      : 0;
console.log(stats.ballsFaced);
     

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center dash1"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <h1
          className="text-center mb-4 text-dark fw-bold"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
            color: "#1a3c34",
          }}
        >
          Cric Mania Dashboard
        </h1>
        <p
          className="text-center mb-4 text-muted"
          style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            fontStyle: "italic",
          }}
        >
          Your batting stats at a glance!
        </p>
        <div
          className="card shadow-lg mb-4"
          style={{
            borderRadius: "10px",
            border: "2px solid #00cc88",
            overflow: "hidden",
          }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead style={{ background: "#007bff", color: "white" }}>
                  <tr>
                    <th
                      scope="col"
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
                    >
                      Stats
                    </th>
                    <th
                      scope="col"
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Matches Won
                    </td>
                    <td
                      className="text-center py-2"
                      style={{
                        fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
                        color: "#00cc88",
                      }}
                    >
                      {stats.wins}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Matches Lost
                    </td>
                    <td
                      className="text-center py-2"
                      style={{
                        fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
                        color: "#ff4500",
                      }}
                    >
                      {stats.losses}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Runs Scored
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {stats.runs}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Wickets lost
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {stats.wickets}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Fours
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {stats.fours}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Sixes
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {stats.sixes}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Dot Balls
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {stats.dots}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="text-center py-2 fw-bold"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      Strike Rate
                    </td>
                    <td
                      className="text-center py-2"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
                    >
                      {strikeRate}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={resetStats}
            className="btn btn-danger"
            style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "2px solid #ff4500",
              background: "var(--red, #ff4500)",
              color: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e03e00";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--red, #ff4500)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
