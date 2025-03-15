import { onDestroy } from 'svelte';
import _ from 'lodash';
import queryString from 'query-string';

export const runPromise = async (promise) => {
	try {
		const res = await promise;
		return [res, null];
	} catch (error) {
		return [undefined, error];
	}
};

/** Dispatch event on click outside of node */
export const clickOutside = (node) => {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}

export function timeNOW() {
	let today = new Date();
	let currentHours = today.getHours();
	currentHours = ('0' + currentHours).slice(-2);
	let currentMinutes = today.getMinutes();
	currentMinutes = ('0' + currentMinutes).slice(-2);
	let currentSeconds = today.getSeconds();
	currentSeconds = ('0' + currentSeconds).slice(-2);
	return currentHours + ':' + currentMinutes + ':' + currentSeconds;
}

//// print
export function printDiv(divName) {
	let printContents = document.getElementById(divName).innerHTML;

	printContents = '<script src="https://cdn.tailwindcss.com"></script>' + printContents;
	// printContents = '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.2/tailwind.min.css" rel="stylesheet">' + printContents;

	var myWindow = window.open("", "MsgWindow", "width=800,height=1000");
	myWindow.document.write(printContents);
	// myWindow.print();
}

export function generatePaginationUrl(url, page, limit, query) {
	if (query.page) {
		// eslint-disable-next-line no-unused-vars
		let { page, ...otherQuery } = query;
		query = { ...otherQuery };
	}
	if (query.limit) {
		// eslint-disable-next-line no-unused-vars
		let { limit, ...otherQuery } = query;
		query = { ...otherQuery };
	}
	return `${url}?limit=${limit}&page=${parseInt(page)}${
		_.isEmpty(query) || JSON.stringify(query) == '{}' ? '' : `&` + queryString.stringify(query)
	}`;
}

export function serialize(obj) {
	var str = [];
	for (var p in obj)
		if (Object.prototype.hasOwnProperty.call(obj, p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	return str.join('&');
}

export function generateIndexUrl(path, query = {}) {
	let page = query.page || 1;
	let limit = query.limit || 20;

	delete query.page;
	delete query.limit;
	delete query.offset;

	const offset = (page - 1) * limit;
	const queryStringPart = Object.keys(query).length > 0 ? `&${queryString.stringify(query)}` : '';

	return `${path}?limit=${limit}&offset=${offset}${queryStringPart}`;
}
