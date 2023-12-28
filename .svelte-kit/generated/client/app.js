export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8')
];

export const server_loads = [];

export const dictionary = {
		"/(main)": [6,[3]],
		"/(main)/contact": [7,[3]],
		"/(iframe)/demo/[row_id]": [4,[2]],
		"/(iframe)/demo/[row_id]/[mode]": [5,[2]],
		"/(main)/depth": [8,[3]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';