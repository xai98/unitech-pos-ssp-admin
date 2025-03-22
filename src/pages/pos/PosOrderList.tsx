import {
  Button,
  Col,
  Divider,
  Flex,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import * as _ from "lodash";
import ButtonAction from "../../components/ButtonAction";
import { formatNumber } from "../../utils/helper";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { calculatediscount } from "./component/calculateDiscount";
import useWindowSize from "./component/useWindowSize";

interface PosOrderList {
  newOrderList: any[];
  exchange: any;
  setNewOrderList: (newOrderList: any[]) => void;
  setIsPayments: (isPayments: boolean) => void;
  typeDiscount: string;
  setTypeDiscount: (typeDiscount: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  totalFinal: {
    lak: number;
    bath: number;
    usd: number;
  };
  setTotalFinal: (totalFinal: {
    lak: number;
    bath: number;
    usd: number;
  }) => void;
}

const PosOrderList: React.FC<PosOrderList> = ({
  newOrderList,
  setNewOrderList,
  setIsPayments,
  exchange,
  typeDiscount,
  setTypeDiscount,
  discount,
  setDiscount,
  totalFinal,
  setTotalFinal,
}) => {
  const {height: widowHeight = 0 } = useWindowSize();

  useEffect(() => {
    if (typeDiscount) {
      // คำนวณผลลัพธ์ของส่วนลด
      const result = calculatediscount(
        typeDiscount,
        discount,
        sumTotalPrice,
        exchange
      );
      // อัปเดตค่า totalFinal
      setTotalFinal(result);
    } else {
      setTotalFinal({
        lak: Math.round(sumTotalPrice),
        bath: Math.round(sumTotalPrice / (exchange?.bath || 1)),
        usd: Math.round(sumTotalPrice / (exchange?.usd || 1)),
      });
    }
  }, [newOrderList]);

  //ລຶບລາຍການ
  const removeOrder = (itemId: string) => {
    // Create a new list excluding the item with the specified itemId
    const updatedList = newOrderList.filter(
      (item) => item.productId !== itemId
    );
    // Update the state with the new list
    setNewOrderList(updatedList);
  };

  //ລວມຍອດເງິນ
  const sumTotalPrice =
    newOrderList &&
    newOrderList?.reduce((acc, item) => {
      return acc + (item.order_total_price || 0); // Assuming total_price is a number
    }, 0);

  //ຍົກເລິກອໍເດີທັງໝົດ
  const cancelOrderAll = () => {
    Modal.confirm({
      title: "ແຈ້ງເຕືອນ",
      content: (
        <div>
          <span style={{ fontSize: 16, color: "red" }}>
            ທ່ານຕ້ອງການຍົກເລິກລາຍການສັ່ງຊື້ທັງໝົດແທ້ ຫຼື ບໍ່ ?
          </span>
          <div style={{ height: 20 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນການຍົກເລິກ",
      cancelText: "ປິດອອກ",
      okType: "primary",
      onOk() {
        setNewOrderList([]);
        message.success("ຍົກເລິກອໍເດີ້ທັງໝົດສຳເລັດ");
      },
    });
  };

  const handleInputChangeOrderQty = (value: number | null, order: any) => {
    // ตรวจสอบว่าค่า value เป็น string หรือ null และแสดงข้อความเตือนตามเงื่อนไข
    if (typeof value === "string") {
      message.warning("ກະລຸນາປ້ອນສະເພາະຕົວເລກ");
      return;
    }

    if (value === null) {
      message.warning("ກະລຸນາປ້ອນຈຳນວນອໍເດີ້");
      return;
    }

    // อัปเดตสถานะด้วยค่าที่เป็นตัวเลขที่ถูกต้อง
    const updatedList = newOrderList?.map((item) => {
      if (item.productId === order?.productId) {
        return {
          ...item,
          order_qty: value,
          order_total_price: order?.price_sale * value || 1,
        };
      }
      return item;
    });

    setNewOrderList(updatedList);
  };

  const handleChangeDiscount = (value: number | null) => {
    // ตรวจสอบว่า value เป็น null หรือไม่
    if (value === null) {
      return;
    }

    // ตรวจสอบค่าของ value ตามประเภทของส่วนลด
    if (typeDiscount === "PERCENT" && value > 100) {
      setDiscount(value);
      setTotalFinal({ lak: 0, bath: 0, usd: 0 });
      return message.warning("ທ່ານປ້ອນສ່ວນຫລຸດກາຍ 100%");
    }
    if (typeDiscount === "AMOUNT" && value > sumTotalPrice) {
      setDiscount(value);
      setTotalFinal({ lak: 0, bath: 0, usd: 0 });
      return message.warning("ທ່ານປ້ອນສ່ວນຫຼຸດເກີນລາຄາສິນຄ້າ");
    }

    // อัปเดตค่า discount
    setDiscount(value);

    // คำนวณผลลัพธ์ของส่วนลด
    const result = calculatediscount(
      typeDiscount,
      value,
      sumTotalPrice,
      exchange
    );

    // อัปเดตค่า totalFinal
    setTotalFinal(result);
  };

  return (
    <div className="posOrderList">
        <Flex justify={"space-between"} align={"center"}>
          <div className="header">ລວມຍອດ</div>
          <div className="header" style={{ color: "#1976d2" }}>
            {formatNumber(sumTotalPrice)} ກີບ
          </div>
        </Flex>
        <Divider style={{ margin: 0 }} />

        <Row gutter={12}>
          <Col span={12}>
            <div style={{ lineHeight: "30px" }}>
              <div>ປະເພດສ່ວນຫຼຸດ</div>
              <Select
                showSearch={false}
                style={{
                  width: "100%",
                }}
                size="large"
                placeholder="ເລືອກປະເພດສ່ວນຫຼຸດ"
                optionFilterProp="label"
                options={[
                  {
                    value: "",
                    label: "ເລືອກປະເພດສ່ວນຫຼຸດ",
                  },
                  {
                    value: "PERCENT",
                    label: "ຫລຸດເປັນເປີເຊັນ %",
                  },
                  {
                    value: "AMOUNT",
                    label: "ເປັນຈຳນວນເງິນ",
                  },
                ]}
                onChange={(value) => setTypeDiscount(value)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ lineHeight: "30px" }}>
              <div>ປ້ອນສ່ວນຫລຸດ</div>
              <InputNumber
                size="large"
                autoComplete="off"
                placeholder="ປ້ອນສ່ວນຫລຸດ(ເປີເຊັນ ຫຼື ກີບ)"
                min={0}
                style={{ width: "100%" }}
                value={discount}
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                parser={(value) =>
                  value ? parseFloat(value.replace(/,/g, "")) : 0
                }
                disabled={!typeDiscount}
                onChange={(value) =>
                  handleChangeDiscount(value as number | null)
                }
              />
            </div>
          </Col>
        </Row>

        <div style={{ height: 10 }}></div>
        <Divider style={{ margin: 0 }} />
        <div style={{ fontSize: 18, fontWeight: "bold", color: "gray" }}>
          ຍອດຮັບຕົວຈິງ
        </div>
        <Flex
          justify={"space-between"}
          align={"center"}
          style={{ fontSize: 18 }}
        >
          <div>ກີບ: {formatNumber(totalFinal.lak)}</div>
          <div>ບາດ: {formatNumber(totalFinal.bath)}</div>
          <div>ໂດລາ: {formatNumber(totalFinal.usd)}</div>
        </Flex>

        <div style={{ height: 10 }}></div>
        <Divider style={{ margin: 0 }} />

        <div style={{ height: 10 }}></div>
        <ButtonAction
          size="large"
          label="ຊຳລະເງິນ"
          type="primary"
          onClick={() => setIsPayments(true)}
          htmlType="button"
          style={{
            backgroundColor:
              typeDiscount === "PERCENT" && discount > 100
                ? "red"
                : typeDiscount === "AMOUNT" && discount > sumTotalPrice
                ? "red"
                : _.isEmpty(newOrderList)
                ? "red"
                : "#1976d2",
            height: 50,
          }}
          disabled={
            (typeDiscount === "PERCENT" && discount > 100) ||
            (typeDiscount === "AMOUNT" && discount > sumTotalPrice) ||
            _.isEmpty(newOrderList)
          }
        />
  
      <div style={{ height: 10 }}></div>
      <div style={{ height: widowHeight > 900 ? '60vh' : "52vh", overflow: "scroll" }}>
        {newOrderList?.map((item, index) => (
          <div
            className="order-item"
            key={item?.productId}
            style={{
              backgroundColor: index === 0 ? "#f0f9ff" : "",
              padding: 10,
              borderBottom: "1px solid #eee",
            }}
          >
            <Flex
              justify={"space-between"}
              align={"center"}
              style={{ fontSize: 16 }}
            >
              <div>{item?.productName}</div>
              <Flex justify="end" align="center" gap={10}>
                {formatNumber(item.price_sale)} x{" "}
                <InputNumber
                  size="large"
                  autoComplete="off"
                  min={1}
                  value={item?.order_qty}
                  style={{
                    width: "25%",
                    padding: 0,
                    height: 30,
                    margin: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value ? parseFloat(value.replace(/(,*)/g, "")) : 0
                  }
                  // onChange={handleChangeDiscount}
                  onChange={(e) => handleInputChangeOrderQty(e, item)}
                />
              </Flex>
            </Flex>
            <div style={{ height: 5 }}></div>
            <Flex
              justify="space-between"
              align="center"
              gap={10}
              style={{ fontSize: 14, color: "gray" }}
            >
              <div>ລວມ: {formatNumber(item.order_total_price)} ກີບ</div>
              <Tooltip title="ລຶບລາຍການ">
                <Button
                  type="primary"
                  style={{ backgroundColor: "red" }}
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => removeOrder(item.productId)}
                />
              </Tooltip>
            </Flex>

            {/* <Divider style={{ margin: "5px 0px" }} /> */}
          </div>
        ))}
      </div>
      <div style={{ height: widowHeight > 900 ? 15 : 10 }}></div>

      <ButtonAction
        size="large"
        label="ຍົກເລິກອໍເດີ້ທັງໝົດ"
        type="primary"
        onClick={cancelOrderAll}
        htmlType="button"
        style={{ backgroundColor: "#FFC0CC",color:"black" }}
      />
    </div>
  );
};

export default PosOrderList;
