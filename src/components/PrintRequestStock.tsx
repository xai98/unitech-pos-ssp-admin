import React from "react";
import { formatDate, formatNumber } from "../utils/helper";
import { Flex } from "antd";
import { CellTd, CellTh } from "./stylesComponent/otherComponent";

interface BillProps {
  data: any;
}

export class PrintRequestStock extends React.Component<BillProps> {
  render() {
    const { data } = this.props;
    return (
      <div style={{ fontFamily: "Phetsarath OT", padding: 40 }}>
        <h2>ສາຂາ: {data?.branchId?.branchName}</h2>

        <Flex justify="space-between">
          <div>
            <h4 style={{ margin: 0 }}>ຊື່ຜູ້ສັ່ງ: {data?.requestBy}</h4>
            <h4 style={{ margin: 0 }}>
              ວັນທີສັ່ງ: {formatDate(data?.createdAt)}
            </h4>
          </div>
          {/* <div>
            <h4 style={{ margin: 0 }}>
              ຊື່ຜູ້ຮັບຄຳຮອງ: {data?.approvedBy || "-"}
            </h4>
            <h4 style={{ margin: 0 }}>
              ວັນທີຮັບຄຳຮ້ອງ:{" "}
              {data?.dateApproved ? formatDate(data?.dateApproved) : "-"}
            </h4>
          </div> */}
        </Flex>


        <h2>ລາຍການສັ່ງ</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              zIndex: 1,
            }}
          >
            <tr>
              <CellTh style={{ width: "5%" }}>ລດ</CellTh>
              <CellTh style={{ textAlign: "left" }}>ຊື່ສິນຄ້າ</CellTh>
              <CellTh style={{ textAlign: "center" }}>ລາຄາ</CellTh>
              <CellTh style={{ textAlign: "center", width: "10%" }}>
                ຈຳນວນສັ່ງ
              </CellTh>
              <CellTh style={{ textAlign: "center", width: "10%" }}>
                ຈຳນວນຕົວຈິງ
              </CellTh>
              <CellTh style={{ textAlign: "center" }}>ໝາຍເຫດ</CellTh>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((item: any, index: number) => (
              <tr key={index}>
                <CellTd>{index + 1}</CellTd>
                <CellTd style={{ textAlign: "left" }}>
                  {item?.productName}
                </CellTd>
                <CellTd>{formatNumber(item?.productId?.price_sale || 0)}</CellTd>
                <CellTd>{formatNumber(item?.amountRequest || 0)}</CellTd>
                <CellTd></CellTd>
                <CellTd>{item?.note || "-"}</CellTd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
