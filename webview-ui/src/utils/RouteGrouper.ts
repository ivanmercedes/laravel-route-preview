import type { Route } from "../App";

export type GroupingMode = "none" | "prefix" | "controller";

export interface RouteGroup {
    name: string;
    routes: Route[];
    count: number;
}

/**
 * Extracts the first segment of a URI as the prefix
 * Examples:
 * - /api/users -> api
 * - /admin/dashboard -> admin
 * - /users -> users
 * - / -> root
 */
export function extractPrefix(uri: string): string {
    if (uri === "/") return "root";

    const segments = uri.split("/").filter(Boolean);
    if (segments.length === 0) return "root";

    // Remove parameter segments like {id}, {user}, etc.
    const firstSegment = segments[0].replace(/\{.*?\}/g, "");
    return firstSegment || "root";
}

/**
 * Extracts the controller name from an action string
 * Examples:
 * - App\Http\Controllers\UserController@index -> UserController
 * - App\Http\Controllers\Api\PostController@show -> PostController
 * - Closure -> Closure
 */
export function extractController(action: string): string {
    if (action === "Closure" || !action.includes("\\")) {
        return "Closure";
    }

    // Extract the class name from the namespace
    const parts = action.split("\\");
    const lastPart = parts[parts.length - 1];

    // Remove the method part if it exists (e.g., @index)
    const controllerName = lastPart.split("@")[0];

    return controllerName || "Unknown";
}

/**
 * Groups routes by their URI prefix
 */
export function groupByPrefix(routes: Route[]): RouteGroup[] {
    const groups = new Map<string, Route[]>();

    routes.forEach((route) => {
        const prefix = extractPrefix(route.uri);
        const existing = groups.get(prefix) || [];
        groups.set(prefix, [...existing, route]);
    });

    // Convert to array and sort by group name
    return Array.from(groups.entries())
        .map(([name, routes]) => ({
            name,
            routes,
            count: routes.length,
        }))
        .sort((a, b) => {
            // Put 'root' first, then alphabetically
            if (a.name === "root") return -1;
            if (b.name === "root") return 1;
            return a.name.localeCompare(b.name);
        });
}

/**
 * Groups routes by their controller
 */
export function groupByController(routes: Route[]): RouteGroup[] {
    const groups = new Map<string, Route[]>();

    routes.forEach((route) => {
        const controller = extractController(route.action);
        const existing = groups.get(controller) || [];
        groups.set(controller, [...existing, route]);
    });

    // Convert to array and sort by group name
    return Array.from(groups.entries())
        .map(([name, routes]) => ({
            name,
            routes,
            count: routes.length,
        }))
        .sort((a, b) => {
            // Put 'Closure' last, then alphabetically
            if (a.name === "Closure") return 1;
            if (b.name === "Closure") return -1;
            return a.name.localeCompare(b.name);
        });
}

/**
 * Groups routes based on the selected mode
 */
export function groupRoutes(
    routes: Route[],
    mode: GroupingMode
): RouteGroup[] {
    switch (mode) {
        case "prefix":
            return groupByPrefix(routes);
        case "controller":
            return groupByController(routes);
        case "none":
        default:
            return [
                {
                    name: "all",
                    routes,
                    count: routes.length,
                },
            ];
    }
}
