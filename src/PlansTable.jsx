import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, remove } from "firebase/database";
import AddPlanForm from "./AddPlanForm";
import Header from "./components/Header";

function PlansTable({ onSelect }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const plansRef = ref(db, "plans");
    const unsubscribe = onValue(plansRef, (snapshot) => {
      const data = snapshot.val() || {};
      const plansArray = Object.entries(data).map(([code, plan]) => ({
        ...plan,
        code: code
      }));
      plansArray.sort((a, b) => parseInt(a.code) - parseInt(b.code));
      setPlans(plansArray);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (code) => {
    if (window.confirm(`Are you sure you want to delete plan ${code}?`)) {
      try {
        const planRef = ref(db, `plans/${code}`);
        await remove(planRef);
      } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Error occurred while deleting the plan");
      }
    }
  };

  if (loading) return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading plans...</p>
    </div>
  );

  return (
    <>
      <div className="container-fluid">
        {/* Main Content */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Digitalization Plans List</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Plan
          </button>
        </div>

        {/* Add Plan Modal */}
        {showAddModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">              <div className="modal-header">
                <button 
                  type="button" 
                  className="btn-close me-3" 
                  style={{ marginLeft: "-8px" }}
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
                <h5 className="modal-title">Add New Plan</h5>
              </div>
                <div className="modal-body">
                  <AddPlanForm 
                    onSuccess={() => {
                      setShowAddModal(false);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-backdrop show" onClick={() => setShowAddModal(false)}></div>
          </div>
        )}

        {/* Plans Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Department</th>
                <th>Process</th>
                <th>Status</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={plan.code}>
                  <td>{index + 1}</td>
                  <td>{plan.department}</td>
                  <td>{plan.process}</td>
                  <td>{plan.status}</td>
                  <td>{plan.type === "phases" ? "Phases" : "Records"}</td>
                  <td>{plan.owner}</td>
                  <td>
                    <button 
                      className="btn btn-outline-primary btn-sm me-2" 
                      onClick={() => onSelect(plan)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => handleDelete(plan.code)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No plans found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>      <style jsx="true">{`
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
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" 
        />
      </div>
    </>
  );
}

export default PlansTable;
