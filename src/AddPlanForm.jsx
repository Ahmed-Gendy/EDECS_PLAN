import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

function AddPlanForm({ onAdded, onBack }) {
  const [nextCode, setNextCode] = useState("1");
  const [form, setForm] = useState({
    code: "",
    department: "",
    process: "",
    status: "Planned",
    type: "phases",
    owner: "",
    digitalizationApplicable: true,
    priority: "C",
    processCategory: "",
    subProcess: "",
    tool: "",
    projectCode: "",
    generalCompletion: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // جلب عدد الخطط الحالية لتحديد الرقم التسلسلي التالي
    const plansRef = ref(db, "plans");
    const unsubscribe = onValue(plansRef, (snapshot) => {
      const data = snapshot.val() || {};
      const plansCount = Object.keys(data).length;
      const nextNumber = plansCount + 1;
      setNextCode(nextNumber.toString());
      setForm(prev => ({ ...prev, code: nextNumber.toString() }));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const planData = { 
      ...form,
      meetings: [],  // Initialize empty meetings array for all plans
      phases: []     // Initialize empty phases array for all plans
    };
    await push(ref(db, "plans"), planData);
    setLoading(false);
    setForm({
      code: (parseInt(nextCode) + 1).toString(),
      department: "",
      process: "",
      status: "Planned",
      type: "phases",
      owner: "",
      digitalizationApplicable: true,
      priority: "C",
      processCategory: "",
      subProcess: "",
      tool: "",
      projectCode: "",
      generalCompletion: 0,
    });
    if (onAdded) onAdded();
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4">

        <h2 className="mb-0">Add New Plan</h2>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="row g-2 bg-light p-3 rounded mb-4">
        <div className="col-md-2">
          <input 
            name="code" 
            className="form-control" 
            placeholder="الكود" 
            value={form.code}
            onChange={handleChange}
            required 
            readOnly 
          />
        </div>
        <div className="col-md-2">
          <input name="department" className="form-control" placeholder="Department" value={form.department} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <input name="process" className="form-control" placeholder="Process" value={form.process} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <input name="subProcess" className="form-control" placeholder="Sub Process" value={form.subProcess} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input name="processCategory" className="form-control" placeholder="Process Category" value={form.processCategory} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input name="owner" className="form-control" placeholder="Owner" value={form.owner} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input name="tool" className="form-control" placeholder="Tool" value={form.tool} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input name="projectCode" className="form-control" placeholder="Project Code" value={form.projectCode} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <select name="type" className="form-select" value={form.type} onChange={handleChange}>
            <option value="phases">Phases</option>
            <option value="logs">Logs</option>
          </select>
        </div>
        <div className="col-md-2">
          <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="col-md-2">
          <select name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="Planned">Planned</option>
            <option value="In Process">In Process</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-center">
          <label className="form-check-label ms-2">
            Digitalization Applicable?
            <input type="checkbox" className="form-check-input ms-1" name="digitalizationApplicable" checked={form.digitalizationApplicable} onChange={handleChange} />
          </label>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100" disabled={loading}>{loading ? "جاري الإضافة..." : "إضافة"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddPlanForm;
