import{k as C,d as l,e as i,l as d,m as T,j as a,a as $,n as u,o as v,p as B,b as I,B as A}from"./index-x5nyTYyF.js";const D=l(I)`
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
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-table-expanded-row {
    background: #fafafa;
  }
`,f=l(A)`
  border-radius: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  ${({color:n})=>n==="green"&&`
    background: #52c41a;
    border-color: #52c41a;
    color: white;
    &:hover, &:focus {
      background: #73d13d !important;
      border-color: #73d13d !important;
      color: white !important;
    }
  `}
  ${({color:n})=>n==="blue"&&`
    background: #1890ff;
    border-color: #1890ff;
    color: white;
    &:hover, &:focus {
      background: #40a9ff !important;
      border-color: #40a9ff !important;
      color: white !important;
    }
  `}
`,L=l.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`,S=({data:n,loading:g,total:m,handleNextPage:r,filter:o,setIsImportStockBox:p,setSelectStockBox:s,handlePrint:c,setIsExportStockBox:x})=>{const h=i.useCallback(async(t,e)=>{await s(t),e==="import"?p(!0):x(!0)},[s,p,x]),b=i.useCallback(async t=>{await s(t),c()},[s,c]),k=i.useCallback((t,e)=>{r({page:t,pageSize:e})},[r]),w=i.useMemo(()=>[{title:"ລຳດັບ",key:"no",width:65,render:(t,e,y)=>o.skip+y+1},{title:"ລະຫັດຖົງ",dataIndex:"boxNo",key:"boxNo",width:120},{title:"ຈຳນວນໃນຖົງ",dataIndex:"amount",key:"amount",width:150,render:(t,e)=>`${(e.amount||0).toLocaleString("th-TH")} / ${(e.amountLimit||0).toLocaleString("th-TH")}`},{title:"ວັນທີນຳອອກ",dataIndex:"exportDate",key:"exportDate",width:150,render:t=>t?d(new Date(t)):"-"},{title:"ຜູ້ນຳອອກ",dataIndex:"exportBy",key:"exportBy",width:120,render:t=>t||"-"},{title:"ສະຖານະ",dataIndex:"status",key:"status",width:100,render:t=>T(t)||"-"},{title:"ລາຍລະອຽດ",dataIndex:"details",key:"details",ellipsis:!0,render:t=>t||"-"},{title:"ຈັດການ",key:"action",fixed:"right",width:100,render:(t,e)=>a.jsxs($,{children:[a.jsx(u,{title:"ນຳເຄື່ອງເຂົ້າ",color:"green",children:a.jsx(f,{color:"green",icon:a.jsx(v,{}),onClick:()=>h(e,"import")})}),a.jsx(u,{title:"ພິມບິນຕິດໜ້າຖົງ",color:"blue",children:a.jsx(f,{color:"blue",icon:a.jsx(B,{}),onClick:()=>b(e)})})]})}],[o.skip,h,b]),j=i.useCallback(t=>{var e;return a.jsx(L,{children:a.jsxs("div",{style:{display:"grid",gridTemplateColumns:"120px 1fr",gap:8},children:[a.jsx("strong",{children:"ສາຂາຮັບເຄື່ອງ:"}),a.jsx("span",{children:((e=t==null?void 0:t.branchId)==null?void 0:e.branchName)||"N/A"}),a.jsx("strong",{children:"ຜູ້ຮັບເຄື່ອງ:"}),a.jsx("span",{children:(t==null?void 0:t.acceptBy)||"-"}),a.jsx("strong",{children:"ວັນທີຮັບເຄື່ອງ:"}),a.jsx("span",{children:t!=null&&t.acceptDate?d(t.acceptDate):"-"}),a.jsx("strong",{children:"ວັນທີສ້າງ:"}),a.jsx("span",{children:t!=null&&t.createdAt?d(t.createdAt):"-"}),a.jsx("strong",{children:"ຜູ້ສ້າງ:"}),a.jsx("span",{children:(t==null?void 0:t.createdBy)||"-"})]})})},[]);return a.jsx(D,{loading:g,columns:w,rowKey:"id",dataSource:n||[],scroll:{x:"max-content"},size:"middle",expandable:{expandedRowRender:j},pagination:{current:o.skip/o.limit+1,total:m||0,pageSize:o.limit,onChange:k,showSizeChanger:!0,showTotal:(t,e)=>`${e[0]}-${e[1]} ຈາກ ${t} ລາຍການ`,pageSizeOptions:["10","20","50","100"]}})},z=C.memo(S);export{z as default};
