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
    date.textContent=item.date||'01.01.2001';
    row.appendChild(date) 
    
    const imgTd=document.createElement('td');
    const img=document.createElement('img')
    img.src=item.image;
    img.alt=item.coinname;
    imgTd.append(img);
    row.appendChild(imgTd)
                                             
    const name=document.createElement('td')
    name.textContent=item.coinname;
    row.appendChild(name)
    
    const amount=document.createElement('td')
    amount.textContent=Number(item.quantity*item.price)
    row.appendChild(amount);
    
    const pc=document.createElement('td');
    pc.textContent=item.price_change_percentage_24h
    row.appendChild(pc);
    
    const marketCap=document.createElement('td');
    marketCap.textContent=item.marketcap.toLocaleString("en-US");
    row.appendChild(marketCap);

    const tt=document.createElement('td');
    tt.textContent=item.paymentType;
    row.appendChild(tt);

    return row;
}



// fetch request for payment history table
fetch("http://localhost:8080/payments/?page=1&limit=5")
.then((res)=>res.json()).then((data)=>{
    console.log(data)
    appenRow(data.Data);
})

//fetch req for search bar


const btn=document.getElementById('search');
btn.addEventListener('click',()=>{
    var name=document.getElementById('search-input')
    
    fetch(`http://localhost:8080/payments/?q=${name.value}`).then((res)=>res.json()).then((data)=>{
        console.log(data.Data)
        appenRow(data.Data);
    })
})
