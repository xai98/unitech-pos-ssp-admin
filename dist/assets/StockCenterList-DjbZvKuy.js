import{d,u as f,j as a,c as x,a as h,F as g,r as b,b as u,I as m,B as k}from"./index-x5nyTYyF.js";const y=d(u)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
    color: #1a1a1a;
    border-bottom: 2px solid #e8ecef;
    padding: 12px 16px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    &:hover {
      background: #f5f7fa;
    }
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #e8ecef;
  }
`,w=d(m)`
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  object-fit: cover;
`,S=d(k)`
  border-radius: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #d9d9d9;
  background: #ffffff;
  color: #595959;
  
  &:hover {
    border-color: #1890ff !important;
    color: #1890ff !important;
    background: #f0f5ff !important;
  }
`,j=({data:r,loading:n,total:i,handleNextPage:s,filter:o})=>{const c=f(),l=[{title:"ລຳດັບ",key:"no",width:80,render:(t,e,p)=>o.skip+p+1},{title:"ຮູບ",dataIndex:["productId","image"],key:"image",width:100,render:t=>a.jsx(w,{src:t?`${x.URL_PHOTO_AW3}${t}`:"/placeholder.png",alt:"product",width:60,height:60,fallback:"/placeholder.png"})},{title:"ປະເພດສິນຄ້າ",dataIndex:["categoryId","categoryName"],key:"categoryName",width:150},{title:"ຊື່ສິນຄ້າ",dataIndex:"productName",key:"productName",width:200,render:t=>a.jsx("span",{style:{fontWeight:500},children:t})},{title:"ຈຳນວນຍັງເຫຼືອ",dataIndex:"amount",key:"amount",width:120,render:t=>a.jsx("span",{style:{color:t<=0?"#f5222d":"#52c41a"},children:(t||0).toLocaleString()})},{title:"ຈ/ນ ຕ່ຳສຸດ",dataIndex:"minStock",key:"minStock",width:120,render:t=>(t||0).toLocaleString()},{title:"ຈ/ນ ສູງສຸດ",dataIndex:"maxStock",key:"maxStock",width:120,render:t=>(t||0).toLocaleString()},{title:"ລາຍລະອຽດ",dataIndex:"details",key:"details",ellipsis:!0},{title:"ຈັດການ",key:"action",width:100,render:(t,e)=>a.jsx(h,{children:a.jsx(S,{icon:a.jsx(g,{}),onClick:()=>c(`${b.STOCK_CENTER_DETAIL}/${e.id}`)})})}];return a.jsx(y,{loading:n,columns:l,rowKey:"id",dataSource:r||[],scroll:{x:"max-content"},size:"middle",pagination:{current:o.skip/o.limit+1,total:i||0,pageSize:o.limit,onChange:(t,e)=>s({page:t,pageSize:e}),showSizeChanger:!0,showTotal:(t,e)=>`${e[0]}-${e[1]} ຈາກ ${t} ລາຍການ`,pageSizeOptions:["10","25","50","100"]}})};export{j as default};
