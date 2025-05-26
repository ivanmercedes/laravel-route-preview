import { useEffect, useState } from "react";
import "./App.css";
import LoadingSpiner from "./components/loading-spinner";
import MethodFilter from "./components/MethodFilter";
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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]); // State for selected methods

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMethodFilterChange = (methods: string[]) => {
    setSelectedMethods(methods);
  };

  function refreshRoutes() {
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

  function methodColor(method: string) {
    switch (method.toUpperCase()) {
      case "GET|HEAD":
      case "GET":
        return " text-green-500";
      case "POST":
        return " text-blue-500";
      case "PUT":
      case "PATCH":
        return "text-yellow-500";
      case "GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS":
      case "DELETE":
        return "text-red-500";
      case "OPTIONS":
        return "text-gray-500";
      default:
        return "";
    }
  }

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

  console.log("[App.tsx data length:", filteredForRender.length);

  return (
    <div className="py-5 flex justify-center  w-full min-h-screen">
      {data ? (
        <div className="w-full">
          <div className="mb-4 p-4 border rounded dark:border-gray-700">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search routes (name, uri, action)..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by HTTP Method:
              </label>
              <MethodFilter
                selectedMethods={selectedMethods}
                onFilterChange={handleMethodFilterChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full w-full  divide-y-2 divide-gray-200 dark:divide-gray-600">
              <thead className="ltr:text-left rtl:text-right">
                <tr className="font-medium text-gray-900 dark:text-gray-200">
                  <th className="px-3 py-2 whitespace-nowrap">Method</th>
                  <th className="px-3 py-2 whitespace-nowrap">Name</th>
                  <th className="px-3 py-2 whitespace-nowrap">URI</th>
                  <th className="px-3 py-2 whitespace-nowrap">Action</th>
                  <th className="px-3 py-2 whitespace-nowrap">Middleware</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredForRender.map((item: Route) => (
                  <tr
                    key={`${item.method}-${item.uri}-${item.action}`}
                    className="text-gray-900 dark:text-gray-200 first:font-medium"
                  >
                    <td
                      className={`px-3 py-2 max-w-[150px] break-words whitespace-normal ${methodColor(
                        item.method
                      )}`}
                    >
                      {item.method === "GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS"
                        ? "ANY"
                        : item.method}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.name ?? "N.A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{item.uri}</td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.action}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex flex-wrap">
                      {item.middleware.map((item: string) => (
                        <span className="mx-1 border p-1 border-gray-200 dark:border-gray-600">
                          {item}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <LoadingSpiner />
      )}
    </div>
  );
}

export default App;
