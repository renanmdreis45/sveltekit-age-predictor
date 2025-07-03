<script lang="ts">
	import { onMount } from 'svelte';
	import { ageStore, ageActions } from '$lib/stores/ageStore';
	import { browser } from '$app/environment';

	let inputName = '';
	let timeoutId: number;

	onMount(() => {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			inputName = params.get('name') || '';
			if (inputName.trim()) {
				fetchPrediction(inputName);
			}
		}
	});

	const fetchPrediction = async (name: string) => {
		if (!name.trim()) {
			ageActions.reset();
			updateURL('');
			return;
		}

		try {
			ageActions.setLoading(true);
			updateURL(name);

			const res = await fetch(`https://api.agify.io?name=${encodeURIComponent(name)}`);
			if (!res.ok) throw new Error(`API error: ${res.status}`);
			const data = await res.json();

			ageActions.setData({
				age: data.age ?? null,
				name: data.name ?? null,
				count: data.count ?? null
			});
		} catch (error) {
			ageActions.setError(error instanceof Error ? error.message : 'Unknown error');
		}
	};

	const updateURL = (name: string) => {
		if (!browser) return;
		const url = new URL(window.location.href);
		if (name.trim()) {
			url.searchParams.set('name', name.trim());
		} else {
			url.searchParams.delete('name');
		}
		history.replaceState(null, '', url.toString());
	};

	const handleInput = () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fetchPrediction(inputName), 500);
	};

	onMount(() => () => clearTimeout(timeoutId));
</script>


<link rel="stylesheet" href="/styles/age-predictor.css" />


<svelte:head>
    <title>Age Predictor</title>
    <meta name="description" content="Predict age based on name using agify.io API" />
</svelte:head>

<div class="container">
    <h1>Age Predictor</h1>
    <p class="subtitle">Descubra a idade prevista para qualquer nome</p>
    
    <div class="input-container">
        <input
            type="text"
            bind:value={inputName}
            placeholder="Digite um nome"
            aria-label="Enter a name to predict age"
            on:input={handleInput}
        />
        {#if $ageStore.loading}
            <div class="spinner"></div>
        {/if}
    </div>
    
    {#if $ageStore.loading && !$ageStore.data.name}
        <div class="loading">Loading...</div>
    {:else if $ageStore.data.name}
        <div class="result">
            <p>Name: <strong>{$ageStore.data.name}</strong></p>
            <p>Predicted age: <strong>{$ageStore.data.age ?? 'Desconhecida'}</strong></p>
            <p class="count">(based on {$ageStore.data.count} records)</p>
        </div>
    {:else if $ageStore.error}
        <div class="error">
            <p>Error: {$ageStore.error}</p>
        </div>
    {:else if inputName.trim() && !$ageStore.data.name && !$ageStore.loading}
        <div class="no-result">
            <p>Nenhuma previsão de idade encontrada para "<strong>{inputName}</strong>"</p>
        </div>
    {/if}
</div>