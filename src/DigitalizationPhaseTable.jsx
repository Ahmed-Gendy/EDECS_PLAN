import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, update } from "firebase/database";
import AddPhaseForm from "./AddPhaseForm";

function DigitalizationPhaseTable({ plan }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPhase, setEditingPhase] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!plan) {
      setPhases([]);
      setLoading(false);
      return;
    }

    const planRef = ref(db, `plans/${plan.code}`);
    const unsubscribe = onValue(planRef, (snapshot) => {
      const planData = snapshot.val() || {};
      setPhases(planData.phases || []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [plan, refresh]);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
    setShowAddModal(false);
  };

  const handleEdit = (phase, index) => {
    setEditingPhase(index);
    setEditForm({ ...phase });
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this phase?')) {
      const newPhases = phases.filter((_, i) => i !== index);
      const planRef = ref(db, `plans/${plan.code}`);
      await update(planRef, { phases: newPhases });
    }
  };

  const handleUpdate = async (index) => {
    const newPhases = [...phases];
    newPhases[index] = editForm;
    const planRef = ref(db, `plans/${plan.code}`);
    await update(planRef, { phases: newPhases });
    setEditingPhase(null);
    setEditForm(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading phases...</p>
    </div>
  );

  const renderEditRow = (phase, idx) => (
    <>
      <td><input type="text" className="form-control form-control-sm" name="phase" value={editForm.phase} onChange={handleChange} /></td>
      <td><input type="text" className="form-control form-control-sm" name="ref" value={editForm.ref} onChange={handleChange} /></td>
      <td><input type="text" className="form-control form-control-sm" name="process" value={editForm.process} onChange={handleChange} /></td>
      <td><input type="number" className="form-control form-control-sm" name="completion" value={editForm.completion} onChange={handleChange} /></td>
      <td><input type="text" className="form-control form-control-sm" name="plannedStart" value={editForm.plannedStart} onChange={handleChange} /></td>
      <td><input type="text" className="form-control form-control-sm" name="plannedEnd" value={editForm.plannedEnd} onChange={handleChange} /></td>
      <td>
        <button className="btn btn-success btn-sm me-1" onClick={() => handleUpdate(idx)}>Save</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditingPhase(null)}>Cancel</button>
      </td>
    </>
  );

  const renderViewRow = (phase, idx) => (
    <>
      <td>
        <div className="fw-medium">{phase.phase}</div>
        <div className="small text-muted">{phase.actualStart ? 'Active' : 'Not Started'}</div>
      </td>
      <td>{phase.ref}</td>
      <td>{phase.process}</td>
      <td>
        <div className="d-flex align-items-center">
          <div className="progress flex-grow-1" style={{ height: "8px" }}>
            <div 
              className={`progress-bar ${
                phase.completion < 30 ? 'bg-danger' : 
                phase.completion < 70 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${phase.completion}%` }}
            ></div>
          </div>
          <span className="ms-2 small">{phase.completion}%</span>
        </div>
      </td>
      <td>{phase.plannedStart}</td>
      <td>{phase.plannedEnd}</td>
      <td>
        <div className="btn-group action-buttons">
          <button 
            className="btn btn-info btn-sm" 
            onClick={() => setSelectedPhase(phase)}
            title="View phase details"
          >
            <i className="bi bi-eye"></i> Details
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => handleEdit(phase, idx)}
            title="Edit phase"
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button 
            className="btn btn-danger btn-sm" 
            onClick={() => handleDelete(idx)}
            title="Delete phase"
          >
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Digitalization Phases {plan ? `- ${plan.department}` : ""}</h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Phase
        </button>
      </div>

      {/* Add Phase Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Phase</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AddPhaseForm 
                  plan={plan} 
                  onAdded={handleRefresh}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase Details Modal */}
      {selectedPhase && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Digitalization Phases Summary</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedPhase(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="phase-status-summary p-3 mb-4 rounded">
                  <h6 className="border-bottom pb-2">Overall Implementation Status</h6>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center px-3">
                      <div className="fs-4 fw-bold text-primary">
                        {Math.round(phases.reduce((acc, phase) => acc + phase.completion, 0) / phases.length)}%
                      </div>
                      <div className="text-muted small">Overall Completion</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="fs-4 fw-bold text-success">
                        {phases.filter(p => p.completion === 100).length}
                      </div>
                      <div className="text-muted small">Completed Phases</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="fs-4 fw-bold text-warning">
                        {phases.filter(p => p.completion > 0 && p.completion < 100).length}
                      </div>
                      <div className="text-muted small">In Progress</div>
                    </div>
                    <div className="text-center px-3">
                      <div className="fs-4 fw-bold text-danger">
                        {phases.filter(p => p.completion === 0).length}
                      </div>
                      <div className="text-muted small">Not Started</div>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: "25px" }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ 
                        width: `${(phases.filter(p => p.completion === 100).length / phases.length) * 100}%` 
                      }}
                    >
                      Completed
                    </div>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ 
                        width: `${(phases.filter(p => p.completion > 0 && p.completion < 100).length / phases.length) * 100}%` 
                      }}
                    >
                      In Progress
                    </div>
                    <div 
                      className="progress-bar bg-danger" 
                      style={{ 
                        width: `${(phases.filter(p => p.completion === 0).length / phases.length) * 100}%` 
                      }}
                    >
                      Not Started
                    </div>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Phase</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Timeline</th>
                        <th>Time Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.map((phase, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="fw-medium">{phase.phase}</div>
                            <div className="small text-muted">Ref: {phase.ref}</div>
                          </td>
                          <td>
                            <span className={`badge ${
                              phase.completion === 100 ? 'bg-success' :
                              phase.completion > 0 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {phase.completion === 100 ? 'Completed' :
                               phase.completion > 0 ? 'In Progress' : 'Not Started'}
                            </span>
                          </td>
                          <td style={{ width: "250px" }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                <div 
                                  className={`progress-bar ${
                                    phase.completion < 30 ? 'bg-danger' : 
                                    phase.completion < 70 ? 'bg-warning' : 'bg-success'
                                  }`}
                                  style={{ width: `${phase.completion}%` }}
                                ></div>
                              </div>
                              <span className="small">{phase.completion}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="small">
                              <div><i className="bi bi-calendar-check text-success me-1"></i> {phase.plannedStart} - {phase.plannedEnd}</div>
                              {phase.actualStart && (
                                <div className="text-muted">
                                  <i className="bi bi-calendar-event text-primary me-1"></i> {phase.actualStart} - {phase.actualEnd || 'Ongoing'}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              phase.onTimeStatus === 'On Time' ? 'bg-success' :
                              phase.onTimeStatus === 'Delayed' ? 'bg-danger' : 'bg-info'
                            }`}>
                              {phase.onTimeStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedPhase(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead className="table-light">
            <tr>
              <th>Phase</th>
              <th>Ref</th>
              <th>Process</th>
              <th>Completion</th>
              <th>Planned Start</th>
              <th>Planned End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase, idx) => (
              <tr key={idx}>
                {editingPhase === idx ? renderEditRow(phase, idx) : renderViewRow(phase, idx)}
              </tr>
            ))}
            {phases.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No phases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <style jsx="true">{`
        .modal {
          z-index: 1055;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-backdrop {
          display: none;
        }
        .modal.show .modal-dialog {
          animation: modal-show 0.3s ease-out;
        }
        @keyframes modal-show {
          from {
            transform: translateY(-10%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .action-buttons .btn {
          transition: all 0.2s ease-in-out;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .action-buttons .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .action-buttons .btn i {
          font-size: 0.875rem;
        }
        .phase-status-summary {
          background: #f8f9fa;
          border-left: 4px solid #094d50;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .phase-status-summary h6 {
          color: #495057;
          margin-bottom: 1rem;
        }
        .progress {
          background-color: #e9ecef;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        .progress-bar {
          transition: width 1s ease;
        }
        .alert {
          margin-bottom: 0;
        }
        .badge {
          padding: 0.5em 0.8em;
          font-weight: 500;
        }
        .table td {
          vertical-align: middle;
        }
        .modal-dialog {
          max-width: 900px;
        }
        .modal-body .table {
          font-size: 0.9375rem;
        }
        .modal-body .progress {
          min-width: 100px;
        }
      `}</style>
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" 
      />
    </div>
  );
}

export default DigitalizationPhaseTable;
