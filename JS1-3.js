const API_KEY = `6d7277db9ddf42a7b04acfc6068bb3e1`;
let newsList = [];
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu=>menu.addEventListener("click", (event)=>getNewsByCategory(event)))

const getLatesNews = async () => {
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr$apiKey=&{API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log('News List:', newsList);
};


const getNewsByKeyword=async()=>{
    const keyword = document.getElementById("searchInput").value;
    console.log("keyword",keyword);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
    const response = await fetch(url)
    const data = await response.json()
    console.log("keyword data", data);
    newsList = data.articles;
    render();
};

const getNewsByCategory= async(event)=>{
    const category = event.target.textContent.toLowerCase();
    console.log("category",category);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
    
    const response = await fetch(url);
    const data = await response.json();
    console.log("d",data);
    newsList = data.articles;
    render();
};

const render = () => {
    const newsHTML = newsList.map(
        (news) => {
            const imageUrl = news.urlToImage ? news.urlToImage : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';
            return `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${imageUrl}" onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"/>
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description}</p>
                    <div>${news.source.name} * ${news.publishedAt}</div>
                </div>
            </div>`;
        }
    ).join("");
    document.getElementById('news-board').innerHTML = newsHTML;
};

getLatesNews();
