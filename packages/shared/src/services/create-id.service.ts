export function createId(): string {
    // Generate UUID v4 using native methods
    const uuid = crypto.randomUUID(); // e.g., '3f2504e0-4f89-11d3-9a0c-0305e82c3301'

    // Remove hyphens and take the first 10 characters
    return uuid.replace(/-/g, '').substring(0, 10);
}