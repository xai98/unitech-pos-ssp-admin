import React, { memo, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component"; // เพิ่ม dependency นี้
import "react-lazy-load-image-component/src/effects/blur.css"; // เพิ่ม effect ถ้าต้องการ
import styled from "styled-components";
import { consts } from "../../../utils";
import { StockCenter } from "../../../types/stockCenter";

// Styled Components
const InfoContainer = styled.div`
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
`;

const ProductImage = styled(LazyLoadImage)`
  border-radius: 8px;
  border: 1px solid #e8ecef;
  object-fit: cover;
  margin-bottom: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 1fr) 2fr;
  gap: 12px;
  font-size: 14px;
`;

const Label = styled.div`
  font-weight: 600;
  color: #595959;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const Value = styled.div`
  color: #1a1a1a;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  word-break: break-word;
`;

interface Props {
  stockCenter: StockCenter | Record<string, any>;
}

const StockCenterInfo: React.FC<Props> = ({ stockCenter }) => {
  // Memoized formatNumber function
  const formatNumber = useMemo(
    () => (num?: number) => num?.toLocaleString("th-TH") || "0",
    []
  );

  // Memoized image URL
  const imageUrl = useMemo(
    () =>
      stockCenter?.productId?.image
        ? `${consts.URL_PHOTO_AW3}${stockCenter.productId.image}`
        : "/logoMinipos.jpg",
    [stockCenter?.productId?.image]
  );

  // Memoized data object to avoid re-computation
  const displayData = useMemo(
    () => ({
      productName: stockCenter?.productName || "N/A",
      categoryName: stockCenter?.categoryId?.categoryName || "N/A",
      productBarcode: stockCenter?.productBarcode || "N/A",
      amount: formatNumber(stockCenter?.amount),
      minStock: formatNumber(stockCenter?.minStock),
      maxStock: formatNumber(stockCenter?.maxStock),
      details: stockCenter?.details || "N/A",
    }),
    [
      stockCenter?.productName,
      stockCenter?.categoryId?.categoryName,
      stockCenter?.productBarcode,
      stockCenter?.amount,
      stockCenter?.minStock,
      stockCenter?.maxStock,
      stockCenter?.details,
      formatNumber,
    ]
  );

  return (
    <InfoContainer>
      <ProductImage
        src={imageUrl}
        alt={displayData.productName}
        width={100}
        height={100}
        placeholder={<div style={{ width: 100, height: 100, background: "#f0f0f0" }} />}
        effect="blur" // Optional: เพิ่ม effect ขณะโหลด
      />

      <InfoGrid>
        <Label>ຊື່ສິນຄ້າ</Label>
        <Value>{displayData.productName}</Value>

        <Label>ປະເພດສິນຄ້າ</Label>
        <Value>{displayData.categoryName}</Value>

        <Label>ບາໂຄດ</Label>
        <Value>{displayData.productBarcode}</Value>

        <Label>ຈຳນວນຍັງເຫຼືອ</Label>
        <Value>{displayData.amount}</Value>

        <Label>ຈຳນວນຕ່ຳສຸດ</Label>
        <Value>{displayData.minStock}</Value>

        <Label>ຈຳນວນສູງສຸດ</Label>
        <Value>{displayData.maxStock}</Value>

        <Label>ລາຍລະອຽດ</Label>
        <Value>{displayData.details}</Value>
      </InfoGrid>
    </InfoContainer>
  );
};

// Export with memo to prevent unnecessary re-renders
export default memo(StockCenterInfo, (prevProps, nextProps) => {
  // Custom comparison to deeply check stockCenter object
  return (
    prevProps.stockCenter === nextProps.stockCenter ||
    JSON.stringify(prevProps.stockCenter) === JSON.stringify(nextProps.stockCenter)
  );
});