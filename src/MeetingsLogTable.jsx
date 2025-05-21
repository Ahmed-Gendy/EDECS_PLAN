import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import AddLogForm from "./AddLogForm";

function MeetingsLogTable({ plan }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!plan) {
      setMeetings([]);
      setLoading(false);
      return;
    }

    const planRef = ref(db, `plans/${plan.code}`);
    const unsubscribe = onValue(planRef, (snapshot) => {
      const planData = snapshot.val() || {};
      const meetingsData = planData.meetings || [];
      const sortedMeetings = meetingsData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setMeetings(sortedMeetings);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [plan, refresh]);

  if (loading) return <div className="text-center my-4">Loading...</div>;

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
    setShowAddModal(false);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Meetings & Follow-up Log {plan ? `- ${plan.department}` : ""}</h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Meeting
        </button>
      </div>

      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Meeting</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AddLogForm 
                  plan={plan} 
                  onAdded={handleRefresh}
                />
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setShowAddModal(false)}></div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead className="table-light">
            <tr>
              <th style={{width: "120px"}}>Date</th>
              <th style={{width: "200px"}}>Participants</th>
              <th style={{width: "200px"}}>Subject</th>
              <th>Actions Taken</th>
              <th>Conclusion</th>
              <th>Next Action</th>
              <th style={{width: "120px"}}>Planned Date</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting, idx) => (
              <tr key={idx}>
                <td>{meeting.date}</td>
                <td>{Array.isArray(meeting.participants) ? meeting.participants.join(", ") : meeting.participants}</td>
                <td>{meeting.subject}</td>
                <td style={{ whiteSpace: "pre-line" }}>{meeting.actionTaken}</td>
                <td>{meeting.conclusion}</td>
                <td>{meeting.nextAction}</td>
                <td>{meeting.plannedDate}</td>
              </tr>
            ))}
            {meetings.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No meetings found</td>
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
      `}</style>
    </div>
  );
}

export default MeetingsLogTable;
