/// <reference types="@cloudflare/workers-types" />

import { handleLogoExtraction } from '../worker';

export default {
	async fetch(request: Request): Promise<Response> {
		return handleLogoExtraction(request);
	}
};
