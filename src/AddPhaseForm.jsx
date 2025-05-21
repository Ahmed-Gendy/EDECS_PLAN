import React, { useState } from "react";
import { db } from "./firebase";
import { ref, update } from "firebase/database";

function AddPhaseForm({ plan, onAdded }) {
  const [phase, setPhase] = useState({
    phase: "",
    ref: "",
    process: "",
    completion: 0,
    plannedStart: "",
    plannedEnd: "",
    actualStart: "",
    actualEnd: "",
    onTimeStatus: "On Time",
    remarks: "",
    pcf: "",
    qa: "",
    dgt: ""
  });
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhase(prev => ({
      ...prev,
      [name]: name === "completion" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const planRef = ref(db, `plans/${plan.code}`);
    const newPhases = plan.phases ? [...plan.phases, phase] : [phase];
    await update(planRef, { phases: newPhases });
    setLoading(false);
    setPhase({
      phase: "",
      ref: "",
      process: "",
      completion: 0,
      plannedStart: "",
      plannedEnd: "",
      actualStart: "",
      actualEnd: "",
      onTimeStatus: "On Time",
      remarks: "",
      pcf: "",
      qa: "",
      dgt: ""
    });
    if (onAdded) onAdded();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="row g-2 bg-light p-3 rounded mb-4 fade-in">
        <h4 className="mb-3">Add New Phase</h4>
        
        <div className="col-md-3">
          <label className="form-label">Phase</label>
          <input name="phase" className="form-control" value={phase.phase} onChange={handleChange} required />
        </div>
        
        <div className="col-md-2">
          <label className="form-label">Reference</label>
          <input name="ref" className="form-control" value={phase.ref} onChange={handleChange} required />
        </div>
        
        <div className="col-md-3">
          <label className="form-label">Process</label>
          <input name="process" className="form-control" value={phase.process} onChange={handleChange} required />
        </div>
        
        <div className="col-md-2">
          <label className="form-label">Completion %</label>
          <input 
            name="completion" 
            type="number" 
            className="form-control" 
            value={phase.completion} 
            onChange={handleChange} 
            min="0"
            max="100"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Planned Start</label>
          <input name="plannedStart" type="date" className="form-control" value={phase.plannedStart} onChange={handleChange} />
        </div>

        <div className="col-md-3">
          <label className="form-label">Planned End</label>
          <input name="plannedEnd" type="date" className="form-control" value={phase.plannedEnd} onChange={handleChange} />
        </div>

        <div className="col-md-3">
          <label className="form-label">Actual Start</label>
          <input name="actualStart" type="date" className="form-control" value={phase.actualStart} onChange={handleChange} />
        </div>

        <div className="col-md-3">
          <label className="form-label">Actual End</label>
          <input name="actualEnd" type="date" className="form-control" value={phase.actualEnd} onChange={handleChange} />
        </div>

        <div className="col-md-3">
          <label className="form-label">On Time Status</label>
          <select name="onTimeStatus" className="form-select" value={phase.onTimeStatus} onChange={handleChange}>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Early">Early</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Remarks</label>
          <input name="remarks" className="form-control" value={phase.remarks} onChange={handleChange} />
        </div>

        <div className="col-md-2">
          <label className="form-label">PCF</label>
          <input name="pcf" className="form-control" value={phase.pcf} onChange={handleChange} />
        </div>

        <div className="col-md-2">
          <label className="form-label">QA</label>
          <input name="qa" className="form-control" value={phase.qa} onChange={handleChange} />
        </div>

        <div className="col-md-2">
          <label className="form-label">DGT</label>
          <input name="dgt" className="form-control" value={phase.dgt} onChange={handleChange} />
        </div>

        <div className="col-12 mt-3 d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding Phase...
              </>
            ) : (
              "Add Phase"
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onAdded} disabled={loading}>
            Cancel
          </button>
          {loading && <span className="ms-3 text-muted">Please wait...</span>}
        </div>
      </form>
      <style jsx="true">{`
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-control, .form-select {
          transition: all 0.2s ease-in-out;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(9, 77, 80, 0.15);
          border-color: var(--primary-color);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}

export default AddPhaseForm;
