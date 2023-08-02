<script lang="ts">
    import type {HTMLAnchorAttributes} from "svelte/elements";
    import {passUtmParamsToLink} from "$lib/utils/links";

    export let attributes: HTMLAnchorAttributes = {};
    export let anchorClass = "";

    const defaultClass = "text-blue-500 hover:underline";
    const defaultAttributes: HTMLAnchorAttributes = {
        target: "_blank",
    };

    // override some attributes
    attributes = {
        ...defaultAttributes,
        ...attributes,
        href: passUtmParamsToLink(attributes.href || "https://www.example.com"),
    };
</script>

<a {...attributes} class="{defaultClass} {anchorClass}">
    <slot/>
</a>
