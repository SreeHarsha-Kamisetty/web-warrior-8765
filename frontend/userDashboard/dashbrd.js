function appenRow(data){
   const tab=document.getElementById("payHistory");
    tab.innerHTML="";
   data.forEach((ele)=>{
    tab.append(createColumn(ele));
   })
}

function createColumn(item){
    const row=document.createElement('tr');
    const date=document.createElement('td');
    date.textContent=(item.date||'01.01.2001');
    row.appendChild(date) 
    
    const imgTd=document.createElement('td');
    const img=document.createElement('img')
    img.src=item.image;
    img.alt=item.coinname;
    img.className="icon-img";
    imgTd.append(img);
    row.appendChild(imgTd)
                                             
    const name=document.createElement('td')
    name.textContent=item.coinname.toLocaleString().toUpperCase();
    row.appendChild(name)
    
    const amount=document.createElement('td')
    amount.textContent=`$ ${(Number(item.quantity*item.price)).toLocaleString("en-US")}`;
    row.appendChild(amount);
    
    const pc=document.createElement('td');
    pc.textContent=`${item.price_change_percentage_24h} %`
    row.appendChild(pc);
    
    const marketCap=document.createElement('td');
    marketCap.textContent=`$ ${item.marketcap.toLocaleString("en-US")}`;
    row.appendChild(marketCap);

    const tt=document.createElement('td');
    tt.textContent=item.paymentType.toLocaleString().toUpperCase();
    row.appendChild(tt);

    return row;
}







// fetch request for payment history table
function fetchData(page) {
    fetch(`http://localhost:8080/payments/?page=${page || 1}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
            const total = Number(data.total);
            pagination(Math.ceil(total / 5));
            console.log(data);
            appenRow(data.Data);

           
        });
}

function showModal() {
    // Assuming your modal has an ID of "myModal"
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
}

const pagination_btn=document.getElementById('btn-foot');
fetchData();
function pagination(total){
   pagination_btn.innerHTML=""; 
   for( let i=1;i<=total;i++){
    let button=document.createElement('button');
    button.textContent=i;
    button.className='page-btn';
    pagination_btn.append(button) 

    button.addEventListener('click',()=>{
       fetchData(i);
    })
   }
    
}
//fetch req for search bar


const btn=document.getElementById('search');
btn.addEventListener('click',()=>{
    var name=document.getElementById('search-input')
    
    fetch(`http://localhost:8080/payments/?q=${name.value}`).then((res)=>res.json()).then((data)=>{
        console.log(data.Data)
        appenRow(data.Data);
         // Call and show the modal here
         showModal();
         pagination_btn.innerHTML="";
    })
})
