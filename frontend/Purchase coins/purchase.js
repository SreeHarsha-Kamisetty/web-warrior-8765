function loadChart(coinname){
  var prices;
  let date = [];
  let currentDate = new Date();
  for (let i = 0; i < 15; i++) {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() - i);
    const formattedDate = `${d.getDate()} ${d.toLocaleString("default", {
      month: "short",
    })}`; // format date
    date.push(formattedDate);
  }
  date.reverse();
  console.log(date);
  fetch(
    `https://api.coingecko.com/api/v3/coins/${coinname}/market_chart?vs_currency=usd&days=14&interval=daily`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      prices = data.prices;
      let marketcap = data.market_caps;
      let volume = data.total_volumes;
      let prices_data = [];
      let market_caps_data = [];
      let total_volume = [];
      prices.forEach((item) => {
        prices_data.push(item[1]);
      });
      marketcap.forEach((item) => {
        market_caps_data.push(item[1]);
      });
      volume.forEach((item) => {
        total_volume.push(item[1]);
      });
      console.log(prices_data);
      // Sample data
      const data_1 = {
        labels: date,
        datasets: [
          {
            label: "Price in last 14 days (in usd)",
            data: prices_data,
            fill: false,
            borderColor: "blue",
            tension: 0.1,
          //   pointStyle: "rectRounded",
          //   pointRadius: 6,
          },
        ],
      };
      const data_2 = {
        labels: date,
        datasets: [
          {
            label: "Total Volume",
            data: total_volume,
            fill: false,
            borderColor: "red",
            tension: 0.1,
            
          //   pointStyle: "triangle",
          //   pointRadius: 6,
          //   backgroundColor: "white"
          },
        ],
      };
      const config_2 = {
        type: "line",
        data: data_2,
        options: {
          scales: {
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // X-axis grid color
              },
              ticks: {
                color: "white", // X-axis label color
              },
            },
            y: {
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // Y-axis grid color
              },
              ticks: {
                color: "white", // Y-axis label color
              },
            },
          },
          plugins: {
              title: {
                display: true,
                text: "Total Volume in last 14 days",
                color: "white", // Label text color
              },
              legend: {
                  labels: {
                    color: "white", // Color of the label for the "Total Volume" dataset
                  },
                },
            },
        },
       
     
        
      };
  
      // Chart configuration
      const config = {
        type: "line",
        data: data_1,
        options: {
          scales: {
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // X-axis grid color
              },
              ticks: {
                color: "white", // X-axis label color
              },
            },
            y: {
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // Y-axis grid color
              },
              ticks: {
                color: "white", // Y-axis label color
              },
            },
          },
          plugins: {
              title: {
                display: true,
                text: "Price of the coin in the last 14 days",
                color: "white", // Label text color
              },
              legend: {
                  labels: {
                    color: "white", // Color of the label for the "Total Volume" dataset
                  },
                },
            },
        },
     
      };
  
      // // Get the canvas element and create the chart
      const ctx = document.getElementById("myChart").getContext("2d");
      const myChart = new Chart(ctx, config);
      const ctx2 = document.getElementById("myChart_2").getContext("2d");
      const myChart_2 = new Chart(ctx2, config_2);
    })
    .catch((error) => console.log(error));
}
loadChart(JSON.parse(localStorage.getItem("local_items")).coin_name)

// purchase form Implementation

const purchase_coin_name = document.getElementById('coinName');
const purchase_coin_price = document.getElementById('coinPrice');
const balance = document.getElementById('availableBalance');
const quantity_input = document.getElementById('quantity');
const current_quantity = document.getElementById('currentQuantity');
const buy_button = document.getElementById('buyButton');
const sell_button = document.getElementById('sellButton');
const total_payment = document.getElementById('totalPayment');
// quantity logic 
let error = document.getElementById("error");
quantity_input.addEventListener("input",()=>{
  total_payment.innerText = +purchase_coin_price.innerText * +quantity_input.value
  if(+total_payment.innerText>+balance.innerText){
    error.innerText = "Insufficient funds";
  }
  else{
    error.innerText="";
  }
})
function getPurchaseForm() {
  purchase_coin_name.innerHTML = "";
  purchase_coin_price.innerHTML = "";
  balance.innerHTML = "";

 const user_balance = localStorage.getItem('money');
  if(user_balance == null){
    balance.textContent = '0.00';
  }
  else{
    balance.textContent = user_balance;
  }
  console.log(localStorage.getItem('money'));
  const stored_items = JSON.parse(localStorage.getItem('local_items'));
  purchase_coin_name.textContent = stored_items.coin_name.charAt(0).toUpperCase() + stored_items.coin_name.slice(1);
  purchase_coin_price.textContent = stored_items.price
}

getPurchaseForm();

let coinname = JSON.parse(localStorage.getItem('local_items')).coin_name;
console.log(coinname)
let id = localStorage.getItem("id");

// getting user available coins
async function getCoinData(coinname,id){
  try {
      let res = await fetch(`https://coinsquare.onrender.com/payments/available/${id}/${coinname}`)
      let data = await res.json();
      console.log(data.available);
      let current = document.getElementById("currentQuantity")
      current.innerText = data.available;
  } catch (error) {
      console.log(error);
  }
}
getCoinData(coinname,id);

// redirecting to payment page
const add_funds_btn=document.getElementById('addFunds');
add_funds_btn.addEventListener('click',()=>{
  window.location.href='../payment.html';
})

//function to get user balance

async function getAvailableBalance(id){
  try {
      let res = await fetch(`https://coinsquare.onrender.com/user/${id}`)
      let data = await res.json();
      // console.log(data.user.balance)
      let balance = document.getElementById("availableBalance")
      balance.innerText = data.user.balance
  } catch (error) {
   console.log(error)   
  }

}
getAvailableBalance(id);

// logic for buy and sell 

let buyBtn = document.getElementById("buyButton");
buyBtn.addEventListener("click",async(e)=>{
  e.preventDefault();
    let quantity = document.getElementById("quantity")
    let details = JSON.parse(localStorage.getItem("local_items"));
    localStorage.setItem("latest",JSON.stringify({coinname:details.coin_name,price:details.price}))
    let id = localStorage.getItem("id");
    // console.log(id);
    let payload = {
      "coinname":details.coin_name,
      "image":details.coin_image,
      "price":details.price,
      "price_change_percentage_24h":details.change,
      "userID":id,
      "paymentType":"buy",
      "quantity":Number(quantity.value),
      "marketcap":details.market_price
    }
    // console.log(payload);
    if(+balance.innerText<+total_payment.innerText){
      
      error.innerText = ""
      error.innerText = "insufficient funds, please add more"
    }
    else{
      
      try {
        let res = await fetch(`https://coinsquare.onrender.com/payments/new`,{
            method:"POST",
            headers:{
              "Content-type":"application/json"
            },
            body:JSON.stringify(payload)
        })
        let data = await res.json()
        // console.log(data)
        window.location.href="../userDashboard/dashboard.html"
    } catch (error) {
        console.log(error);
    }
    }
 
})
let sellBtn = document.getElementById("sellButton");
sellBtn.addEventListener("click",async(e)=>{
    e.preventDefault()
    let quantity = document.getElementById("quantity")
    let details = JSON.parse(localStorage.getItem("local_items"));
    let id = localStorage.getItem("id");
    // console.log(id);
    let payload = {
      "coinname":details.coin_name,
      "image":details.coin_image,
      "price":details.price,
      "price_change_percentage_24h":details.change,
      "userID":id,
      "paymentType":"sell",
      "quantity":Number(quantity.value),
      "marketcap":details.market_price
    }
    // console.log(payload);
    if(+quantity_input.value>+current_quantity.innerText){
      error.innerText = ""
      error.innerText = "Insufficient quanity , you cannot sell more than you own"
    }
    else{
      try {
        let res = await fetch(`https://coinsquare.onrender.com/payments/new`,{
            method:"POST",
            headers:{
              "Content-type":"application/json"
            },
            body:JSON.stringify(payload)
        })
        let data = await res.json()
        // console.log(data)
        window.location.href="../userDashboard/dashboard.html"
    } catch (error) {
        console.log(error);
    }
    }
  
})

// quantity 
let quantity = document.getElementById("quantity");