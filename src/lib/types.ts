export interface AgePrediction {
    age: number | null;
    name: string | null;
    count: number | null;
    error?: string;
}

export interface AgeStore {
    data: AgePrediction;
    loading: boolean;
    error: string | null;
}