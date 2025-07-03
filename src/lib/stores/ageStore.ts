import { writable } from 'svelte/store';
import type { AgePrediction } from '../types';

const initialState = {
	data: {
		age: null,
		name: null,
		count: null
	} as AgePrediction,
	loading: false,
	error: null as string | null
};

export const ageStore = writable({ ...initialState });

export const ageActions = {
	setLoading: (loading: boolean) => {
		ageStore.update(state => ({
			...state,
			loading,
			error: null
		}));
	},

	setData: (data: AgePrediction) => {
		ageStore.update(state => ({
			...state,
			data,
			loading: false,
			error: null
		}));
	},

	setError: (error: string) => {
		ageStore.update(state => ({
			...state,
			error,
			loading: false
		}));
	},

	reset: () => {
		ageStore.set({ ...initialState });
	}
};
