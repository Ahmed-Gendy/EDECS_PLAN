import React, { useState } from "react";
import { db } from "./firebase";
import { ref, update } from "firebase/database";

function EditPlanForm({ plan, onUpdated, onCancel }) {
  const [form, setForm] = useState({ ...plan });
  const [loading, setLoading] = useState(false);

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
    const planRef = ref(db, `plans/${plan.code}`);
    
    // إضافة المصفوفات الفارغة للاجتماعات والمراحل إذا لم تكن موجودة
    const updatedForm = {
      ...form,
      meetings: form.meetings || [],
      phases: form.phases || []
    };
    
    await update(planRef, updatedForm);
    setLoading(false);
    if (onUpdated) onUpdated({ ...updatedForm });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 bg-warning bg-opacity-10 p-3 rounded mb-4">
      <h3 className="mb-3">Edit Plan</h3>
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
        <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
      <div className="col-md-2">
        <button type="button" className="btn btn-secondary w-100" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditPlanForm;
