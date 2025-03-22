import React from "react";
import { StockBox } from "../../../types/stockBoxTypes";
import { formatDate } from "../../../utils/helper";

interface StockBoxExportPrintProps {
  stockBox: StockBox | null;
}

export class StockBoxExportPrint extends React.Component<StockBoxExportPrintProps> {
  render() {
    const { stockBox } = this.props;

    // ฟังก์ชันฟอร์แมตตัวเลข
    const formatNumber = (num?: number) => num?.toLocaleString("th-TH") || "0";

    // สไตล์หลักสำหรับใบปริ้น
    const printStyles: React.CSSProperties = {
      fontFamily: "Phetsarath OT, sans-serif",
      padding: "15px",
      border: "1px solid #000",
      textAlign: "center",
      fontSize: "14px",
      lineHeight: "1.5",
      margin:'10px',
    };

    const headerStyles: React.CSSProperties = {
      marginBottom: "10px",
    };

    const barcodeStyles: React.CSSProperties = {
      margin: "10px 0",
    };

    const infoStyles: React.CSSProperties = {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "5px",
    };

    return (
      <div style={printStyles}>
        {/* ส่วนหัว (โลโก้และชื่อร้าน) */}
        <div style={headerStyles}>
          <img
            src="/logoMinipos.jpg"
            alt="Logo"
            style={{ width: "60px", height: "60px" }}
          />
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            ຮ້ານມິນິມາກ ສວນເສືອປ່າ
          </div>
        </div>

        {/* ชื่อสินค้า */}
        <div
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}
        >
          {stockBox?.stockCenterId?.productName || "ไม่ระบุสินค้า"}
        </div>

        {/* บาร์โค้ด */}
        <div style={barcodeStyles}>
          <img
            alt="Barcode"
            src={`https://barcode.tec-it.com/barcode.ashx?data=${
              stockBox?.boxNo || "N/A"
            }`}
            style={{ width: "180px", height: "70px" }}
          />
      
        </div>

             {/* ข้อมูลจำนวน */}
        <div style={infoStyles}>
          <span>ຊື່ສາຂາ:</span>
          <span>{stockBox?.branchId?.branchName}</span>
        </div>

        {/* ข้อมูลจำนวน */}
        <div style={infoStyles}>
          <span>ຈຳນວນເຄື່ອງ:</span>
          <span>{formatNumber(stockBox?.amount)}</span>
        </div>

        {/* ข้อมูลเพิ่มเติม (ถ้ามี) */}
        {stockBox?.amountLimit && (
          <div style={infoStyles}>
            <span>ຈຳນວນສູງສຸດ:</span>
            <span>{formatNumber(stockBox.amountLimit)}</span>
          </div>
        )}

         {/* ข้อมูลจำนวน */}
         <div style={infoStyles}>
          <span>ວັນທີອອກ:</span>
          <span>{stockBox?.exportDate ? formatDate(stockBox?.exportDate) : '-'}</span>
        </div>

        <div style={infoStyles}>
          <span>ຜູ້ນຳອອກ:</span>
          <span>{stockBox?.exportBy}</span>
        </div>

      </div>
    );
  }
}
