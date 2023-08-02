<script>
    import { onMount } from 'svelte';


    let messages = [];
    let messageContent = '';
    let username = '';
    let password = '';
    let logined;
    let convId;
    let new_name;
    let edit = false;
    let conversations = [];

    $: logined && fetchConversations(logined)
    $: convId && getmess(convId)

    async function login(username, password) {
        // Construire l'URL
        const url = 'http://localhost:3000/login';

        // Faire la requête
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Vérifier le statut de la réponse
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Récupérer l'ID de l'utilisateur
        const data = await response.json();
        console.log("logined before : ", logined);
        sessionStorage.setItem("userid", data.userId);
        logined = sessionStorage.getItem("userid");
        console.log("logined after : ", logined);
    }

    async function fetchMessages(id_conv) {
        const response = await fetch(`http://localhost:3000/conversations/${id_conv}/messages`);
        messages = await response.json();
    }

    async function fetchUserName(userId) {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        const user = await response.json();
        return user.username;
    }

    onMount(async () => {
        // Récupérer l'ID de l'utilisateur de la session
        logined = sessionStorage.getItem("userid");

        // Si l'utilisateur est connecté, récupérer les messages
        await getmess();
    });

    async function getmess(id_conv) {
        await fetchMessages(id_conv);
        const userNamesPromises = messages.map(message => fetchUserName(message.userId));
        const userNames = await Promise.all(userNamesPromises);
        messages = messages.map((message, index) => ({ ...message, username: userNames[index] }));
    }

    async function fetchConversations(userId) {
        const url = `http://localhost:3000/user_conversations/${userId}`;

        // Faire la requête
        const response = await fetch(url);

        // Vérifier le statut de la réponse
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Récupérer les conversations
        const newConversations = await response.json();

        // Trier les conversations par la date du dernier message
        newConversations.sort((a, b) => {
            const aLastMessageTime = a.lastMessage && a.lastMessage.timestamp ? a.lastMessage.timestamp._seconds : 0;
            const bLastMessageTime = b.lastMessage && b.lastMessage.timestamp ? b.lastMessage.timestamp._seconds : 0;
            return bLastMessageTime - aLastMessageTime;
        });

        // Mettre à jour le tableau "conversations"
        conversations = newConversations;
    }



    async function sendMessage(conversationId) {
        console.log(logined)
        const response = await fetch(`http://localhost:3000/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: logined, // Remplacez ceci par l'ID de l'utilisateur réel
                content: messageContent,
            }),
        });

        if (response.ok) {
            messageContent = ""; // réinitialiser le contenu du message après envoi
            console.log("Message sent successfully");
            await getmess()
        } else {
            console.error("Error sending message: ", response.status);
        }
    }

    async function change_con_name(conversationId, newName) {
        const url = `http://localhost:3000/change_name`;

        // Préparer le corps de la requête
        console.log("name : ", newName, "conv : ", conversationId)
        const body = {
            new_name: newName,
            id_conv: conversationId
        };

        // Configurer les options de la requête
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };

        // Faire la requête
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Traiter la réponse
        const data = await response.json();
        console.log(data);
    }


    function formatDate(timestamp) {
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

        const actual_date = new Date()
        const actual_day = actual_date.getDate();
        const actual_month = months[actual_date.getMonth()];


        const date = new Date(timestamp._seconds * 1000);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0'); // Ajoute un zéro au début si la minute est un seul chiffre
        if (actual_day === day && actual_month === month) {
            return `aujourd'hui à ${hour}h${minute}`;
        } else {
            return `Le ${day} ${month} à ${hour}h${minute}`;
        }


    }




</script>


{#if !logined }
    <input type="text" bind:value={username} placeholder="Nom d'utilisateur" />
    <input type="password" bind:value={password}  placeholder="Mot de passe" />
    <button on:click={()=> login(username, password)}>Log In</button>
{:else if convId}
    <div class="sticky bg-[#808080] w-screen h-24 flex flex-row justify-start items-center pl-8">
        {#if edit === true}
            <input bind:value={new_name} type="text" placeholder="nouveau nom :">
            <button on:click={async () => {await change_con_name(convId, new_name); await fetchConversations(logined); edit = false}} class="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Valider </button>
        {:else}
            <div class="text-3xl text-white font-bold">
                {conversations.find(conv => conv.id === convId)?.name || 'Conversation non trouvée'}
            </div>
            <img src="/edit.svg" alt="edit" class="ml-5 w-10 h-auto" on:click={() => {edit = true; new_name = conversations.find(conv => conv.id === convId)?.name}}>
        {/if}


        <img src="/cross.svg" alt="close" class="absolute right-5 top-5 w-10 h-auto" on:click={() => {convId = undefined; edit = false; fetchConversations(logined)}}/>


    </div>
    <main>
        {#each messages as message (message.id)}
            {#if message.userId === logined}
                <div class="bg-blue-500 text-right p-10 mt-10">
                    <p>{formatDate(message.timestamp)}</p>
                    <p>de {message.username}</p>
                    <p>{message.content}</p>
                </div>
            {:else}
                <div class="bg-green-700 text-left p-10 mt-10">
                    <p>{formatDate(message.timestamp)}</p>
                    <p>de {message.username}</p>
                    <p>{message.content}</p>
                </div>
            {/if}
        {/each}
    </main>

    <div class="absolute bottom-0 border-t-4  bg-[#979797] border-[#979797] w-screen h-24 flex flex-row justify-start items-center">
        <input class="ml-5 w-[80%] bg-[#DFDEDE] h-[90%] rounded-2xl pl-5 mr-3 outline-[#979797]" bind:value={messageContent} placeholder=" Envoyer un message" />

        <button class="w-[20%] transition-all bg-[#DFDEDE] h-[90%] rounded-2xl hover:bg-[#938F8E] hover:scale-105" on:click={async () => {await sendMessage(convId); await getmess(convId)}}>Send</button>
    </div>

{:else}

    <h1> vos conversations :</h1>

    <div class="w-screen flex flex-col justify-center items-center">
        {#each conversations as conv (conv.id)}

            <div on:click={() => convId = conv.id} class="transition-all bg-[#BABABA] border-4 border-[#979797] hover:scale-125 mt-8 w-[50%] flex flex-row justify-center items-center pt-5 pb-5">
                <h2  class="w-[80%]">{conv.name}, {formatDate(conv.lastMessageTimestamp)}</h2>

            </div>

        {/each}
    </div>


{/if}