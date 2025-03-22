import{e as h,d as a,j as i,l as m}from"./index-z44FiBTz.js";const g=a.div`
  font-family: "Phetsarath OT", sans-serif;
  padding: 15px;
  border: 1px solid #000;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  margin: 10px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`,j=a.div`
  margin-bottom: 10px;
`,t=a.img`
  width: 60px;
  height: 60px;
`,x=a.div`
  font-size: 16px;
  font-weight: bold;
`,f=a.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`,o=a.img`
  width: 180px;
  height: 70px;
  margin: 10px 0;
`,r=a.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`,b=({stockCenter:d,selectStockBox:n})=>{const s=p=>(p==null?void 0:p.toLocaleString("th-TH"))||"0";return i.jsxs(g,{children:[i.jsxs(j,{children:[i.jsx(t,{src:"/logoMinipos.jpg",alt:"Logo"}),i.jsx(x,{children:"ຮ້ານມິນິມາກ ສວນເສືອປ່າ"})]}),i.jsx(f,{children:(d==null?void 0:d.productName)||"ບໍ່ລະບຸສິນຄ້າ"}),i.jsx(o,{alt:"Barcode",src:`https://barcode.tec-it.com/barcode.ashx?data=${(n==null?void 0:n.boxNo)||"N/A"}`}),i.jsxs(r,{children:[i.jsx("span",{children:"ຈຳນວນເຄື່ອງ:"}),i.jsx("span",{children:s(n==null?void 0:n.amount)})]}),(n==null?void 0:n.amountLimit)&&i.jsxs(r,{children:[i.jsx("span",{children:"ຈຳນວນສູງສຸດ:"}),i.jsx("span",{children:s(n.amountLimit)})]}),i.jsxs(r,{children:[i.jsx("span",{children:"ວັນທີສ້າງ:"}),i.jsx("span",{children:n!=null&&n.createdAt?m(n.createdAt):"-"})]}),i.jsxs(r,{children:[i.jsx("span",{children:"ຜູ້ສ້າງ:"}),i.jsx("span",{children:(n==null?void 0:n.createdBy)||"-"})]})]})},w=h.memo(b);export{w as default};
