/**
 * Parses a Laravel controller action string
 * Examples:
 * - "App\\Http\\Controllers\\UserController@index" -> { controller: "UserController", method: "index" }
 * - "Closure" -> null
 */
export function parseControllerAction(action: string): {
    controller: string;
    method: string;
    namespace: string;
} | null {
    if (action === "Closure" || !action.includes("\\")) {
        return null;
    }

    const [fullPath, method] = action.split("@");
    const parts = fullPath.split("\\");
    const controller = parts[parts.length - 1];
    const namespace = parts.slice(0, -1).join("\\");

    return {
        controller,
        method: method || "",
        namespace,
    };
}

/**
 * Determines if an action is clickable (i.e., it's a controller, not a closure)
 */
export function isClickable(action: string): boolean {
    return action !== "Closure" && action.includes("\\");
}

/**
 * Converts a Laravel controller namespace to a file path
 * Example: App\\Http\\Controllers\\UserController -> app/Http/Controllers/UserController.php
 */
export function formatControllerPath(controller: string): string {
    // Remove the @ method part if it exists
    const cleanController = controller.split("@")[0];

    // Convert namespace separators to path separators
    let path = cleanController.replace(/\\\\/g, "/");

    // Add .php extension if not present
    if (!path.endsWith(".php")) {
        path += ".php";
    }

    return path;
}

/**
 * Attempts to resolve the controller file path relative to the Laravel project
 * This is a best-effort approach that handles common Laravel structures
 */
export function resolveControllerFilePath(action: string): string | null {
    const parsed = parseControllerAction(action);
    if (!parsed) return null;

    const { namespace, controller } = parsed;

    // Common Laravel namespace mappings
    const namespaceMappings: Record<string, string> = {
        "App\\Http\\Controllers": "app/Http/Controllers",
        "App\\Console\\Commands": "app/Console/Commands",
        "App\\Jobs": "app/Jobs",
        "App\\Listeners": "app/Listeners",
        "App\\Mail": "app/Mail",
        "App\\Notifications": "app/Notifications",
    };

    // Try to find a matching namespace mapping
    for (const [ns, path] of Object.entries(namespaceMappings)) {
        if (namespace.startsWith(ns)) {
            const relativePath = namespace.replace(ns, path).replace(/\\\\/g, "/");
            return `${relativePath}/${controller}.php`;
        }
    }

    // Fallback: convert the entire namespace
    const fallbackPath = namespace.replace(/\\\\/g, "/").toLowerCase();
    return `${fallbackPath}/${controller}.php`;
}
