import React, { useState } from "react";
import { db } from "./firebase";
import { ref, update } from "firebase/database";

function AddLogForm({ plan, onAdded }) {
  const [log, setLog] = useState({
    date: new Date().toISOString().split('T')[0],
    participants: "",
    subject: "",
    actionTaken: "",
    conclusion: "",
    nextAction: "",
    plannedDate: "",
  });
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const planRef = ref(db, `plans/${plan.code}`);
      const newLog = {
        ...log,
        participants: log.participants.split(",").map(p => p.trim()).filter(p => p)
      };
      const newMeetings = plan.meetings ? [...plan.meetings, newLog] : [newLog];
      await update(planRef, { meetings: newMeetings });
      
      if (onAdded) onAdded();
    } catch (error) {
      console.error("Error adding meeting:", error);
      alert("Error occurred while adding the meeting");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={log.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Participants (comma separated)</label>
          <input
            type="text"
            name="participants"
            className="form-control"
            value={log.participants}
            onChange={handleChange}
            placeholder="John Doe, Jane Smith"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            className="form-control"
            value={log.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Actions Taken</label>
          <textarea
            name="actionTaken"
            className="form-control"
            value={log.actionTaken}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Conclusion</label>
          <textarea
            name="conclusion"
            className="form-control"
            value={log.conclusion}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">Next Action</label>
          <input
            type="text"
            name="nextAction"
            className="form-control"
            value={log.nextAction}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Planned Date</label>
          <input
            type="date"
            name="plannedDate"
            className="form-control"
            value={log.plannedDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 text-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Meeting"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddLogForm;
