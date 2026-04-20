// https://svelte.dev/docs/svelte/@attach
// https://github.com/danawoodman/danawoodman.com/blob/main/src/routes/projects/svelte-tippy-tooltip/index.svelte

import type { Attachment } from 'svelte/attachments';
import tippy, { type Content, type Props as P } from 'tippy.js';

export interface TT { content: Content, props: Partial<P> };

export function tooltip(content: Content, params: Partial<P>): Attachment {
	return (element: Element) => {

		params.touch ??= ['hold', 350]; // A hack
		params.delay ??= [350, 250];
		params.zIndex ??= 998;

		const tooltip = tippy(element, { content, ...params });
		return tooltip.destroy;
	};
}