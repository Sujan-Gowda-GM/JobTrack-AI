import React, { useState } from "react";
import { analyzeResume } from "../API/analyzer";
import { jobPost } from "../API/tracker";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";
import Navbar from "./Navabar";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState({});
  const [choose, setChoose] = useState(false);

  const [company, setCompany] = useState("");
  const [jobrole, setJobrole] = useState("");
  const [salary, setSalary] = useState("");
  const [jobtype, setJobtype] = useState("Remote");
  const [status, setStatus] = useState("Applied");
  const [location, setLocation] = useState("");

  const nav = useNavigate();

  async function getInfo() {
    if (!file || !jd.trim()) {
      alert("Please submit both inputs!");
      return;
    }

    setLoading(true);
    try {
      const datapackage = new FormData();
      datapackage.append("resume_file", file);
      datapackage.append("job_description", jd);

      const result = await analyzeResume(datapackage);

      // LOGIC: Convert the raw feedback string into a clean array
      const rawFeedback = result.data.feedback || "";
      const parsedPoints = rawFeedback
        .split("\n")
        .filter(
          (line) => line.trim().startsWith("*") || /^\d+\./.test(line.trim()),
        )
        .map((line) => line.replace(/[*#]/g, "").trim());

      const feedbackArray =
        parsedPoints.length > 0 ? parsedPoints : [rawFeedback];

      // LOGIC: Handle the keyword string "['Skill']" safely
      let keywords = result.data.missing_keywords;
      if (typeof keywords === "string") {
        try {
          keywords = JSON.parse(keywords.replace(/'/g, '"'));
        } catch (e) {
          keywords = [keywords];
        }
      }

      setResponse({
        // Map backend 'ats_score' to frontend 'score'
        score: result.data.ats_score,
        ats_report: result.data.ats_report,
        missing_keywords: Array.isArray(keywords) ? keywords : [],
        feedback_points: feedbackArray,
      });
    } catch (err) {
      console.error("Frontend Error:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        nav("/login");
      } else {
        alert("We are facing some issues with the AI. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function jobApplication() {
    if (
      !company.trim() ||
      !jobrole.trim() ||
      !salary.trim() ||
      !location.trim()
    ) {
      alert("Please enter all required fields!");
      return;
    }

    try {
      await jobPost({
        company_name: company,
        job_role: jobrole,
        status: status,
        ats_score: response.score,
        job_description: jd,
        salary: salary,
        jobtype: jobtype,
        location: location,
      });

      alert("Application saved to your Job Board!");
      nav("/jobboard");
    } catch (err) {
      alert("Error saving job: " + (err.response?.data || "Unknown error"));
    }
  }

  const handleReset = () => {
    setResponse({});
    setChoose(false);
    setFile(null);
    setJd("");
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="input-section">
          <h3>Step 1: Analyze Resume</h3>
          <div className="file-upload-block">
            <label className="custom-file-upload">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              {file ? `📄 ${file.name}` : "Upload Resume (PDF)"}
            </label>
          </div>
          <div className="paste-jd-block">
            <textarea
              placeholder="Paste Job Description here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>
          <div className="submit-button">
            <button onClick={getInfo} disabled={loading}>
              {loading ? "Analyzing..." : "Submit to Gemini"}
            </button>
          </div>
        </div>

        <hr />

        <div className="display-section">
          {loading ? (
            <div className="loading-state">
              Gemini is reading your resume...
            </div>
          ) : response.score !== undefined ? (
            <>
              <div className="results-box">
                <div className="ats_score">
                  ATS Match Score: <strong>{response.score}%</strong>
                </div>

                <div className="ats_report">
                  <h4>ATS Report:</h4>
                  <p>{response.ats_report}</p>
                </div>

                <div className="missing_keywords">
                  <h4>Missing Keywords:</h4>
                  <ul className="keyword-list">
                    {response.missing_keywords?.map((word, index) => (
                      <li key={index} className="keyword-tag">
                        {word}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="feedback">
                  <h4>Detailed Feedback:</h4>
                  <ul className="feedback-points">
                    {response.feedback_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="choice">
                <p>
                  Would you like to track this application on your Job Board?
                </p>
                <button onClick={() => setChoose(true)}>Yes, Save it</button>
                <button onClick={handleReset}>No, Try Another</button>
              </div>

              {choose && (
                <div className="job-details-form">
                  <h3>Step 2: Enter Job Details</h3>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Job Role"
                    value={jobrole}
                    onChange={(e) => setJobrole(e.target.value)}
                  />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Salary (e.g. 12 LPA)"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                  <select
                    value={jobtype}
                    onChange={(e) => setJobtype(e.target.value)}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button onClick={jobApplication}>Save to Job Board</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">No analysis results yet.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
