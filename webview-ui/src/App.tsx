import { useEffect, useState } from "react";
import "./App.css";
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
  return (
    <div>
      {data ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Method</th>
                <th>URI</th>
                <th>Action</th>
                <th>Middleware</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: Route) => (
                <tr key={item.action}>
                  <td>{item.method}</td>
                  <td>{item.uri}</td>
                  <td>{item.name}</td>
                  <td>{item.action}</td>
                  <td>{item.middleware}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}

export default App;
