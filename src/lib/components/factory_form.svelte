<script>
    import { createEventDispatcher } from 'svelte';

    export let element
  
    const dispatch = createEventDispatcher();
    let valid = false

    let checked = false
    
    
    function handleInput(event) {
        element.value = event.target.value;
        console.log("verif : <", element.value,">")
        dispatch('message', { value: element.value})
    }

    switch (element.type) {
        case "email":
        case "checkbox":
        case "text":
            valid = true
            break
        default:
            console.log("erreur")
            valid = false
            break
    }
</script>

{#if valid && element.required == false}
    <input class="{element.class}" type="{element.type}" placeholder="{element.placeholder}" value="{element.value}"  on:input={handleInput}/>
{:else if valid && element.required == true}
    <input class="{element.class}" type="{element.type}" placeholder="{element.placeholder}*" value="{element.value}" required on:input={handleInput}/>
{/if}
