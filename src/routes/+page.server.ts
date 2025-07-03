import type { PageServerLoad } from './$types';
import type { AgePrediction } from '$lib/types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const name = url.searchParams.get('name')?.trim();
    
    if (!name) {
        return { ageData: { age: null, name: null, count: null } satisfies AgePrediction };
    }

    try {
        const response = await fetch(`https://api.agify.io?name=${encodeURIComponent(name)}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        return { 
            ageData: { 
                age: data.age ?? null, 
                name: data.name ?? null, 
                count: data.count ?? null 
            } satisfies AgePrediction
        };
    } catch (error) {
        console.error('Error fetching age data:', error);
        return { 
            ageData: { 
                age: null, 
                name: null, 
                count: null,
                error: error instanceof Error ? error.message : 'Unknown error'
            } satisfies AgePrediction
        };
    }
};