import { useEffect, useState } from "react";
import "./App.css";
import LoadingSpiner from "./components/loading-spinner";
import { vscode } from "./vscode";

export interface Route {
  name: string | null;
  method: string;
  uri: string;
  action: string;
  middleware: string[];
}

function App() {
  const [data, setData] = useState<Route[] | null>(null);

  function refreshRoutes() {
    vscode.postMessage({
      command: "getRoutes",
    });
  }

  useEffect(() => {
    refreshRoutes();

    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message?.type === "getRoutes") {
        setData(JSON.parse(message.data));
        console.log("data", JSON.parse(message.data));
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

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

  return (
    <div className="py-5 flex justify-center  w-full min-h-screen">
      {data ? (
        <div className="w-full">
          <div className="mb-3">
            <h2 className="text-2xl">Laravel Route List</h2>
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
                {data?.map((item: Route) => (
                  <tr
                    key={item.action}
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
