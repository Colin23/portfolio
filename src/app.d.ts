// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import "svelte/elements";

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    declare module "*.md" {
        import type { Component } from "svelte";
        const component: Component;
        export default component;
    }
}

declare module "svelte/elements" {
    interface HTMLFormAttributes {
        "netlify-honeypot"?: string;
    }
}

export {};
