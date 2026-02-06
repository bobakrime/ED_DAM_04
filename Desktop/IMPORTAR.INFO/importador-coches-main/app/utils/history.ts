import { CarData, CostBreakdown } from "./calculator";

export interface HistoryItem {
    id: string;
    date: string; // ISO string
    title: string;
    imgUrl: string;
    carData: CarData;
    costs: CostBreakdown;
}

const HISTORY_KEY = 'import_calc_history';

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'date'>) {
    const history = getHistory();
    const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
    };

    // Add to beginning
    history.unshift(newItem);

    // Limit to 50 items
    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return newItem;
}

export function getHistory(): HistoryItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    try {
        // Revive dates if needed, but for now strings are fine for display
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
}

export function deleteFromHistory(id: string) {
    const history = getHistory();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
}
