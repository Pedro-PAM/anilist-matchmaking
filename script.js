const btnSearch = document.getElementById('btnSearch');
const userEntry = document.getElementById('userEntry');
const userHelpBlock = document.getElementById('userHelpBlock');
const usersCards = document.getElementById('usersCards');

class UserInfo {
    constructor(name, avatar, scoreFormat, mediaScores, favourites) {
        this.name = name || "";
        this.avatar = avatar || "";
        this.scoreFormat = scoreFormat || "";
        this.mediaScores = mediaScores || "";
        this.favourites = this.initializeFavourites(favourites);
    }

    initializeFavourites(favourites) {        
        if (!Array.isArray(favourites)) {
            return Array(5).fill(""); 
        }        
        if (favourites.length < 5) {
            return favourites.concat(Array(5 - favourites.length).fill(""));
        }
        return favourites.slice(0, 5);
    }
}
const user1 = new UserInfo();
const user2 = new UserInfo();

let userCount = 0;

userEntry.addEventListener('keydown', ()=>{
    if(userCount != 2){
        btnSearch.removeAttribute('disabled');
    }    
})

function calculateMatch(){


}

function searchUser(e){
    e.preventDefault();
    userCount++;
    if(userCount == 1){        
        userHelpBlock.innerHTML = "Now enter the second anilist's username, also case sensitive."
    }
    if(userCount == 2){
        btnSearch.toggleAttribute('disabled');
        calculateMatch();
        const refreshButton = document.createElement('button');
        refreshButton.classList.add('btn','btn-secondary','btn-lg','container','justify-content-center','d-flex');        
        refreshButton.innerHTML = 'Refresh Page';
        document.body.appendChild(refreshButton);
        refreshButton.addEventListener('click',()=>{
            location.reload();
        })        

    }
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
                    mediaListOptions{
                        scoreFormat
                      }
                    avatar{
                      medium
                    }
                    favourites{
                      anime(page:1, perPage:5) {
                        nodes{
                          coverImage {
                            extraLarge
                            large
                            medium
                            color
                          }
                        }
                      }
                    }
                    statistics{
                        anime{
                          scores {
                            score
                            mediaIds
                          }
                        }
                    }            
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
        userEntry.value = "";
        let newUserCard = document.createElement('div');
        const userName = data.data.User.name;        
        const avatar = data.data.User.avatar.medium;                
        const siteUrl = data.data.User.siteUrl;             
        const scoreFormat = data.data.User.mediaListOptions.scoreFormat;
        const mediaScores = data.data.User.statistics.anime.scores;
        console.log(mediaScores.filter(x=>x.score>80));
        if(userCount!=2){
            user1.name = userName;
            user1.avatar = avatar;
            user1.scoreFormat = scoreFormat;
            user1.mediaScores = mediaScores;            
        }        
        else{
            user2.name = userName;
            user2.avatar = avatar;
            user2.scoreFormat = scoreFormat;
            user2.mediaScores = mediaScores;            
        }
        
        newUserCard.innerHTML = `<div class="card mt-5 bg-secondary" style="width: 18rem; left:550px; margin:10px;">
        <img class="card-img-top w-25 d-md-inline-flex justify-content-center" src="${avatar}" alt="${userName}>
        <div class="card-body"position:relative">
          <h5 class="card-title">${userName}</h5>
          <div class="card-body d-flex">
            <img class="card-img-top d-flex justify-content-center"  src="${data.data.User.favourites.anime.nodes[0] === undefined? "" : data.data.User.favourites.anime.nodes[0].coverImage.medium}" style="width:50px;"></img>
            <img class="card-img-top d-flex justify-content-center"  src="${data.data.User.favourites.anime.nodes[0] === undefined? "" : data.data.User.favourites.anime.nodes[1].coverImage.medium}" style="width:50px;"></img>
            <img class="card-img-top d-flex justify-content-center"  src="${data.data.User.favourites.anime.nodes[0] === undefined? "" : data.data.User.favourites.anime.nodes[2].coverImage.medium}" style="width:50px;"></img>
            <img class="card-img-top d-flex justify-content-center"  src="${data.data.User.favourites.anime.nodes[0] === undefined? "" : data.data.User.favourites.anime.nodes[3].coverImage.medium}" style="width:50px;"></img>
            <img class="card-img-top d-flex justify-content-center"  src="${data.data.User.favourites.anime.nodes[0] === undefined? "" : data.data.User.favourites.anime.nodes[4].coverImage.medium}" style="width:50px;"></img>
          </div>
          <a href="${siteUrl}" class="btn btn-secondary">View ${userName}'s profile</a>
        </div>
    </div>`
        usersCards.appendChild(newUserCard);
    }

    function handleError(error){
        alert("User not found!")
        console.log(error)
    }

    console.log(user1);
    console.log(user2);
        
    
}


btnSearch.addEventListener('click', (e)=>searchUser(e));


/*TO-DO:
Criar um html card com as informações enviadas na query sobre o usuário; // DONE
Criar a busca pelo segundo usuário; //DONE
Descobrir um jeito de calcular a compatibilidade entre os dois usuários e exibi-la na tela;
Adicionar uma imagem placeholder no lugar dos favoritos caso estes não sejam encontráveis; 
 */