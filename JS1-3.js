const API_KEY = '6d7277db9ddf42a7b04acfc6068bb3e1';
const PAGE_SIZE = 10;
let articles = [];
let page = 1;
let totalPage = 1;
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);

// 메뉴 버튼 클릭 시 뉴스 가져오기
const menus = document.querySelectorAll('.side-menu-list button, .menus button');
menus.forEach(menu => menu.addEventListener('click', (e) => getNewsByTopic(e)));

// 검색 입력에서 Enter 키 눌렀을 때 뉴스 검색
document.getElementById('search-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getNewsByKeyword();
    event.preventDefault();
  }
});

// 검색 박스 열기/닫기
const openSearchBox = () => {
  const inputArea = document.getElementById('input-area');
  inputArea.style.display = inputArea.style.display === 'inline' ? 'none' : 'inline';
};

// 뉴스 검색
const getNewsByKeyword = async () => {
  const keyword = encodeURIComponent(document.getElementById('search-input').value);
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);
  await getNews();
};

// 뉴스 가져오기
const getNews = async () => {
  try {
    url.searchParams.set('page', page);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.totalResults === 0) {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error('No results found');
    }

    articles = data.articles;
    totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
    render();
    renderPagination();
  } catch (e) {
    console.error(e.message);
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};

// 최신 뉴스 가져오기
const getLatestNews = async () => {
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);
  await getNews();
};

// 주제별 뉴스 가져오기
const getNewsByTopic = async (event) => {
  const topic = event.target.textContent.toLowerCase();
  page = 1;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`);
  await getNews();
};

// 뉴스 렌더링
const render = () => {
  const resultHTML = articles
    .map(news => `
      <div class="news row">
        <div class="col-lg-4">
          <img class="news-img" src="${news.urlToImage}"
            onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" />
        </div>
        <div class="col-lg-8">
          <a class="title" target="_blank" href="${news.url}">${news.title}</a>
          <p>${!news.description || news.description === '' ? 'No content' : news.description.length > 200 ? news.description.substring(0, 200) + '...' : news.description}</p>
          <div>${news.source.name || 'no source'} ${moment(news.publishedAt).fromNow()}</div>
        </div>
      </div>
    `)
    .join('');

  document.getElementById('news-board').innerHTML = resultHTML;
};

// 페이지네이션 렌더링
const renderPagination = () => {
  let paginationHTML = '';
  const pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  const first = last - 4 <= 0 ? 1 : last - 4;
  
  if (page > 1) {
    paginationHTML += `
      <li class="page-item" onclick="pageClick(1)">
        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
      </li>
      <li class="page-item" onclick="pageClick(${page - 1})">
        <a class="page-link" href='#js-bottom'>&lt;</a>
      </li>`;
  }
  
  for (let i = first; i <= last; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? 'active' : ''}">
        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})">${i}</a>
      </li>`;
  }

  if (page < totalPage) {
    paginationHTML += `
      <li class="page-item" onclick="pageClick(${page + 1})">
        <a class="page-link" href='#js-bottom'>&gt;</a>
      </li>
      <li class="page-item" onclick="pageClick(${totalPage})">
        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
      </li>`;
  }

  document.querySelector('.pagination').innerHTML = paginationHTML;
};

// 페이지 클릭 시 뉴스 가져오기
const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  getNews();
};

// 오류 렌더링
const errorRender = (message) => {
  document.getElementById('news-board').innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

// 사이드 메뉴 열기
const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
};

// 사이드 메뉴 닫기
const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
};

// 다크 모드 토글 기능
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// 다크 모드 토글 버튼 클릭 이벤트
document.querySelector('.checkbox').addEventListener('change', toggleDarkMode);


// 초기 뉴스 로드
getLatestNews();



