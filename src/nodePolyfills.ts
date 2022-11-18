globalThis.__dirname = "";
// node polyfills plugin was enough for dev server, but not build
globalThis.process = {
    env: {},
    versions: {}
} as any
export {};