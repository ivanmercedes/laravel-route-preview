import React from "react";

interface GroupHeaderProps {
    name: string;
    count: number;
    isExpanded: boolean;
    onToggle: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
    name,
    count,
    isExpanded,
    onToggle,
}) => {
    return (
        <div className="group-header">
            <button
                onClick={onToggle}
                className="group-header-button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${name} group`}
            >
                <svg
                    className={`group-header-icon ${isExpanded ? "expanded" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>

                <div className="group-header-content">
                    <h3 className="group-header-title">
                        {name === "root" ? "/" : name}
                    </h3>
                    <span className="group-header-badge">{count} routes</span>
                </div>
            </button>
        </div>
    );
};

export default GroupHeader;
