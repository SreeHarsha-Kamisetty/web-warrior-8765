const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&x_cg_demo_api_key=CG-XVgbsUJp9n4dxZmnx9iftNLW&per_page=10";
const container = document.getElementById('container');


const sort_market_asc = document.getElementsByClassName('ascending-market')[0];
const sort_market_desc = document.getElementsByClassName('descending-market')[0];
const pagination_sec = document.getElementById('pagination-wrapper')
// const parent_container = document.getElementById('parent-container');


const page = 1;

function fetchingUrl(queryparams,page) {
    pagination_sec.innerHTML = "";
    container.innerHTML = "";
    fetch(`${url}${queryparams}&page=${page}`)
        .then((res)=>{
            pagination()
            return res.json();
        })
        .then(data => {
            container.append(coinsList(data));
            console.log(data);
        })
        .catch(err => console.log(err));
}

fetchingUrl();

function coinsList(data) {
    const coins_list = document.createElement('div');
    coins_list.className = "coin-list";

    data.forEach((item) => {
        coins_list.append(coinMaker(item));
        console.log(item);
    });
    return coins_list;
}

function coinMaker(item) {
    const coin_div = document.createElement('div');
    coin_div.className = "coin-div";

    const image = document.createElement('img');
    image.src = item.image;
    image.className = "coin-image";
    image.alt = "coin image";

    const name = document.createElement('h1');
    name.className = "coin-name";
    name.textContent = item.id;

    const current_price = document.createElement('span');
    current_price.className = "current-price";
    current_price.textContent = item.current_price;

    const price_change = document.createElement('span');
    price_change.className = "price-change";
    price_change.textContent = item.price_change_percentage_24h;

    const market_price = document.createElement('span');
    market_price.className = "market-price";
    market_price.textContent = item.market_cap;

    const button = document.createElement('button');
    button.className = "trade-btn";
    button.innerHTML = "Trade";

    // Set button color based on market price change
    if (parseFloat(item.price_change_percentage_24h) < 0) {
        button.classList.add('negative-change');
    } else {
        button.classList.add('positive-change');
    }

    coin_div.append(image);
    coin_div.append(name);
    coin_div.append(current_price);
    coin_div.append(price_change);
    coin_div.append(market_price);
    coin_div.append(button);

    return coin_div;
}

sort_market_asc.addEventListener('click',()=>{
    fetchingUrl('&order=market_cap_asc');
});

sort_market_desc.addEventListener('click',()=>{
    fetchingUrl('&order=market_cap_desc');
})

// pagination

function pagination(){

    // pagination_sec.innerHTML="";
    for(let i=1; i<=10; i++){
       const paginated_btn = document.createElement('button');
       paginated_btn.className = "paginated-buttons";
       paginated_btn.innerHTML = i;
       paginated_btn.addEventListener("click",()=>{
        container.innerHTML = "";
        fetchingUrl("",i)
    })
    pagination_sec.append(paginated_btn);
    }


}




