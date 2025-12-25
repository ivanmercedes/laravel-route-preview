import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ExportModal from "./components/ExportModal";
import GroupHeader from "./components/GroupHeader";
import LoadingSpinner from "./components/LoadingSpinner";
import MethodFilter from "./components/MethodFilter";
import RouteCard from "./components/RouteCard";
import RouteStats from "./components/RouteStats";
import { groupRoutes, type GroupingMode } from "./utils/RouteGrouper";
import { vscode } from "./vscode";

const LOCAL_STORAGE_KEY_METHOD_FILTERS = "laravelRoutePreview.selectedMethods";
const LOCAL_STORAGE_KEY_GROUPING = "laravelRoutePreview.groupingMode";

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
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("none");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [exportModalOpen, setExportModalOpen] = useState(false);

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

  const handleGroupingChange = (mode: GroupingMode) => {
    setGroupingMode(mode);
    localStorage.setItem(LOCAL_STORAGE_KEY_GROUPING, mode);
    // Expand all groups by default when grouping changes
    if (mode !== "none" && filteredForRender) {
      const groups = groupRoutes(filteredForRender, mode);
      setExpandedGroups(new Set(groups.map((g) => g.name)));
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  function refreshRoutes() {
    setData(null);
    vscode.postMessage({
      command: "getRoutes",
    });
  }

  useEffect(() => {
    // Only load routes on first mount if no data exists
    if (data === null) {
      refreshRoutes();
    }

    // Load saved filters
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

    // Load saved grouping mode
    const savedGrouping = localStorage.getItem(LOCAL_STORAGE_KEY_GROUPING);
    if (
      savedGrouping &&
      ["none", "prefix", "controller"].includes(savedGrouping)
    ) {
      setGroupingMode(savedGrouping as GroupingMode);
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
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_METHOD_FILTERS,
      JSON.stringify(selectedMethods)
    );
  }, [selectedMethods]);

  // Memoize filtered routes for performance
  const filteredForRender = useMemo(() => {
    if (!data) return [];

    return data.filter((route) => {
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
    });
  }, [data, searchTerm, selectedMethods]);

  // Memoize grouped routes
  const groupedRoutes = useMemo(() => {
    return groupRoutes(filteredForRender, groupingMode);
  }, [filteredForRender, groupingMode]);

  // Initialize expanded groups when routes change
  useEffect(() => {
    if (groupingMode !== "none" && groupedRoutes.length > 0) {
      setExpandedGroups(new Set(groupedRoutes.map((g) => g.name)));
    }
  }, [groupedRoutes, groupingMode]);

  const hasActiveFilters = searchTerm !== "" || selectedMethods.length > 0;

  return (
    <div className="app-container">
      {data ? (
        <>
          <div className="app-header">
            <div className="header-content">
              {/* First Row: Title, Grouping, and Actions */}
              <div className="header-row-1">
                <div className="header-left">
                  <h1 className="header-title-compact">Laravel Routes</h1>
                  <div className="header-divider"></div>
                  <div className="header-grouping-compact">
                    <span className="grouping-label-compact">Group:</span>
                    <div className="grouping-buttons">
                      <button
                        onClick={() => handleGroupingChange("none")}
                        className={`grouping-btn ${
                          groupingMode === "none" ? "active" : ""
                        }`}
                        title="No grouping"
                      >
                        None
                      </button>
                      <button
                        onClick={() => handleGroupingChange("prefix")}
                        className={`grouping-btn ${
                          groupingMode === "prefix" ? "active" : ""
                        }`}
                        title="Group by prefix"
                      >
                        Prefix
                      </button>
                      <button
                        onClick={() => handleGroupingChange("controller")}
                        className={`grouping-btn ${
                          groupingMode === "controller" ? "active" : ""
                        }`}
                        title="Group by controller"
                      >
                        Controller
                      </button>
                    </div>
                  </div>
                </div>

                <div className="header-actions">
                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="header-action-btn"
                    title="Export routes"
                    aria-label="Export routes"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span className="action-label">Export</span>
                  </button>
                  <button
                    onClick={refreshRoutes}
                    className="header-action-btn"
                    title="Refresh routes"
                    aria-label="Refresh routes"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="action-label">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Second Row: Search and Filters */}
              <div className="header-row-2">
                <div className="search-container-compact">
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
                      placeholder="Search routes..."
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

                <div className="filter-section-compact">
                  <MethodFilter
                    selectedMethods={selectedMethods}
                    onFilterChange={handleMethodFilterChange}
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="clear-filters-btn-compact"
                      title="Clear all filters"
                    >
                      <svg
                        className="w-3 h-3"
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
                      Clear
                    </button>
                  )}
                </div>
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

              <div className="routes-container">
                {groupedRoutes.map((group) => (
                  <div key={group.name} className="route-group">
                    {groupingMode !== "none" && (
                      <GroupHeader
                        name={group.name}
                        count={group.count}
                        isExpanded={expandedGroups.has(group.name)}
                        onToggle={() => toggleGroup(group.name)}
                      />
                    )}
                    {(groupingMode === "none" ||
                      expandedGroups.has(group.name)) && (
                      <div className="routes-grid">
                        {group.routes.map((route) => (
                          <RouteCard
                            key={`${route.method}-${route.uri}-${route.action}`}
                            route={route}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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
                <button
                  onClick={handleClearFilters}
                  className="empty-action-btn"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <ExportModal
            routes={filteredForRender}
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default App;
