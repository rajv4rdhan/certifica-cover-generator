var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-GCWIYU/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-GCWIYU/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/worker.ts
var LOGO_PATTERNS = [
  "/logo.png",
  "/logo.jpg",
  "/logo.jpeg",
  "/logo.svg",
  "/logo.webp",
  "/assets/logo.png",
  "/assets/logo.jpg",
  "/assets/logo.svg",
  "/images/logo.png",
  "/images/logo.jpg",
  "/images/logo.svg",
  "/img/logo.png",
  "/img/logo.jpg",
  "/img/logo.svg",
  "/static/logo.png",
  "/static/logo.jpg",
  "/static/logo.svg"
];
async function extractLogos(targetUrl) {
  const candidates = [];
  try {
    const baseUrl = new URL(targetUrl);
    const origin = baseUrl.origin;
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LogoExtractorBot/1.0)"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${targetUrl}: ${response.status}`);
    }
    const html = await response.text();
    for (const pattern of LOGO_PATTERNS) {
      const logoUrl = `${origin}${pattern}`;
      candidates.push({
        url: logoUrl,
        source: "common-pattern",
        score: 50
      });
    }
    const imgRegex = /<img[^>]+>/gi;
    const imgTags = html.match(imgRegex) || [];
    for (const imgTag of imgTags) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        const src = srcMatch[1];
        const isLogo = /logo|brand|site-logo|header-logo/i.test(imgTag);
        if (isLogo) {
          const absoluteUrl = new URL(src, origin).href;
          candidates.push({
            url: absoluteUrl,
            source: "img-tag",
            score: 80
          });
        }
      }
    }
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogImageMatch) {
      const absoluteUrl = new URL(ogImageMatch[1], origin).href;
      candidates.push({
        url: absoluteUrl,
        source: "og-image",
        score: 60
      });
    }
    const faviconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);
    if (faviconMatch) {
      const absoluteUrl = new URL(faviconMatch[1], origin).href;
      candidates.push({
        url: absoluteUrl,
        source: "favicon",
        score: 40
      });
    }
    const appleTouchMatch = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i);
    if (appleTouchMatch) {
      const absoluteUrl = new URL(appleTouchMatch[1], origin).href;
      candidates.push({
        url: absoluteUrl,
        source: "apple-touch-icon",
        score: 45
      });
    }
    const schemaLogoMatch = html.match(/"logo"\s*:\s*"([^"]+)"/i);
    if (schemaLogoMatch) {
      const absoluteUrl = new URL(schemaLogoMatch[1], origin).href;
      candidates.push({
        url: absoluteUrl,
        source: "schema-org",
        score: 70
      });
    }
  } catch (error) {
    console.error("Error extracting logos:", error);
  }
  const uniqueLogos = Array.from(
    new Map(candidates.map((c) => [c.url, c])).values()
  ).sort((a, b) => b.score - a.score);
  return uniqueLogos;
}
__name(extractLogos, "extractLogos");
async function verifyImageExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type") || "";
    return response.ok && contentType.startsWith("image/");
  } catch {
    return false;
  }
}
__name(verifyImageExists, "verifyImageExists");
async function handleLogoExtraction(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");
  const returnJson = url.searchParams.get("return") === "json";
  const direct = url.searchParams.get("direct") === "true";
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        error: "Missing URL parameter",
        usage: {
          endpoint: `${url.origin}/api`,
          examples: [
            `${url.origin}/api?url=https://example.com`,
            `${url.origin}/api?url=https://example.com&return=json`,
            `${url.origin}/api?url=https://example.com&direct=true`
          ]
        }
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
  try {
    new URL(targetUrl);
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid URL provided" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
  try {
    const logos = await extractLogos(targetUrl);
    if (logos.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No logos found",
          url: targetUrl
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    if (returnJson) {
      return new Response(
        JSON.stringify({
          url: targetUrl,
          logos,
          count: logos.length
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    let validLogo = null;
    for (const logo of logos) {
      const exists = await verifyImageExists(logo.url);
      if (exists) {
        validLogo = logo;
        break;
      }
    }
    if (!validLogo) {
      return new Response(
        JSON.stringify({
          error: "No valid logos found",
          url: targetUrl,
          candidates: logos.map((l) => l.url)
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    if (direct) {
      const imageResponse = await fetch(validLogo.url);
      const imageBlob = await imageResponse.blob();
      return new Response(imageBlob, {
        headers: {
          "Content-Type": imageResponse.headers.get("content-type") || "image/png",
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders
        }
      });
    }
    return new Response(
      JSON.stringify({
        url: targetUrl,
        logo: validLogo
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to extract logo",
        message: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}
__name(handleLogoExtraction, "handleLogoExtraction");

// src/api/index.ts
var api_default = {
  async fetch(request) {
    return handleLogoExtraction(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-GCWIYU/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = api_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-GCWIYU/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
