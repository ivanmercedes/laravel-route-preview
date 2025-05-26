import React from "react";

interface MethodFilterProps {
  selectedMethods: string[];
  onFilterChange: (methods: string[]) => void;
}

const AVAILABLE_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

const MethodFilter: React.FC<MethodFilterProps> = ({
  selectedMethods,
  onFilterChange,
}) => {
  console.log("selectedMethods", selectedMethods);
  console.log("onFilterChange", onFilterChange);
  const handleMethodToggle = (method: string) => {
    const newSelectedMethods = selectedMethods.includes(method)
      ? selectedMethods.filter((m) => m !== method)
      : [...selectedMethods, method];
    onFilterChange(newSelectedMethods);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_METHODS.map((method) => (
        <button
          key={method}
          onClick={() => handleMethodToggle(method)}
          className={`btn-method ${
            selectedMethods.includes(method)
              ? "btn-method-active"
              : "btn-method-inactive"
          }`}
        >
          {method}
        </button>
      ))}
    </div>
  );
};

export default MethodFilter;
