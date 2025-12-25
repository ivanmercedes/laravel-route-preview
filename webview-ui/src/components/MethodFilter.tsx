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
  const handleMethodToggle = (method: string) => {
    const newSelectedMethods = selectedMethods.includes(method)
      ? selectedMethods.filter((m) => m !== method)
      : [...selectedMethods, method];
    onFilterChange(newSelectedMethods);
  };

  const handleSelectAll = () => {
    onFilterChange(AVAILABLE_METHODS);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-2 mt-8">
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
            aria-pressed={selectedMethods.includes(method)}
            aria-label={`Filter by ${method} method`}
          >
            {method}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSelectAll}
          className="text-xs px-2 py-1 rounded-md transition-colors"
          style={{
            background: "var(--vscode-button-secondaryBackground)",
            color: "var(--vscode-button-secondaryForeground)",
          }}
          aria-label="Select all methods"
        >
          Select All
        </button>
        <button
          onClick={handleClearAll}
          className="text-xs px-2 py-1 rounded-md transition-colors"
          style={{
            background: "var(--vscode-button-secondaryBackground)",
            color: "var(--vscode-button-secondaryForeground)",
          }}
          aria-label="Clear all methods"
        >
          Clear All
        </button>
        {selectedMethods.length > 0 && (
          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              background: "var(--vscode-badge-background)",
              color: "var(--vscode-badge-foreground)",
            }}
          >
            {selectedMethods.length} selected
          </span>
        )}
      </div>
    </div>
  );
};

export default MethodFilter;
