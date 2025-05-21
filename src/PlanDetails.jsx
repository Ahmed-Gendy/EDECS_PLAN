import React, { useState } from "react";
import AddPhaseForm from "./AddPhaseForm";
import AddLogForm from "./AddLogForm";
import EditPlanForm from "./EditPlanForm";
import MeetingsLogTable from "./MeetingsLogTable";
import DigitalizationPhaseTable from "./DigitalizationPhaseTable";

function PlanDetails({ plan, onBack }) {
  const [refresh, setRefresh] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [activeTab, setActiveTab] = useState("details");

  if (!currentPlan) return null;

  return (
    <div className="card p-4 my-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>Back</button>
      {!editMode ? (
        <>
          <button className="btn btn-warning mb-3 ms-2" onClick={() => setEditMode(true)}>Edit Plan</button>
          <h2 className="mb-3">{currentPlan.department}</h2>
          
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
                style={{ color: '#094d50', borderColor: activeTab === 'details' ? '#094d50' : 'transparent' }}
              >
                Details
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'meetings' ? 'active' : ''}`}
                onClick={() => setActiveTab('meetings')}
                style={{ color: '#094d50', borderColor: activeTab === 'meetings' ? '#094d50' : 'transparent' }}
              >
                Meetings Log
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'phases' ? 'active' : ''}`}
                onClick={() => setActiveTab('phases')}
                style={{ color: '#094d50', borderColor: activeTab === 'phases' ? '#094d50' : 'transparent' }}
              >
                Digitalization Phases
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="plan-summary">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-2">Basic Information</h5>
                  <div className="row g-3">
                    <div className="col-md-4 d-none">
                      <div className="detail-item">
                        <label className="text-muted">Department</label>
                        <div className="h5">{currentPlan.department}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Status</label>
                        <div className="h5">
                          <span className={`badge ${
                            currentPlan.status === 'Completed' ? 'bg-success' :
                            currentPlan.status === 'In Process' ? 'bg-warning' :
                            'bg-secondary'
                          }`}>
                            {currentPlan.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Type</label>
                        <div className="h5">{currentPlan.type === "phases" ? "Phases" : "Records"}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Process</label>
                        <div className="h5">{currentPlan.process || '-'}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Sub Process</label>
                        <div className="h5">{currentPlan.subProcess || '-'}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Process Category</label>
                        <div className="h5">{currentPlan.processCategory || '-'}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Owner</label>
                        <div className="h5">{currentPlan.owner || '-'}</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Priority</label>
                        <div className="h5">
                          <span className={`badge ${
                            currentPlan.priority === 'A' ? 'bg-danger' :
                            currentPlan.priority === 'B' ? 'bg-warning' :
                            'bg-info'
                          }`}>
                            {currentPlan.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="detail-item">
                        <label className="text-muted">Project Code</label>
                        <div className="h5">{currentPlan.projectCode || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-2">Progress Overview</h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="overall-progress">
                        <label className="text-muted mb-2">Overall Progress</label>
                        <div className="progress" style={{ height: "25px" }}>
                          {currentPlan.phases && currentPlan.phases.length > 0 ? (
                            <div
                              className={`progress-bar ${
                                (currentPlan.phases.reduce((acc, phase) => acc + (phase.completion || 0), 0) / currentPlan.phases.length) < 30 ? 'bg-danger' :
                                (currentPlan.phases.reduce((acc, phase) => acc + (phase.completion || 0), 0) / currentPlan.phases.length) < 70 ? 'bg-warning' :
                                'bg-success'
                              }`}
                              style={{ 
                                width: `${currentPlan.phases.reduce((acc, phase) => acc + (phase.completion || 0), 0) / currentPlan.phases.length}%` 
                              }}
                            >
                              {Math.round(currentPlan.phases.reduce((acc, phase) => acc + (phase.completion || 0), 0) / currentPlan.phases.length)}%
                            </div>
                          ) : (
                            <div className="progress-bar" style={{ width: "0%" }}>0%</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="phases-status">
                        <label className="text-muted mb-2">Phases Status</label>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Completed</span>
                          <span className="badge bg-success">
                            {currentPlan.phases?.filter(p => (p.completion || 0) === 100).length || 0}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>In Progress</span>
                          <span className="badge bg-warning">
                            {currentPlan.phases?.filter(p => (p.completion || 0) > 0 && (p.completion || 0) < 100).length || 0}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Not Started</span>
                          <span className="badge bg-danger">
                            {currentPlan.phases?.filter(p => !p.completion || p.completion === 0).length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="phases-meetings-count">
                        <div className="row text-center g-3">
                          <div className="col-md-6">
                            <div className="p-3 border rounded">
                              <div className="text-muted mb-1">Total Phases</div>
                              <h3 className="mb-0">{currentPlan.phases?.length || 0}</h3>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="p-3 border rounded">
                              <div className="text-muted mb-1">Total Meetings</div>
                              <h3 className="mb-0">{currentPlan.meetings?.length || 0}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meetings' && <MeetingsLogTable plan={currentPlan} />}
          {activeTab === 'phases' && <DigitalizationPhaseTable plan={currentPlan} />}
        </>
      ) : (
        <EditPlanForm plan={currentPlan} onUpdated={(p) => { setCurrentPlan(p); setEditMode(false); }} onCancel={() => setEditMode(false)} />
      )}

      <style jsx="true">{`
        .detail-item {
          margin-bottom: 1rem;
        }
        .detail-item label {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        .detail-item .h5 {
          margin-bottom: 0;
        }
        .progress {
          background-color: #e9ecef;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        .progress-bar {
          transition: width 1s ease;
        }
        .badge {
          padding: 0.5em 0.8em;
          font-weight: 500;
        }
        .card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .plan-summary .card-title {
          color: #495057;
        }
      `}</style>
    </div>
  );
}

export default PlanDetails;
