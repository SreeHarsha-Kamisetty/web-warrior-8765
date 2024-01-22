let user_data = document.getElementsByClassName("registered--value");
let investements_data = document.getElementsByClassName("amount--value");
let transaction_data = document.getElementsByClassName("trans--value");

async function getStats(){
    try {
        let res = await fetch("https://coinsquare.onrender.com/payments/");
        let data = await res.json();
        console.log(data);
        user_data[0].innerText = data.userdata;
        investements_data[0].innerText = `$ ${data.investements}`
        transaction_data[0].innerText = data.payment_count
    } catch (error) {
        console.log(error);
    }
}
getStats();