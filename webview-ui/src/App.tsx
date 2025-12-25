import { useEffect, useState } from "react";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import MethodFilter from "./components/MethodFilter";
import RouteCard from "./components/RouteCard";
import RouteStats from "./components/RouteStats";
import { vscode } from "./vscode";

const LOCAL_STORAGE_KEY_METHOD_FILTERS = "laravelRoutePreview.selectedMethods";

export interface Route {
  name: string | null;
  method: string;
  uri: string;
  action: string;
  middleware: string[];
}

function App() {
  const [data, setData] = useState<Route[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMethodFilterChange = (methods: string[]) => {
    setSelectedMethods(methods);
  };

  const handleMethodClick = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleClearFilters = () => {
    setSelectedMethods([]);
    setSearchTerm("");
  };

  function refreshRoutes() {
    setData(null);
    vscode.postMessage({
      command: "getRoutes",
    });
  }

  useEffect(() => {
    refreshRoutes();

    const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEY_METHOD_FILTERS);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        if (
          Array.isArray(parsedFilters) &&
          parsedFilters.every((item) => typeof item === "string")
        ) {
          setSelectedMethods(parsedFilters);
        }
      } catch (error) {
        console.error(
          "Error parsing saved method filters from localStorage:",
          error
        );
        localStorage.removeItem(LOCAL_STORAGE_KEY_METHOD_FILTERS);
      }
    }

    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message?.type === "getRoutes") {
        setData(message.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_METHOD_FILTERS,
      JSON.stringify(selectedMethods)
    );
  }, [selectedMethods]);

  const filteredForRender = data
    ? data.filter((route) => {
      const term = searchTerm.toLowerCase();
      const searchMatch =
        route.name?.toLowerCase().includes(term) ||
        route.uri.toLowerCase().includes(term) ||
        route.action.toLowerCase().includes(term);
      if (!searchMatch) return false;

      if (selectedMethods.length === 0) {
        return true;
      }
      const routeMethods = route.method.toUpperCase().split("|");
      return routeMethods.some((rm) => selectedMethods.includes(rm));
    })
    : [];

  const hasActiveFilters = searchTerm !== "" || selectedMethods.length > 0;

  return (
    <div className="app-container">
      {data ? (
        <>
          <div className="app-header">
            <div className="header-content">
              <div className="header-title">
                <h1>Laravel Routes</h1>
                <button
                  onClick={refreshRoutes}
                  className="refresh-btn"
                  title="Refresh routes"
                  aria-label="Refresh routes"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              <div className="search-container">
                <div className="search-input-wrapper">
                  <svg
                    className="search-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search routes (name, uri, action)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="clear-search-btn"
                      aria-label="Clear search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-header">
                  <label className="filter-label">Filter by HTTP Method:</label>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="clear-filters-btn"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                <MethodFilter
                  selectedMethods={selectedMethods}
                  onFilterChange={handleMethodFilterChange}
                />
              </div>
            </div>
          </div>

          {filteredForRender.length > 0 ? (
            <>
              <RouteStats
                routes={filteredForRender}
                onMethodClick={handleMethodClick}
                selectedMethods={selectedMethods}
              />

              <div className="routes-grid">
                {filteredForRender.map((route) => (
                  <RouteCard
                    key={`${route.method}-${route.uri}-${route.action}`}
                    route={route}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <svg
                className="empty-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="empty-title">No routes found</h3>
              <p className="empty-description">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "No routes available in this Laravel project"}
              </p>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="empty-action-btn">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default App;
