import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, phases: 0, logs: 0 });

  useEffect(() => {
    const plansRef = ref(db, "plans");
    const unsubscribe = onValue(plansRef, (snapshot) => {
      const data = snapshot.val() || {};
      const plansArr = Object.values(data);
      setStats({
        total: plansArr.length,
        phases: plansArr.filter((p) => p.type === "phases").length,
        logs: plansArr.filter((p) => p.type === "logs").length,
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="alert alert-info my-3">
        <h2 className="text-center mb-4">System Dashboard</h2>
        <div className="row">
          <div className="col">
            <div className="card text-center p-3">
              <h4>{stats.total}</h4>
              <p className="mb-0">Total Plans</p>
            </div>
          </div>
          <div className="col">
            <div className="card text-center p-3">
              <h4>{stats.phases}</h4>
              <p className="mb-0">Plans with Phases</p>
            </div>
          </div>
          <div className="col">
            <div className="card text-center p-3">
              <h4>{stats.logs}</h4>
              <p className="mb-0">Plans with Logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
