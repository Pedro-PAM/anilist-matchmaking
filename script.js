const btnSearch = document.getElementById('btnSearch');
const userEntry = document.getElementById('userEntry');

userEntry.addEventListener('keydown', ()=>{
    btnSearch.removeAttribute('disabled');
})

function searchUser(e){
    e.preventDefault();
    const response  = fetch ("https://graphql.anilist.co",{
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `   {
                User(name: "${userEntry.value}"){
                name
                id
                siteUrl
                
                }
            }`,
            variables: userEntry.value
        })
    })
    response.then(handleResponse)
    .then(handleData)
    .catch(handleError)

    

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });      
    }

    function handleData(data){
        console.log(data);
    }

    function handleError(error){
        alert("User not found!")
        console.log(error)
    }
        
    
}


btnSearch.addEventListener('click', (e)=>searchUser(e));

/*TO-DO:
Criar um html card com as informações enviadas na query sobre o usuário;
Criar a busca pelo segundo usuário;
Descobrir um jeito de calcular a compatibilidade entre os dois usuários e exibi-la na tela;


 */