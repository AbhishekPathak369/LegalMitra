import React, { useEffect, useState } from "react";
import casesData from "../../../assets/data/cases.json";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "./bailpredic.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function BailDashboard() {
  const [search, setSearch] = useState("");
  const [filteredCases, setFilteredCases] = useState([]);
  const [bailProbability, setBailProbability] = useState(0);
  const [displayCases, setDisplayCases] = useState([]);
  const [mostCommonIPC, setMostCommonIPC] = useState("");
  const [mostCommonCrime, setMostCommonCrime] = useState("");

  // Filters
  const [courtFilter, setCourtFilter] = useState("");
  const [crimeFilter, setCrimeFilter] = useState("");
  const [bailFilter, setBailFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const courts = [...new Set(casesData.map(c => c.court).filter(Boolean))];
  const crimes = [...new Set(casesData.map(c => c.crime_type).filter(Boolean))];
  const regions = [...new Set(casesData.map(c => c.region).filter(Boolean))];

  useEffect(() => {
    filterCases();
  }, [search, courtFilter, crimeFilter, bailFilter, regionFilter]);

  const filterCases = () => {
    let filtered = casesData.filter(c =>
      (c.case_title?.toLowerCase().includes(search.toLowerCase()) ||
       c.court?.toLowerCase().includes(search.toLowerCase()) ||
       c.crime_type?.toLowerCase().includes(search.toLowerCase()) ||
       c.accused_name?.toLowerCase().includes(search.toLowerCase()) ||
       c.judge?.toLowerCase().includes(search.toLowerCase()) ||
       c.region?.toLowerCase().includes(search.toLowerCase()) ||
       (Array.isArray(c.ipc_sections) && c.ipc_sections.join(",").toLowerCase().includes(search.toLowerCase())))
    );

    if (courtFilter) filtered = filtered.filter(c => c.court === courtFilter);
    if (crimeFilter) filtered = filtered.filter(c => c.crime_type === crimeFilter);
    if (bailFilter) {
      if (bailFilter === "granted") {
        filtered = filtered.filter(c => c.bail_outcome?.toLowerCase() === "granted");
      } else if (bailFilter === "rejected") {
        filtered = filtered.filter(c => c.bail_outcome?.toLowerCase() === "rejected");
      }
    }
    if (regionFilter) filtered = filtered.filter(c => c.region === regionFilter);

    setFilteredCases(filtered);
    
    const casesToShow = Math.max(filtered.length, 5);
    const cases = filtered.slice(0, casesToShow);
    setDisplayCases(cases);

    const bailGranted = filtered.filter(c => c.bail_outcome?.toLowerCase() === "granted").length;
    setBailProbability(filtered.length ? ((bailGranted / filtered.length) * 100).toFixed(1) : 0);

    const ipcCounts = {};
    filtered.forEach(c => {
      if (Array.isArray(c.ipc_sections)) {
        c.ipc_sections.forEach(sec => {
          ipcCounts[sec] = (ipcCounts[sec] || 0) + 1;
        });
      }
    });
    setMostCommonIPC(Object.keys(ipcCounts).reduce((a, b) => ipcCounts[a] > ipcCounts[b] ? a : b, "N/A"));

    const crimeCounts = {};
    filtered.forEach(c => {
      if (c.crime_type) {
        crimeCounts[c.crime_type] = (crimeCounts[c.crime_type] || 0) + 1;
      }
    });
    setMostCommonCrime(Object.keys(crimeCounts).reduce((a, b) => crimeCounts[a] > crimeCounts[b] ? a : b, "N/A"));
  };

  const pieData = {
    labels: ["Bail Granted", "Bail Rejected"],
    datasets: [{
      data: [
        filteredCases.filter(c => c.bail_outcome?.toLowerCase() === "granted").length,
        filteredCases.filter(c => c.bail_outcome?.toLowerCase() === "rejected").length
      ],
      backgroundColor: ["#06b6d4", "#7c3aed"],
    }]
  };

  const barCounts = filteredCases.reduce((acc, c) => {
    if (c.crime_type) acc[c.crime_type] = (acc[c.crime_type] || 0) + 1;
    return acc;
  }, {});
  
  const barData = {
    labels: Object.keys(barCounts),
    datasets: [{ 
      label: "Crime Type Count", 
      data: Object.values(barCounts), 
      backgroundColor: "#06b6d4" 
    }]
  };

  return (
    <div className="bail-dashboard">
      <div className="bail-container">
        <h1 className="bail-title">Bail Cases Dashboard</h1>
        
        <input
          type="text"
          placeholder="Search by title, court, crime type, IPC section, judge, region..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bail-search"
        />

        {/* Filters */}
        <div className="bail-filters">
          <select 
            value={courtFilter} 
            onChange={e => setCourtFilter(e.target.value)} 
            className="bail-filter-select"
          >
            <option value="">All Courts</option>
            {courts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={crimeFilter} 
            onChange={e => setCrimeFilter(e.target.value)} 
            className="bail-filter-select"
          >
            <option value="">All Crime Types</option>
            {crimes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={bailFilter} 
            onChange={e => setBailFilter(e.target.value)} 
            className="bail-filter-select"
          >
            <option value="">All Bail Outcomes</option>
            <option value="granted">Granted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select 
            value={regionFilter} 
            onChange={e => setRegionFilter(e.target.value)} 
            className="bail-filter-select"
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Stats Panel */}
        <div className="bail-stats">
          <div className="bail-stat-card">
            <div className="bail-stat-label">Bail Probability</div>
            <div className="bail-stat-value" style={{ color: "#06b6d4" }}>{bailProbability}%</div>
          </div>
          <div className="bail-stat-card">
            <div className="bail-stat-label">Total Cases</div>
            <div className="bail-stat-value" style={{ color: "#7c3aed" }}>{filteredCases.length}</div>
          </div>
          <div className="bail-stat-card">
            <div className="bail-stat-label">Most Common IPC</div>
            <div className="bail-stat-value" style={{ color: "#06b6d4" }}>{mostCommonIPC}</div>
          </div>
          <div className="bail-stat-card">
            <div className="bail-stat-label">Most Common Crime</div>
            <div className="bail-stat-value" style={{ color: "#7c3aed" }}>{mostCommonCrime}</div>
          </div>
        </div>

        {/* Scrollable Cases Section */}
        <div className="bail-cases-section">
          <h2 className="bail-section-title">Case Details</h2>
          
          <div className="bail-cases-container">
            {displayCases.length > 0 ? (
              displayCases.map((c, index) => (
                <div key={c.case_id || index} className="bail-case-card">
                  <h3 className="bail-case-title">
                    {c.case_title || "Case Title Not Available"}
                  </h3>
                  
                  <div className="bail-case-details">
                    <div><strong>Court:</strong> {c.court || "N/A"}</div>
                    <div><strong>Date:</strong> {c.date || "N/A"}</div>
                    <div><strong>Judge:</strong> {c.judge || "N/A"}</div>
                    <div><strong>Accused:</strong> {c.accused_name || "N/A"} {c.accused_gender ? `(${c.accused_gender})` : ""}</div>
                    <div>
                      <strong>Bail Outcome:</strong> 
                      <span style={{ 
                        color: c.bail_outcome?.toLowerCase() === "granted" ? "#06b6d4" : "#7c3aed",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {c.bail_outcome || "N/A"}
                      </span>
                    </div>
                    <div><strong>Crime Type:</strong> {c.crime_type || "N/A"}</div>
                    <div><strong>Region:</strong> {c.region || "N/A"}</div>
                  </div>
                  
                  <div className="bail-ipc-section">
                    <strong>IPC Sections:</strong> {Array.isArray(c.ipc_sections) ? c.ipc_sections.join(", ") : "N/A"}
                  </div>
                  
                  <details className="bail-details">
                    <summary className="bail-summary">
                      View Full Case Details
                    </summary>
                    <div className="bail-full-details">
                      <p><strong>Facts:</strong> {c.facts || "No facts available"}</p>
                      <p><strong>Summary:</strong> {c.summary || "No summary available"}</p>
                      <p><strong>Legal Issues:</strong> {Array.isArray(c.legal_issues) ? c.legal_issues.join("; ") : "N/A"}</p>
                      <p><strong>Judgment Reason:</strong> {c.judgment_reason || "N/A"}</p>
                    </div>
                  </details>
                </div>
              ))
            ) : (
              <div className="bail-no-cases">
                No cases found matching your criteria.
              </div>
            )}
          </div>
          
          {filteredCases.length > 5 && (
            <p className="bail-cases-count">
              Showing {filteredCases.length} cases (scroll to see more)
            </p>
          )}
        </div>

        {/* Charts */}
        <div className="bail-charts">
          <div className="bail-chart-container">
            <h3 className="bail-chart-title">Bail Outcome Distribution</h3>
            <div className="bail-chart-wrapper">
              <Pie 
                data={pieData} 
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#e6eef6"
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          <div className="bail-chart-container">
            <h3 className="bail-chart-title">Crime Type Distribution</h3>
            <div className="bail-chart-wrapper">
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#e6eef6"
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#e6eef6"
                      },
                      grid: {
                        color: "#374151"
                      }
                    },
                    y: {
                      ticks: {
                        color: "#e6eef6"
                      },
                      grid: {
                        color: "#374151"
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}