<script>
	import { fly } from 'svelte/transition';
    import FactoryForm from './factory_form.svelte';
	import { writable } from 'svelte/store';

    const text = "Mettre le texte ici" // text qui apparait en bas quand le form est fermer
    const path_img_up = "/upArrow.png" //mettre path de la fleche pour monté le form
    let couleur = "#98cc53" // couleur de fond (mode fermer et ouvert)
    const croix = "/cross.png" //croix pour fermer mode ouvert

    let new_value = writable('')

    let parentVar;

    function handleMessage(event) {
        parentVar = event.detail.value;
        console.log("reçu : ", parentVar)
    }

    const global_class = "margin-left:10%; margin-right:10%;margin-top:25px"

    //pour remplir ce tableau il faut 
    // un place holder = texte ecris en fond
    // un type (text, email, chackbox ...)
    // value NE PAS CHANGER
    // une class pour modifer l'evenement (fonctionne avec tailwind)
    // une valeur required à mettre a true si vous souhaitez qu'elle soit obligatoir par defaut
    // checked NE PAS CHANGER
    // un id pour lier une checkbox a un input qui devient obligatoire quand c'est cocher et se retire quand on decoche
    //( exemple ici avec une id 1 une id 3 qui sont relier avec les element ayant eu aussi pour id 1 et 3)

    const tab = 
    [
        {placeholder:"mail",type:"checkbox",value:$new_value, class:"mr-2 leading-tight", required:false, checked:false, id:1},
        {placeholder:"mail",type:"checkbox",value:$new_value, class:"mr-2 leading-tight", required:false, checked:false, id:3},
        {placeholder:"Prénom",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:1},
        {placeholder:"Nom",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:0},
        {placeholder:"Adresse",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:3},
        {placeholder:"Code postal",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-[45%] mr-[10%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:0},
        {placeholder:"Ville",type:"text",value:$new_value, class:"shadow appearance-none border rounded py-2 w-[45%] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline", required:false, checked:false, id:0},
        {placeholder:"Adresse mail",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:0},
        {placeholder:"Numéro de téléphone",type:"text",value:$new_value, class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3", required:false, checked:false, id:1},
    ]

    
    let visible = false

    function change_value() {
       visible = !visible
    }

    function find_checkbox(id) {
        for (let i = 0; tab[i]; i++)
            if (tab[i].type == "checkbox" && tab[i].id == id)
                return i
        return -1
    }

    function change_checked(element) {
        let pos_checkbox = -1
        if (element.type == "checkbox")
            element.checked = !element.checked
        for (let i = 0; tab[i]; i++) {
            if (tab[i].type != "checkbox" && tab[i].id > 0) {
                pos_checkbox = find_checkbox(tab[i].id)
                console.log("pos :", pos_checkbox)
                if (pos_checkbox != -1 && tab[pos_checkbox].type == "checkbox" && tab[pos_checkbox].checked == true)
                    tab[i].required = true
                else if (pos_checkbox != -1 && tab[pos_checkbox].checked == false)
                    tab[i].required = false
            }
        }
        console.log("valeur :", element.checked)
    }

    function handleSubmit() {
        for (let i = 0; tab[i]; i++) {
            console.log(tab[i].value)
        }
    }

</script>

<style>
    .antonio_bold {
        font-family: 'Antonio', sans-serif;
    }
</style>

{#if visible == true}
    <div style="background-color:{couleur};" class="md:hidden h-screen w-full fixed z-20 flex flex-col" in:fly={{y:1000, duration:800}} out:fly={{y:800, duration:800}}>
        <img src="{croix}" alt="close" class="h-[26px] w-[29px] mt-[30px] right-[12px] object-left absolute" on:click={change_value}>
        <div class="flex flex-row h-[300px] w-[300px] bg-cyan-600 mt-[80px] ml-[50px]">
            <!--  Ajouter des info avant le formulaire ici   -->
        </div>
        <form  on:submit|preventDefault={handleSubmit}>
            <div style="{global_class}">
                {#each tab as element }
                    <FactoryForm {element} on:message="{handleMessage}"/>
                   
                {/each}
                <input type="submit" value="Envoyer" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"/>
            </div>
        </form>
    </div>
    <div style="background-color:{couleur};" class="hidden md:flex h-screen w-full fixed z-20  flex-col" in:fly={{x:1000, duration:1000}} out:fly={{x:1000, duration:1000}}>
        <img src="{croix}" alt="close" class="h-[26px] w-[29px] mt-[30px] right-[12px] object-left absolute" on:click={change_value}>
        <div class="flex flex-col h-[300px] w-[80%] bg-cyan-600 mt-[50px] mx-auto ml-[10%] mr-[10%]">
            <!--  Ajouter des informations avant le formulaire ici   -->
        </div>
        <form  on:submit|preventDefault={handleSubmit}>
            <div style="{global_class}">
                {#each tab as element }
                    <FactoryForm {element} on:message="{handleMessage,() => change_checked(element)}"/>
                {/each}
                <input type="submit" value="Envoyer" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"/>
            </div>
        </form>
    </div>
{:else}
    <div style="background-color:{couleur};" out:fly={{y:100, duration:800}} in:fly={{y:100, duration:800}} on:click={change_value} class="z-10 h-[92px] bottom-0 left-0 right-0 fixed md:hidden flex flex-col  items-center justify-center">
        <img src="{path_img_up}" alt="up" class="w-[38px] h-[17px]">
        <h1 class="antonio_bold text-[23px] text-[#005D67] text-center leading-[26px]">
            {text}
        </h1>
    </div>
    <div style="background-color:{couleur};" out:fly={{x:100, duration:800}} in:fly={{x:100, duration:800}} on:click={change_value} class="z-10 w-[20%] h-full top-0 right-0 fixed hidden md:flex flex-row align-middleb content-center items-center justify-center">
        <img src="{path_img_up}" alt="up" class="rotate-[270deg] w-[38px] h-[17px] align-middle">
        <h1 class="antonio_bold text-[23px] text-[#005D67] text-center leading-[26px] align-middle">
            {text}
        </h1>
    </div>
{/if}

