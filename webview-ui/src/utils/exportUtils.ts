import type { Route } from "../App";

/**
 * Converts routes to JSON format
 */
export function exportToJSON(routes: Route[]): string {
    return JSON.stringify(routes, null, 2);
}

/**
 * Converts routes to CSV format
 */
export function exportToCSV(routes: Route[]): string {
    // CSV Headers
    const headers = ["Method", "Name", "URI", "Action", "Middleware"];

    // Convert routes to CSV rows
    const rows = routes.map((route) => [
        route.method,
        route.name || "",
        route.uri,
        route.action,
        route.middleware.join("; "),
    ]);

    // Combine headers and rows
    const allRows = [headers, ...rows];

    // Convert to CSV string
    return allRows
        .map((row) =>
            row
                .map((cell) => {
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    const escaped = cell.replace(/"/g, '""');
                    return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
                })
                .join(",")
        )
        .join("\n");
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(
    content: string,
    filename: string,
    mimeType: string
): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Exports routes to the specified format
 */
export function exportRoutes(
    routes: Route[],
    format: "json" | "csv"
): void {
    const timestamp = new Date().toISOString().split("T")[0];

    if (format === "json") {
        const content = exportToJSON(routes);
        downloadFile(content, `laravel-routes-${timestamp}.json`, "application/json");
    } else if (format === "csv") {
        const content = exportToCSV(routes);
        downloadFile(content, `laravel-routes-${timestamp}.csv`, "text/csv");
    }
}
