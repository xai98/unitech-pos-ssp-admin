import React, { memo } from "react";
import { StockCenter } from "../../../types/stockCenter";
import { StockBox } from "../../../types/stockBoxTypes";
import { formatDate } from "../../../utils/helper";
import styled from "styled-components";

// Styled Components
const PrintContainer = styled.div`
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
`;

const Header = styled.div`
  margin-bottom: 10px;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
`;

const ShopName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Barcode = styled.img`
  width: 180px;
  height: 70px;
  margin: 10px 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

interface StockBoxPrintProps {
  stockCenter: StockCenter | null;
  selectStockBox: StockBox | null;
}

const StockBoxPrint: React.FC<StockBoxPrintProps> = ({ stockCenter, selectStockBox }) => {
  // ฟังก์ชันฟอร์แมตตัวเลข
  const formatNumber = (num?: number) => num?.toLocaleString("th-TH") || "0";

  return (
    <PrintContainer>
      {/* ส่วนหัว (โลโก้และชื่อร้าน) */}
      <Header>
        <Logo src="/logoMinipos.jpg" alt="Logo" />
        <ShopName>ຮ້ານມິນິມາກ ສວນເສືອປ່າ</ShopName>
      </Header>

      {/* ชื่อสินค้า */}
      <ProductName>{stockCenter?.productName || "ບໍ່ລະບຸສິນຄ້າ"}</ProductName>

      {/* บาร์โค้ด */}
      <Barcode
        alt="Barcode"
        src={`https://barcode.tec-it.com/barcode.ashx?data=${selectStockBox?.boxNo || "N/A"}`}
      />

      {/* ข้อมูลจำนวน */}
      <InfoRow>
        <span>ຈຳນວນເຄື່ອງ:</span>
        <span>{formatNumber(selectStockBox?.amount)}</span>
      </InfoRow>

      {/* ข้อมูลเพิ่มเติม (ถ้ามี) */}
      {selectStockBox?.amountLimit && (
        <InfoRow>
          <span>ຈຳນວນສູງສຸດ:</span>
          <span>{formatNumber(selectStockBox.amountLimit)}</span>
        </InfoRow>
      )}

      <InfoRow>
        <span>ວັນທີສ້າງ:</span>
        <span>{selectStockBox?.createdAt ? formatDate(selectStockBox.createdAt) : "-"}</span>
      </InfoRow>

      <InfoRow>
        <span>ຜູ້ສ້າງ:</span>
        <span>{selectStockBox?.createdBy || "-"}</span>
      </InfoRow>
    </PrintContainer>
  );
};

// Export default และเพิ่ม memo เพื่อ performance
export default memo(StockBoxPrint);