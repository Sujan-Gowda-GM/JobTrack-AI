import React, { useEffect, useState } from "react";
import { jobList, jobUpdate, jobDelete } from "../API/tracker";
import "../Components/styles/jobboard.css";
import Navbar from "./Navabar";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobList();
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (jobId, nextStatus) => {
    try {
      await jobUpdate(jobId, { status: nextStatus });
      fetchJobs(); // Refresh the board data
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await jobDelete(jobId);
        fetchJobs();
      } catch (err) {
        alert("Failed to delete the job.");
      }
    }
  };

  const filterByStatus = (status) => jobs.filter((j) => j.status === status);

  if (loading) return <div className="loading">Loading your board...</div>;

  return (
    <>

    <Navbar/>
      <div className="job-board-container">
        <h1>My Application Tracker</h1>
        <div className="kanban-wrapper">
          <KanbanColumn
            title="Applied"
            jobs={filterByStatus("Applied")}
            onMove={(id) => handleMove(id, "Interview")}
            onDelete={handleDelete}
            btnLabel="Move to Interview"
          />
          <KanbanColumn
            title="Interview"
            jobs={filterByStatus("Interview")}
            onMove={(id) => handleMove(id, "Offer")}
            onDelete={handleDelete}
            btnLabel="Got an Offer!"
          />
          <KanbanColumn
            title="Offer"
            jobs={filterByStatus("Offer")}
            onMove={(id) => handleMove(id, "Rejected")}
            onDelete={handleDelete}
            btnLabel="Archive/Reject"
          />
        </div>
      </div>
    </>
  );
};

const KanbanColumn = ({ title, jobs, onMove, onDelete, btnLabel }) => (
  <div className="kanban-column">
    <h3>
      {title} ({jobs.length})
    </h3>
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <button className="delete-btn" onClick={() => onDelete(job.id)}>
            Delete
          </button>
          <h4>{job.company_name}</h4>
          <p>{job.job_role}</p>
          <div className="ats-badge">Match: {job.ats_score}%</div>
          <button className="action-btn" onClick={() => onMove(job.id)}>
            {btnLabel}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default JobBoard;
