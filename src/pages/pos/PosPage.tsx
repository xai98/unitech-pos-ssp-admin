import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import PosOrderList from "./PosOrderList";
import PosPayement from "./PosPayment";
import { consts } from "../../utils";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CATEGORIES, GET_BRANCH_STOCKS, GET_EXCHANGE, GET_LAST_ORDER } from "../../services";
import { getUserDataFromLCStorage } from "../../utils/helper";

const PosPage: React.FC = () => {
  const branchInfo = getUserDataFromLCStorage();
  const [filter, setFilter] = useState<any>({categoryId: "ALL",orderBy:"noShow_ASC"});
  const [newOrderList, setNewOrderList] = useState<any>([]);
  const [isPayments, setIsPayments] = useState<boolean>(false);
  const [typeDiscount, setTypeDiscount] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [totalFinal, setTotalFinal] = useState<{
    lak: number;
    bath: number;
    usd: number;
  }>({
    lak: 0,
    bath: 0,
    usd: 0,
  });

  const [exchange, setExchange] = useState<{
    bath: number;
    usd: number;
    cny:number
  }>({
    bath: 0,
    usd: 0,
    cny:0,
  });

  const [loadExchnage, { data: exchangeData }] = useLazyQuery(GET_EXCHANGE, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        id: consts.EXCHNAGE_ID,
      },
    },
  });



  const {data: categoryData} = useQuery(CATEGORIES,{fetchPolicy:"network-only"})



  const {
    loading,
    data: stockData,
    refetch: reloadStock,
  } = useQuery(GET_BRANCH_STOCKS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: branchInfo?.branchId?.id || undefined,
        // productName: filter?.productName || undefined,
        isShowSale: true,
      },
      // limit: 300,
      orderBy: filter?.orderBy,
    },
  });





  const {data: lastOrder,  refetch: reloadLastOrder} = useQuery(GET_LAST_ORDER,{
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: branchInfo?.branchId?.id || undefined,
      },
    },
  })





  useEffect(() => {
    const checkExchange = localStorage.getItem("VIXAY_POS");
    
    if (checkExchange) {
      // แปลงข้อมูลที่ได้จาก localStorage จาก string กลับเป็น object
      const exchangeData = JSON.parse(checkExchange);
  
      // ตั้งค่า exchange โดยใช้ข้อมูลจาก localStorage
      setExchange(exchangeData);
    } else {
      // ถ้าไม่มีข้อมูลใน localStorage จะโหลดข้อมูลใหม่
      loadExchnage();
    }
  }, []);

  useEffect(() => {
    if (exchangeData?.exchangeRate) {
      const { bath, usd, cny } = exchangeData.exchangeRate;
      // สร้างออบเจ็กต์ที่จะบันทึกลงใน localStorage
      const exchangeRateData = {
        bath,
        usd,
        cny,
      };
      // บันทึกข้อมูลลงใน localStorage (ต้องแปลงออบเจ็กต์เป็น string ด้วย JSON.stringify)
      localStorage.setItem("VIXAY_POS", JSON.stringify(exchangeRateData));
      }
  }, [exchangeData?.exchangeRate]);


  return (
    <div>
      <Row gutter={10}>

        <Col span={15}>

          {/* ລາຍການສິນຄ້າ */}
          <ProductList
            newOrderList={newOrderList}
            setNewOrderList={setNewOrderList}
            stockData={stockData}
            loading={loading}
            filter={filter}
            setFilter={setFilter}
            branchInfo={branchInfo}
            categoryData={categoryData?.categorys?.data}
          />
        </Col>
        <Col span={9}>
          {/* ລາຍການສັ່ງຊື້ */}
          <PosOrderList
            newOrderList={newOrderList}
            setNewOrderList={setNewOrderList}
            setIsPayments={setIsPayments}
            exchange={exchange}
            typeDiscount={typeDiscount}
            setTypeDiscount={setTypeDiscount}
            discount={discount}
            setDiscount={setDiscount}
            totalFinal={totalFinal}
            setTotalFinal={setTotalFinal}
          />
        </Col>
      </Row>

      {/* ຊຳລະເງິນ */}
      <PosPayement
        newOrderList={newOrderList}
        setNewOrderList={setNewOrderList}
        isPayments={isPayments}
        onClose={() => setIsPayments(false)}
        typeDiscount={typeDiscount}
        discount={discount}
        totalFinal={totalFinal}
        exchange={exchange}
        setDiscount={setDiscount}
        setTotalFinal={setTotalFinal}
        setTypeDiscount={setTypeDiscount}
        reloadStock={() => reloadStock()}
        reloadLastOrder={() => reloadLastOrder()}
        lastOrder={lastOrder}
      />
    </div>
  );
};

export default PosPage;
