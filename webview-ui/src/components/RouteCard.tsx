import { useState } from "react";
import type { Route } from "../App";
import CopyButton from "./CopyButton";

interface RouteCardProps {
    route: Route;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
    const [expanded, setExpanded] = useState(false);

    const methodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case "GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS":
                return "method-any";
            case "GET":
            case "GET|HEAD":
                return "method-get";
            case "POST":
                return "method-post";
            case "PUT":
            case "PATCH":
                return "method-put";
            case "DELETE":
                return "method-delete";
            case "OPTIONS":
                return "method-options";
            default:
                return "method-default";
        }
    };

    const displayMethod =
        route.method === "GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS"
            ? "ANY"
            : route.method;

    return (
        <div className="route-card">
            <div className="route-card-header">
                <div className="flex items-start gap-3 flex-1">
                    <span className={`method-badge-large ${methodColor(route.method)}`}>
                        {displayMethod}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="route-name">
                            {route.name || <span className="text-gray-500">Unnamed Route</span>}
                        </div>
                        <div className="route-uri-container">
                            <code className="route-uri">{route.uri}</code>
                            <CopyButton text={route.uri} label="Copy URI" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="route-card-body">
                <div className="route-action-container">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Action:</span>
                    <code className="route-action">{route.action}</code>
                    <CopyButton text={route.action} label="Copy Action" />
                </div>

                {route.middleware && route.middleware.length > 0 && (
                    <div className="middleware-section">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="middleware-toggle"
                            aria-expanded={expanded}
                        >
                            <svg
                                className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""
                                    }`}
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
                            <span>
                                Middleware ({route.middleware.length})
                            </span>
                        </button>

                        {expanded && (
                            <div className="middleware-list">
                                {route.middleware.map((middleware, index) => (
                                    <span key={`${middleware}-${index}`} className="middleware-badge">
                                        {middleware}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteCard;
