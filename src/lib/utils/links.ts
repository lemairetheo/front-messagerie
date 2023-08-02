import {browser} from "$app/environment";

const PARAMETERS_TO_PASS: string[] = ['utm_campaign', 'utm_source', 'utm_medium', 'reserved_code_media'];
const PARAMETERS_DEFAULT_VALUES: Record<string, string> = {
    // reserved_code_media: 'someDefaultCodeMedia'
}

export function passUtmParamsToLink(base: URL | string): string {
    const url = new URL(base);

    if (browser) {
        const params = new URLSearchParams(window.location.search);

        params.forEach((value, key) => {
            if (PARAMETERS_TO_PASS.includes(key)) {
                url.searchParams.set(key, value);
            }
        });
        Object.entries(PARAMETERS_DEFAULT_VALUES).forEach(([key, value]) => {
            if (!url.searchParams.has(key)) {
                url.searchParams.set(key, value);
            }
        });
    }
    return url.href;
}
