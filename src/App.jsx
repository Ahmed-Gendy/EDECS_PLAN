import './App.css';
import PlansTable from "./PlansTable";
import PlanDetails from "./PlanDetails";
import Dashboard from "./Dashboard";
import AddPlanForm from "./AddPlanForm";
import React, { useState } from "react";

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleBack = () => {
    setSelectedPlan(null);
  };

  const renderView = () => {
    if (selectedPlan) {
      return (
        <PlanDetails 
          plan={selectedPlan} 
          onBack={handleBack}
        />
      );
    }

    return (
      <PlansTable 
        onSelect={(plan) => {
          setSelectedPlan(plan);
        }}
        key={refresh}
      />
    );
  };

  return (
    <div className="container-fluid py-4">
      {renderView()}
    </div>
  );
}

export default App;
