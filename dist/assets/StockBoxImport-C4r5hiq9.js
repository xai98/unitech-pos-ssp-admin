import{k as P,d as e,e as d,g as U,m as H,s,M as z,j as r,q as K,t as _,U as q,h as G,B as X}from"./index-D73RPm7o.js";const Z=e.div`
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`,F=e.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`,J=e.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
`,Q=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`,b=e.div`
  display: flex;
  flex-direction: column;
`,h=e.span`
  font-size: 14px;
  color: #595959;
  font-weight: 500;
`,j=e.span`
  font-size: 16px;
  color: #1a1a1a;
  margin-top: 4px;
`,V=e(G)`
  border-radius: 6px;
  margin-bottom: 24px;
  padding: 8px 12px;
`,W=e.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: 600;
  height: 140px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  color: #1a1a1a;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`,M=e(X)`
  border-radius: 6px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${({type:a})=>a==="dashed"&&`
    border-color: #52c41a;
    color: #52c41a;
    &:hover, &:focus {
      border-color: #73d13d !important;
      color: #73d13d !important;
    }
  `}
  ${({danger:a})=>a&&`
    background: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
    &:hover, &:focus {
      background: #ff7875 !important;
      border-color: #ff7875 !important;
    }
  `}
`,Y=({selectStockBox:a,stockCenter:i,setSelectStockBox:y,setIsImportStockBox:v,refetchStockBox:$})=>{const[x,w]=d.useState(""),[o,p]=d.useState(0),[L,I]=d.useState(!1),g=d.useRef(null),[T,{loading:O}]=U(q,{onCompleted:()=>{a!=null&&a.boxNo&&localStorage.removeItem(a.boxNo),p(0),y(null),v(!1),$(),s.success("ເພີ່ມເຄື່ອງເຂົ້າຖົງສຳເລັດ")},onError:n=>{s.error("ການສ້າງສະຕ໋ອກລົ້ມເຫຼວ"),console.error("Update error:",n)}}),l=d.useMemo(()=>n=>(n==null?void 0:n.toLocaleString("th-TH"))||"0",[]),t=d.useMemo(()=>({boxNo:(a==null?void 0:a.boxNo)||"N/A",amount:l(a==null?void 0:a.amount),amountLimit:l(a==null?void 0:a.amountLimit),status:H((a==null?void 0:a.status)||"")}),[a==null?void 0:a.boxNo,a==null?void 0:a.amount,a==null?void 0:a.amountLimit,a==null?void 0:a.status,l]),N=d.useCallback(async n=>{var A,E;if(![12,13].includes(n.length)){s.error("Barcode ບໍ່ຖືກຮູບແບບ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");return}if(!a){s.error("ກະລຸນາເລືອກຖົງກ່ອນ");return}if(a.status!=="ready"){s.error("ຖົງຕ້ອງຢູ່ໃນສະຖານະ: ພ້ອມໃຊ້ງານ ເທົ່ານັ້ນ");return}if((i==null?void 0:i.productBarcode)!==n){s.warning("ບາໂຄ້ດສິນຄ້າບໍ່ຕົງກັນ ກະລະນາກວດສອບຄືນ");return}I(!0);const u=a.boxNo,m=localStorage.getItem(u),f=(m?parseInt(m,10):o)+1;if(f>(a.amountLimit||1/0)){s.warning("ຖົງບັນຈຸເຕັມແລ້ວ"),I(!1),w(""),(A=g.current)==null||A.focus();return}p(f),localStorage.setItem(u,f.toString()),s.success(`ເພີ່ມສິນຄ້າເຂົ້າຖົງ: ${u}`),I(!1),w(""),(E=g.current)==null||E.focus()},[a,i==null?void 0:i.productBarcode,o]);d.useEffect(()=>{var n;if(a!=null&&a.boxNo){const u=localStorage.getItem(a.boxNo);p(u?parseInt(u,10):a.amount||0),(n=g.current)==null||n.focus()}},[a]),d.useEffect(()=>{let n="",u;const m=f=>{/[a-zA-Z0-9]/.test(f.key)&&(n+=f.key,clearTimeout(u),u=setTimeout(()=>{[12,13].includes(n.length)&&N(n),n=""},100))};return window.addEventListener("keypress",m),()=>{window.removeEventListener("keypress",m),clearTimeout(u)}},[N]);const R=d.useCallback(()=>{if(!a){s.error("ກະລຸນາເລືອກຖົງກ່ອນ");return}z.confirm({title:"ຢືນຢັນເຄື່ອງເຂົ້າຖົງ",content:`ທ່ານຕ້ອງການຢືນຢັນເຄື່ອງເຂົ້າຖົງ ${a.boxNo} ແທ້ ຫຼື ບໍ່?`,okText:"ຢືນຢັນ",cancelText:"ປິດອອກ",onOk:()=>T({variables:{data:{stockCenterId:i==null?void 0:i.id,amount:o},where:{id:a.id}}})})},[a,i==null?void 0:i.id,o,T]),D=d.useCallback(()=>{a&&z.confirm({title:"ຢືນຢັນຍົກເລິກ",content:`ຕ້ອງການຍົກເລິກເຄື່ອງເຂົ້າຖົງ ${a.boxNo} ແທ້ບໍ່?`,okText:"ຢືນຢັນ",cancelText:"ປິດອອກ",onOk:()=>{localStorage.removeItem(a.boxNo),p(0),y(null),v(!1),s.success("ຍົກເລິກສຳເລັດ")}})},[a,y,v]);return r.jsxs(Z,{children:[r.jsxs(F,{children:[r.jsx(J,{children:"ນຳເຄື່ອງເຂົ້າຖົງ"}),r.jsx(M,{disabled:L,onClick:D,icon:r.jsx(K,{}),children:"ຍົກເລິກ"})]}),r.jsxs(Q,{children:[r.jsxs(b,{children:[r.jsx(h,{children:"ລະຫັດຖົງ"}),r.jsx(j,{children:t.boxNo})]}),r.jsxs(b,{children:[r.jsx(h,{children:"ຈຳນວນມີໃນຖົງ"}),r.jsx(j,{children:t.amount})]}),r.jsxs(b,{children:[r.jsx(h,{children:"ຈຳນວນທີ່ບັນຈຸໄດ້"}),r.jsx(j,{children:t.amountLimit})]}),r.jsxs(b,{children:[r.jsx(h,{children:"ສະຖານະ"}),r.jsx(j,{children:t.status})]})]}),r.jsx(V,{ref:g,placeholder:"ສະແກນເຄື່ອງເຂົ້າຖົງ...",size:"large",value:x,onChange:n=>w(n.target.value),onPressEnter:()=>N(x),disabled:L,allowClear:!0}),r.jsxs(W,{children:[l(o)," / ",t.amountLimit]}),r.jsx(M,{type:"dashed",size:"large",block:!0,disabled:O||o===0,onClick:R,icon:r.jsx(_,{}),children:"ບັນທຶກ"})]})},c=P.memo(Y);export{c as default};
