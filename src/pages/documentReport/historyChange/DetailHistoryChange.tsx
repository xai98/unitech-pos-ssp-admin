import { Card, Col, Row, Modal, Space, Typography, Flex } from "antd";
import React from "react";
import { converTypePay, formatNumber } from "../../../utils/helper";
import styled from "styled-components";
import moment from "moment";

const { Text, Title } = Typography;

const formatDate = (date: Date | string): string => {
  return moment(date).format("DD-MM-YYYY HH:mm");
};

// Styled Components
const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
`;

const InfoCard = styled(Card)`
  background: #fafafa;
  border-radius: 8px;
  .ant-card-body {
    padding: 16px;
  }
`;

const ItemCard = styled(Card)`
  border-radius: 8px;
  .ant-card-head {
    background: #f5f5f5;
    border-bottom: none;
  }
  .ant-card-body {
    padding: 16px;
  }
`;

interface OrderItem {
  productId: string;
  productName: string;
  price_sale: number;
  order_qty: number;
  order_total_price: number;
}

interface OrderData {
  order_no: string;
  branchId?: { branchName: string };
  createdBy: string;
  createdAt?: string;
  typePay: string;
  amountAddOnNewOrder: number;
  cash_lak: number;
  transfer_lak: number;
  send_back_customer: number;
  oldItem: OrderItem[];
  changeItem: OrderItem[];
  newChangeItem: OrderItem[];
  totalOldOrder: number;
  toalChangeOrder: number; // Note: typo in original (should be totalChangeOrder?)
  totalNewOrder: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: OrderData | null;
}

const DetailHistoryChange: React.FC<Props> = ({ open, onClose, data }) => {
  const renderItems = (items: OrderItem[] = []) => (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {items.map((item, index) => (
        <Space 
          key={item.productId} 
          direction="vertical" 
          size={4}
          style={{ 
            paddingBottom: 12,
            width: "100%"
          }}
        >
          <Text strong>{`${index + 1}. ${item.productName}`}</Text>
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Text type="secondary">
              {`${formatNumber(item.price_sale)} × ${item.order_qty}`}
            </Text>
            <Text>{`${formatNumber(item.order_total_price)} ກີບ`}</Text>
          </Flex>
        </Space>
      ))}
    </Space>
  );

  return (
    <StyledModal
      title={<Title level={4}>{`ລາຍລະອຽດບິນ: ${data?.order_no || "-"}`}</Title>}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      centered
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <InfoCard>
              <DescriptionItem 
                label="ສາຂາ" 
                value={data?.branchId?.branchName || "-"} 
              />
              <DescriptionItem 
                label="ພະນັກງານ" 
                value={data?.createdBy || "-"} 
              />
            </InfoCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <InfoCard>
              <DescriptionItem 
                label="ເລກບິນ" 
                value={data?.order_no || "-"} 
              />
              <DescriptionItem 
                label="ວັນທີປ່ຽນ" 
                value={data?.createdAt ? formatDate(data.createdAt) : "-"} 
              />
            </InfoCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <InfoCard>
              <DescriptionItem 
                label="ປະເພດຊຳລະ" 
                value={converTypePay(data?.typePay || "")} 
              />
              <DescriptionItem 
                label="ຊຳລະຕົວຈິງ" 
                value={`${formatNumber(data?.amountAddOnNewOrder || 0)} ກີບ`}
                highlight
              />
            </InfoCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <InfoCard>
              <DescriptionItem 
                label="ຮັບສົດກີບ" 
                value={`${formatNumber(data?.cash_lak || 0)} ກີບ`} 
              />
              <DescriptionItem 
                label="ຮັບໂອນກີບ" 
                value={`${formatNumber(data?.transfer_lak || 0)} ກີບ`} 
              />
              <DescriptionItem 
                label="ເງິນທອນ" 
                value={`${formatNumber(data?.send_back_customer || 0)} ກີບ`}
              />
            </InfoCard>
          </Col>
        </Row>

        {/* Item Details */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <ItemCard title="ລາຍການສັ່ງຊື້ກ່ອນປ່ຽນ">
              {renderItems(data?.oldItem)}
              <SummaryItem 
                label="ລວມເງິນ" 
                value={formatNumber(data?.totalOldOrder || 0)}
              />
            </ItemCard>
          </Col>
          <Col xs={24} md={8}>
            <ItemCard title="ລາຍການຖືກປ່ຽນ">
              {renderItems(data?.changeItem)}
              <SummaryItem 
                label="ລວມເງິນ" 
                value={formatNumber(data?.toalChangeOrder || 0)}
              />
            </ItemCard>
          </Col>
          <Col xs={24} md={8}>
            <ItemCard title="ລາຍການປ່ຽນໃໝ່">
              {renderItems(data?.newChangeItem)}
              <SummaryItem 
                label="ລວມເງິນ" 
                value={formatNumber(data?.totalNewOrder || 0)}
              />
            </ItemCard>
          </Col>
        </Row>
      </Space>
    </StyledModal>
  );
};

// Reusable Components
const DescriptionItem: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight = false }) => (
  <Space 
    style={{ 
      width: "100%", 
      justifyContent: "space-between", 
      marginBottom: 12 
    }}
  >
    <Text type="secondary">{label}:</Text>
    <Text strong style={{ color: highlight ? "#2E93fA" : undefined }}>
      {value}
    </Text>
  </Space>
);

const SummaryItem: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
}> = ({ label, value, unit = "ກີບ" }) => (
  <Space 
    style={{ 
      width: "100%", 
      justifyContent: "space-between", 
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid #f0f0f0"
    }}
  >
    <Text strong>{label}</Text>
    <Text strong>{`${value} ${unit}`}</Text>
  </Space>
);

export default DetailHistoryChange;