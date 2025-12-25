import type { Route } from "../App";

interface RouteStatsProps {
    routes: Route[];
    onMethodClick: (method: string) => void;
    selectedMethods: string[];
}

const RouteStats: React.FC<RouteStatsProps> = ({
    routes,
    onMethodClick,
    selectedMethods,
}) => {
    const methodCounts = routes.reduce((acc, route) => {
        const methods = route.method.toUpperCase().split("|");
        methods.forEach((method) => {
            acc[method] = (acc[method] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const methodColors: Record<string, string> = {
        GET: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
        HEAD: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
        POST: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        PUT: "bg-amber-500/20 text-amber-500 border-amber-500/30",
        PATCH: "bg-amber-500/20 text-amber-500 border-amber-500/30",
        DELETE: "bg-red-500/20 text-red-500 border-red-500/30",
        OPTIONS: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };

    return (
        <div className="stats-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{routes.length}</div>
                    <div className="stat-label">Total Routes</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label mb-2">Methods Distribution</div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(methodCounts)
                            .sort(([, a], [, b]) => b - a)
                            .map(([method, count]) => (
                                <button
                                    key={method}
                                    onClick={() => onMethodClick(method)}
                                    className={`method-badge ${methodColors[method] || "bg-gray-500/20 text-gray-500"
                                        } ${selectedMethods.includes(method) ? "ring-2 ring-white/50" : ""
                                        }`}
                                    title={`Filter by ${method}`}
                                >
                                    <span className="font-semibold">{method}</span>
                                    <span className="method-count">{count}</span>
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteStats;
