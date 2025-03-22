import React from "react";
import { Col, Divider, Flex, InputNumber, message, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatNumber, getUserDataFromLCStorage } from "../../utils/helper";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../../services";
import { generateOrderNo } from "./component/generateOrderNo";
import ReactToPrint from "react-to-print";
import moment from "moment";
import useEnterKeyHandler from "./component/useEnterKeyHandler";

interface PosPayment {
  newOrderList: any[];
  setNewOrderList: (newOrderList: any[]) => void;
  isPayments: boolean;
  onClose: () => void;
  reloadStock: () => void;
  typeDiscount: string;
  discount: number;
  totalFinal: {
    lak: number;
    bath: number;
    usd: number;
  };
  exchange: {
    bath?: number;
    usd?: number;
    cny?: number;
  };
  setDiscount: (discount: number) => void;
  setTypeDiscount: (typeDiscount: string) => void;
  setTotalFinal: (totalFinal: {
    lak: number;
    bath: number;
    usd: number;
  }) => void;
  lastOrder: any;
  reloadLastOrder: () => void;
}

interface TotalPay {
  cash_lak?: number;
  cash_bath?: number;
  cash_usd?: number;
  transfer_lak?: number;
  transfer_bath?: number;
  transfer_usd?: number;
  amount?: number; // This is the total amount in LAK
}

const moneyList = [50000, 100000, 150000, 200000, 250000, 300000];

const PosPayement: React.FC<PosPayment> = ({
  newOrderList,
  setNewOrderList,
  isPayments,
  onClose,
  typeDiscount,
  discount,
  totalFinal,
  exchange,
  setDiscount,
  setTotalFinal,
  setTypeDiscount,
  reloadStock,
  lastOrder,
  reloadLastOrder,
}) => {
  const branchInfo = getUserDataFromLCStorage();

  //generate order no
  const orderNo = lastOrder?.getLastOder?.order_no
    ? generateOrderNo(lastOrder.getLastOder)
    : "VIXAY-00000001";


  //print bill
  const printComponentRef = useRef<any>(null);
  const reactToPrintContent = useRef<any>(null); // Ensure the ref type is correct

  // const orderNo = generateBill(); //ເລກທີ່ບິນ
  const [typePay, setTypePay] = useState<string | null>(null); //ປະເພດການຊຳລະເງິນສິນຄ້າ
  const [totalPay, setTotalPay] = useState<TotalPay>({
    cash_lak: 0,
    cash_bath: 0,
    cash_usd: 0,
    transfer_lak: 0,
    transfer_bath: 0,
    transfer_usd: 0,
    amount: 0,
  });

  const [chooseMoney, setChooseMoney] = useState<number>(0);
  const [isEqualTotal, setIsEqualTotal] = useState<boolean>(false);

  const [createOrder, { loading: createOrderLoading }] =
    useMutation(CREATE_ORDER);

  useEffect(() => {
    // Calculate the total amount in LAK
    const calculateAmount = (currency: string, exchangeRate?: number) => {
      const amount = totalPay[currency as keyof TotalPay] || 0;
      return amount * (exchangeRate || 1);
    };

    const calculatedAmount = [
      { key: "cash_lak", rate: 1 },
      { key: "cash_bath", rate: exchange.bath },
      { key: "cash_usd", rate: exchange.usd },
      { key: "transfer_lak", rate: 1 },
      { key: "transfer_bath", rate: exchange.bath },
      { key: "transfer_usd", rate: exchange.usd },
    ].reduce((acc, { key, rate }) => acc + calculateAmount(key, rate), 0);

    // Update the state only if the calculated amount is different
    if (totalPay.amount !== calculatedAmount) {
      setTotalPay((prev) => ({ ...prev, amount: calculatedAmount }));
    }
  }, [totalPay, exchange]);

  useEffect(() => {
    const resetTotalPay = (overrides = {}) => {
      setTotalPay({
        cash_lak: 0,
        cash_bath: 0,
        cash_usd: 0,
        transfer_lak: 0,
        transfer_bath: 0,
        transfer_usd: 0,
        amount: 0,
        ...overrides,
      });
    };

    switch (typePay) {
      case "CASH":
      case "CASH_AND_TRANSFER":
        resetTotalPay();
        break;
      case "TRANSFER":
        resetTotalPay({ transfer_lak: totalFinal.lak });
        break;
      default:
        resetTotalPay();
    }

    setChooseMoney(0);
  }, [typePay]);

  useEffect(() => {
    const overrides =
      typePay === "TRANSFER"
        ? { transfer_lak: chooseMoney }
        : { cash_lak: chooseMoney };
    setTotalPay((prevState) => ({ ...prevState, ...overrides }));
  }, [chooseMoney]);

  useEffect(() => {
    const overrides =
      typePay === "CASH" && isEqualTotal
        ? { cash_lak: totalFinal.lak }
        : typePay === "TRANSFER" || isEqualTotal
        ? { transfer_lak: totalFinal.lak, amount: 0 }
        : typePay === "CASH_AND_TRANSFER" && isEqualTotal
        ? { cash_lak: totalFinal.lak, amount: 0 }
        : { cash_lak: 0, transfer_lak:0,amount: 0 };

    setTotalPay((prevState) => ({ ...prevState, ...overrides }));

  }, [isEqualTotal, typePay]);




  const changeAmount = totalPay?.amount
    ? (totalPay?.amount || 0) - (totalFinal?.lak || 0)
    : null;
  const isInsufficient = changeAmount !== null && changeAmount < 0;
  const isSufficient = changeAmount !== null && changeAmount > 0;

  //ລວມຕົ້ນທືນສິນຄ້າ
  const totalPriceCost = newOrderList.reduce((acc, item) => {
    return acc + item.order_qty * item.price_cost;
  }, 0);

  //ລວມຍອດເງິນ
  const sumTotalPrice =
    newOrderList &&
    newOrderList?.reduce((acc, item) => {
      return acc + (item.order_total_price || 0); // Assuming total_price is a number
    }, 0);

  const sumTotalCommission =
    newOrderList &&
    newOrderList?.reduce((acc, item) => {
      return acc + (item.commission || 0); // Assuming total_price is a number
    }, 0);

  const _handleSaveAndPrintBill = async () => {
    try {
      // ตรวจสอบเงื่อนไขก่อนดำเนินการ
      if (createOrderLoading) return;
      if (isInsufficient)
        return message.warning("ກະລຸນາປ້ອນຈຳນວນເງິນໃຫ້ພຽງພໍກັບຄ່າສິນຄ້າ");
      if (!typePay) return message.warning("ກະລຸນາເລືອກປະເພດຊຳລະ");

      const amountDue = (totalPay?.amount || 0) - (totalFinal?.lak || 0);
      if (amountDue < 0) {
        return message.warning("ກະລຸນາປ້ອນຈຳນວນເງິນ");
      }
      // คำนวณ total_discount
      const calculateDiscount = (
        sumTotalPrice: number,
        discount: number,
        typeDiscount: string
      ) => {
        if (typeDiscount === "PERCENT") {
          return discount > 0 ? (sumTotalPrice * discount) / 100 : 0;
        }
        return discount > 0 ? discount : 0;
      };

      const total_discount = calculateDiscount(
        sumTotalPrice,
        discount,
        typeDiscount || "NOT_DISCOUNT"
      );

      const _data = {
        order_no: orderNo,
        branchId: branchInfo?.branchId?.id,
        branchName: branchInfo?.branchId?.branchName,
        order_items: newOrderList,
        total_price: sumTotalPrice,
        totalCommission: sumTotalCommission,
        discount_type: typeDiscount || "NOT_DISCOUNT",
        discount: discount,
        discount_total: total_discount,
        exchangeRate: {
          bath: exchange?.bath,
          usd: exchange?.usd,
        },
        typePay: typePay,
        cash_lak: totalPay?.cash_lak,
        cash_bath: totalPay?.cash_bath,
        cash_usd: totalPay?.cash_usd,
        transfer_lak: totalPay?.transfer_lak,
        transfer_bath: totalPay?.transfer_bath,
        transfer_usd: totalPay?.transfer_usd,
        totalOriginPrice: totalPriceCost,
        final_receipt_total: totalFinal?.lak,
        send_back_customer: (totalPay?.amount || 0) - totalFinal?.lak,
        overall_status: "PAYMENTED",
      };

      // เรียกใช้ฟังก์ชันสร้างคำสั่งซื้อ
      const resultUpdate = await createOrder({
        variables: { data: _data },
      });

      if (resultUpdate?.data?.createOrder?.id) {
        message.success("ຊຳລະເງິນສຳເລັດ");
        if (reactToPrintContent.current) {
          reactToPrintContent.current.handlePrint();
        } // Trigger print after saving order
        reloadStock();
        reloadLastOrder();
        setNewOrderList([]);
        setDiscount(0);
        setTotalPay({
          cash_lak: 0,
          cash_bath: 0,
          cash_usd: 0,
          transfer_lak: 0,
          transfer_bath: 0,
          transfer_usd: 0,
          amount: 0,
        });
        setTotalFinal({
          lak: 0,
          bath: 0,
          usd: 0,
        });
        setTypePay("");
        setTypeDiscount("");

        onClose();
      }
    } catch (error) {
      message.error("ກຸລາລອງໃໝ່ອີກຄັ້ງ");
      console.error("Error occurred during order processing:", error);
    }
  };

  //enter to save order
  useEnterKeyHandler(_handleSaveAndPrintBill, isPayments);

  return (
    <div>
      <Modal
        open={isPayments}
        style={{ fontSize: 20, padding: 0 }}
        footer={false}
        width={1000}
        closeIcon={false}
        className="payment-modal"
      >
        <div className="bg-payment">
          <div
            style={{
              backgroundColor: isInsufficient
                ? "red"
                : !isInsufficient && !isSufficient && changeAmount !== null
                ? "green"
                : "#1976d2",
              padding: 15,
              textAlign: "center",
            }}
          >
            {isSufficient && (
              <div style={{ color: "#fff", fontSize: 25, fontWeight: 900 }}>
                ເງິນທອນກີບ: {formatNumber(changeAmount)}
              </div>
            )}

            {isInsufficient && (
              <div style={{ color: "#fff", fontSize: 25, fontWeight: 900 }}>
                ເງິນບໍ່ພໍ: {formatNumber(changeAmount)}
              </div>
            )}

            {!isInsufficient && !isSufficient && changeAmount !== null && (
              <div style={{ color: "#fff", fontSize: 25, fontWeight: 900 }}>
                ເງິນຄົບພໍດີ: {formatNumber(totalFinal.lak)}
              </div>
            )}

            {changeAmount === null && (
              <div>
                <div style={{ color: "#fff", fontSize: 25, fontWeight: 900 }}>
                  ເງິນທີ່ຕ້ອງຮັບ
                </div>
                <Divider style={{ margin: 0 }} />
                <Flex
                  justify={"space-around"}
                  align={"center"}
                  style={{ color: "#fff", fontSize: 25, fontWeight: 900 }}
                >
                  <div>ກີບ: {formatNumber(totalFinal.lak)}</div>
                  <div>ບາດ: {formatNumber(totalFinal.bath)}</div>
                  <div>ໂດລາ: {formatNumber(totalFinal.usd)}</div>
                </Flex>
              </div>
            )}
          </div>

          <Row style={{ textAlign: "center", fontWeight: "bold" }}>
            <Col
              span={8}
              onClick={() => setTypePay("CASH")}
              className={`type-pay  ${
                typePay === "CASH" ? "active-payment" : ""
              }`}
            >
              ເງິນສົດ
            </Col>
            <Col
              span={8}
              onClick={() => setTypePay("TRANSFER")}
              className={`type-pay  ${
                typePay === "TRANSFER" ? "active-payment" : ""
              }`}
            >
              ເງິນໂອນ
            </Col>
            <Col
              span={8}
              onClick={() => setTypePay("CASH_AND_TRANSFER")}
              className={`type-pay  ${
                typePay === "CASH_AND_TRANSFER" ? "active-payment" : ""
              }`}
            >
              ເງິນສົດ ແລະ ໂອນ
            </Col>
          </Row>

          <Row
            style={{ backgroundColor: "white", padding: "20px 0px" }}
            gutter={10}
          >
            <Col span={18}>
              {/* cash lak */}
              <Row gutter={10}>
                {/* get lak */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ສົດກີບ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    min={0}
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      parseFloat(value?.replace(/,/g, "") || "0")
                    }
                    value={totalPay.cash_lak}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        cash_lak: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "CASH" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>
              <div style={{ height: 10 }}></div>
              <Row gutter={10}>
                {/* get bath */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ສົດບາດ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                    }
                    value={totalPay.cash_bath}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        cash_bath: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "CASH" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>
              <div style={{ height: 10 }}></div>
              <Row gutter={10}>
                {/* get usd */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ສົດໂດລາ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                    }
                    value={totalPay.cash_usd}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        cash_usd: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "CASH" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>

              <Divider />

              {/* transfer lak */}
              <Row gutter={10}>
                {/* get lak */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ໂອນກີບ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                    }
                    value={totalPay.transfer_lak}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        transfer_lak: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "TRANSFER" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>
              <div style={{ height: 10 }}></div>
              <Row gutter={10}>
                {/* get bath */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ໂອນບາດ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                    }
                    value={totalPay.transfer_bath}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        transfer_bath: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "TRANSFER" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>
              <div style={{ height: 10 }}></div>
              <Row gutter={10}>
                {/* get usd */}
                <Col span={4} style={{ fontSize: 20, textAlign: "right" }}>
                  ໂອນໂດລາ
                </Col>
                <Col span={20}>
                  <InputNumber
                    size="large"
                    autoComplete="off"
                    placeholder="ປ້ອນຈຳນວນເງິນ"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                    }
                    value={totalPay.transfer_usd}
                    onChange={(value: number | null) => {
                      setTotalPay((prev) => ({
                        ...prev,
                        transfer_usd: value || 0,
                      }));
                    }}
                    disabled={
                      typePay !== "TRANSFER" && typePay !== "CASH_AND_TRANSFER"
                    }
                  />
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row gutter={[10, 5]}>
                {moneyList?.map((value) => (
                  <Col
                   key={value}
                    className="qty-money"
                    onClick={() => setChooseMoney(value)}
                    span={24}
                  >
                    {formatNumber(value)} ກີບ
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <Row style={{ textAlign: "center", fontWeight: "bold" }}>
            <Col
              span={6}
              style={{ fontSize: 20, padding: 10,backgroundColor: isEqualTotal ? "green" : "",color: isEqualTotal ? "white" : "" }}
              className="footer-payment"
              onClick={() => setIsEqualTotal(!isEqualTotal)}
            >
              ຈຳນວນເງິນພໍດີ
            </Col>
            <Col
              span={14}
              style={{
                fontSize: 20,
                padding: 10,
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
              className="footer-payment"
              onClick={_handleSaveAndPrintBill}
            >
              ກົດຮັບເງິນ
            </Col>
            <Col
              span={4}
              style={{ fontSize: 20, padding: 10 }}
              className="footer-payment"
              onClick={() => onClose()}
            >
              ປິດອອກ
            </Col>
          </Row>

          {/* <ReactToPrint
            trigger={() => <button>Print this out!</button>}
            content={() => reactToPrintContent.current}
          />

          <div style={{ display: "none" }}>
            <Bill
              ref={reactToPrintContent}
              newOrderList={newOrderList}
              totalPay={totalPay}
              orderNo={orderNo}
              exchange={exchange}
              totalFinal={totalFinal}
              typeDiscount={typeDiscount}
              discount={discount}
              sumTotalPrice={sumTotalPrice}
              branchInfo={branchInfo}
            />
          </div> */}

          <div style={{ display: "none" }}>
            <ReactToPrint
              trigger={() => <></>}
              content={() => printComponentRef.current}
              ref={reactToPrintContent}
            />

            <div ref={printComponentRef}>
              <Bill
                newOrderList={newOrderList}
                totalPay={totalPay}
                orderNo={orderNo}
                exchange={exchange}
                totalFinal={totalFinal}
                typeDiscount={typeDiscount}
                discount={discount}
                sumTotalPrice={sumTotalPrice}
                branchInfo={branchInfo}
                changeAmount={changeAmount}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

interface BillProps {
  newOrderList: any[];
  totalPay: TotalPay;
  orderNo: string;
  exchange: {
    bath?: number;
    usd?: number;
    cny?: number;
  };
  totalFinal: {
    lak: number;
    bath: number;
    usd: number;
  };
  typeDiscount: string;
  discount: number;
  sumTotalPrice: number;
  branchInfo: any;
  changeAmount:any;
}

class Bill extends React.Component<BillProps> {
  render() {
    const {
      newOrderList,
      orderNo,
      exchange,
      totalFinal,
      typeDiscount,
      discount,
      sumTotalPrice,
      branchInfo,
      changeAmount
    } = this.props;
    return (
      <div style={{ fontFamily: "Phetsarath OT", padding: 10 }}>
        {/* logo */}
        <div
          style={{
            marginBottom: 10,
            textAlign: "center",
            color: "#000000",
            borderBottom: "1px solid gray",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            <div
              style={{
                padding: 0,
                margin: 0,
                fontWeight: "bold !important",
                color: "#000000",
              }}
            >
              ຮ້ານມິນິມາກ ສວນເສືອປ່າ
            </div>
            <div
              style={{
                padding: 0,
                margin: 0,
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              ສາຂາ {branchInfo?.branchId?.branchName}
            </div>
            <div
              style={{
                padding: 0,
                margin: 0,
                color: "#000000",
                fontSize: "15px",
              }}
            >
              ພະນັກງານ: {branchInfo?.firstName} {branchInfo?.lastName}
            </div>
          </div>
        </div>
        {/* logo */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            margin: 0,
            padding: 0,
            fontWeight: "bold",
            color: "#000000",
            flexDirection: "column",
            borderBottom: "1px solid gray",
          }}
        >
          <p
            style={{
              padding: 0,
              margin: 0,
              // fontWeight: "bold !important",
              color: "black",
            }}
          >
            ເລກບິນ: {orderNo}
          </p>
          <p
            style={{
              padding: 0,
              margin: 0,
              // fontWeight: "bold !important",
              color: "black",
            }}
          >
            ພະນັກງານ: {branchInfo?.firstName} {branchInfo?.lastName}
          </p>
          <p
            style={{
              padding: 0,
              margin: 0,
              // fontWeight: "bold",
              color: "black",
            }}
          >
            ວັນທີ: {moment(new Date()).format("DD-MM-YYYY HH:mm")}
          </p>
        </div>

        <p style={{ margin: 0 }}>ລາຍການສິນຄ້າ</p>
        {newOrderList &&
          newOrderList?.map((item, index) => (
            <div
              key={item?.id}
              style={{
                display: "flex",
                // justifyContent: "space-between",
                flexDirection: "column",
                fontWeight: "bold",
                fontSize: 13,
                // borderBottom: "0.1px solid #eee",
              }}
            >
              <div>
                {index + 1}. {item?.productName || "-"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ paddingLeft: 10 }}>
                  ({formatNumber(item?.order_qty || 0)} x{" "}
                  {formatNumber(item?.price_sale || 0)})
                </div>
                <div>{formatNumber(item?.order_total_price || 0)}</div>
              </div>
            </div>
          ))}

        <div
          style={{
            borderTop: "1px solid gray",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            margin: 0,
            padding: 0,
          }}
        >
          <p style={{ padding: 0, margin: 0, fontWeight: "bold" }}>ລວມ</p>
          <p style={{ padding: 0, margin: 0, fontWeight: "bold" }}>
            {formatNumber(sumTotalPrice || 0)} ກີບ
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            margin: 0,
            padding: 0,
            fontWeight: "bold",
          }}
        >
          <p style={{ padding: 0, margin: 0, fontWeight: "bold" }}>
            ສ່ວນຫຼຸດ(
            {typeDiscount === "AMOUNT"
              ? "ເປັນຈຳນວນເງິນ"
              : typeDiscount === "PERCENT"
              ? discount + "%"
              : typeDiscount}
            )
          </p>

          <p style={{ padding: 0, margin: 0, fontWeight: "bold" }}>
            {formatNumber(
              typeDiscount === "PERCENT"
                ? sumTotalPrice * (discount / 100)
                : discount
            )}{" "}
            ກີບ
          </p>
        </div>

        <div
          style={{
            borderTop: "0.1px solid gray",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            margin: 0,
            padding: 0,
            fontWeight: "bold",
          }}
        >
          <p style={{ padding: 0, margin: 0 }}>ຊຳລະຕົວຈິງກີບ</p>
          <p style={{ padding: 0, margin: 0, fontWeight: 900 }}>
            {formatNumber(totalFinal?.lak || 0)} ກີບ
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            margin: 0,
            padding: 0,
          }}
        >
          <p style={{ padding: 0, margin: 0 }}>ຈ່າຍບາດ</p>
          <p style={{ padding: 0, margin: 0, fontWeight: 900 }}>
            {formatNumber(totalFinal?.bath || 0)} ບາດ
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            margin: 0,
            padding: 0,
          }}
        >
          <div style={{ padding: 0, margin: 0 }}>ຈ່າຍໂດລາ</div>
          <div style={{ padding: 0, margin: 0, fontWeight: 900 }}>
            {formatNumber(totalFinal?.usd || 0)} ໂດລາ
          </div>
        </div>

        <div
          style={{
            borderTop: "0.1px solid gray",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            margin: 0,
            padding: 0,
            fontWeight: "bold",
          }}
        >
          <p style={{ padding: 0, margin: 0 }}>ເງິນທອນ</p>
          <p style={{ padding: 0, margin: 0, fontWeight: 900 }}>
            {formatNumber(changeAmount || 0)} ກີບ
          </p>
        </div>



        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontSize: 13,
            margin: 0,
            padding: 0,
          }}
        >
          <div style={{ padding: 0, margin: 0 }}>
            1 BATH = {formatNumber(exchange?.bath || 0)}
          </div>
          <div style={{ padding: 0, margin: 0 }}>
            1 USD = {formatNumber(exchange?.usd || 0)}
          </div>
        </div>

        <p
          style={{
            padding: 0,
            margin: 0,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ຂໍຂອບໃຈ
        </p>
      </div>
    );
  }
}

export default PosPayement;
