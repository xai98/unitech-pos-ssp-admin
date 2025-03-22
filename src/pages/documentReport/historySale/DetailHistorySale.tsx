import { Card, Col, Divider, Modal, Row, Space, Typography } from "antd";
import React, { useMemo } from "react";
import { converTypePay, formatNumber } from "../../../utils/helper";
import moment from "moment";
import styled from "styled-components";

const { Title, Text } = Typography;

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

const ItemsCard = styled(Card)`
  border-radius: 8px;
  .ant-card-head {
    background: #f5f5f5;
  }
`;

const SummaryCard = styled(Card)`
  border-radius: 8px;
  .ant-card-body {
    padding: 16px;
  }
`;

const formatDate = (date: string): string => {
  return moment(date).format("DD-MM-YYYY HH:mm");
};

interface OrderItem {
  productId: string;
  productName: string;
  price_sale: number;
  order_qty: number;
  order_total_price: number;
}

interface ExchangeRate {
  bath: number;
  usd: number;
}

interface OrderData {
  order_no: string;
  branchId?: { branchName: string };
  createdBy: string;
  createdAt: string;
  typePay: string;
  final_receipt_total: number;
  order_items: OrderItem[];
  totalOldOrder: number;
  total_price: number;
  typeDiscount?: "AMOUNT" | "PERCENT";
  discount: number;
  cash_lak: number;
  cash_bath: number;
  cash_usd: number;
  transfer_lak: number;
  transfer_bath: number;
  transfer_usd: number;
  exchangeRate: ExchangeRate;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: OrderData | null;
}

const DetailHistorySale: React.FC<Props> = ({ open, onClose, data }) => {
  const orderItems = useMemo(() => 
    data?.order_items?.map((item, index) => (
      <Space 
        key={item.productId} 
        direction="vertical" 
        size={4}
        style={{ 
          padding: "12px 0", 
          borderBottom: "1px solid #f0f0f0",
          width: "100%"
        }}
      >
        <Text strong>{`${index + 1}. ${item.productName}`}</Text>
        <Space>
          <Text type="secondary">{`${formatNumber(item.price_sale)} × ${item.order_qty}`}</Text>
          <Text strong>{`= ${formatNumber(item.order_total_price)} ກີບ`}</Text>
        </Space>
      </Space>
    )) || [],
    [data?.order_items]
  );

  const discountValue = useMemo(() => {
    if (!data) return 0;
    return data.typeDiscount === "PERCENT"
      ? data.total_price * (data.discount / 100)
      : data.discount || 0;
  }, [data]);

  const discountText = useMemo(() => {
    if (!data?.typeDiscount) return "-";
    return data.typeDiscount === "AMOUNT" 
      ? "ເປັນຈຳນວນເງິນ" 
      : `${data.discount}%`;
  }, [data]);

  return (
    <StyledModal
      title={<Title level={4}>{`ລາຍລະອຽດບິນ: ${data?.order_no || "-"}`}</Title>}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      centered
    >
      <Row gutter={[16, 16]}>
        {/* Summary Cards */}
        <Col xs={24} md={8}>
          <InfoCard>
            <DescriptionItem title="ສາຂາ" content={data?.branchId?.branchName || "-"} />
            <DescriptionItem title="ພະນັກງານ" content={data?.createdBy || "-"} />
            <DescriptionItem title="ວັນທີຂາຍ" content={data?.createdAt ? formatDate(data.createdAt) : "-"} />
          </InfoCard>
        </Col>
        <Col xs={24} md={8}>
          <InfoCard>
            <DescriptionItem title="ເລກບິນ" content={data?.order_no || "-"} />
            <DescriptionItem title="ປະເພດຊຳລະ" content={converTypePay(data?.typePay ?? "")} />
          </InfoCard>
        </Col>
        <Col xs={24} md={8}>
          <InfoCard>
            <DescriptionItem 
              title="ຊຳລະຕົວຈິງ" 
              content={`${formatNumber(data?.final_receipt_total || 0)} ກີບ`}
              highlight
            />
          </InfoCard>
        </Col>

        {/* Order Items */}
        <Col span={24}>
          <ItemsCard title="ລາຍການສິນຄ້າ">
            <Space direction="vertical" style={{ width: "100%" }}>
              {orderItems}
              <Divider style={{ margin: "12px 0" }} />
              <SummaryItem 
                label="ລວມເງິນ" 
                value={formatNumber(data?.totalOldOrder || 0)} 
              />
            </Space>
          </ItemsCard>
        </Col>

        {/* Payment Summary */}
        <Col span={24}>
          <SummaryCard>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <div>
                <Text strong>ສະຫຼຸບຍອດ</Text>
                <Divider style={{ margin: "8px 0" }} />
                <SummaryItem label="ລວມ" value={formatNumber(data?.total_price || 0)} />
                <SummaryItem 
                  label={`ສ່ວນຫຼຸດ (${discountText})`}
                  value={formatNumber(discountValue)}
                />
                <SummaryItem 
                  label="ຊຳລະຕົວຈິງ" 
                  value={formatNumber(data?.final_receipt_total || 0)} 
                  size={16}
                  highlight
                />
              </div>

              <div>
                <Text strong>ຊຳລະເງິນສົດ</Text>
                <Divider style={{ margin: "8px 0" }} />
                <SummaryItem label="ກີບ" value={formatNumber(data?.cash_lak || 0)} />
                <SummaryItem label="ບາດ" value={formatNumber(data?.cash_bath || 0)} unit="bath" />
                <SummaryItem label="ໂດລາ" value={formatNumber(data?.cash_usd || 0)} unit="usd" />
              </div>

              <div>
                <Text strong>ຊຳລະເງິນໂອນ</Text>
                <Divider style={{ margin: "8px 0" }} />
                <SummaryItem label="ກີບ" value={formatNumber(data?.transfer_lak || 0)} />
                <SummaryItem label="ບາດ" value={formatNumber(data?.transfer_bath || 0)} unit="bath" />
                <SummaryItem label="ໂດລາ" value={formatNumber(data?.transfer_usd || 0)} unit="usd" />
              </div>

              <div>
                <Text strong>ອັດຕາແລກປ່ຽນ</Text>
                <Divider style={{ margin: "8px 0" }} />
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <SummaryItem 
                      label="1 ບາດ" 
                      value={formatNumber(data?.exchangeRate?.bath || 0)} 
                    />
                  </Col>
                  <Col span={12}>
                    <SummaryItem 
                      label="1 ໂດລາ" 
                      value={formatNumber(data?.exchangeRate?.usd || 0)} 
                    />
                  </Col>
                </Row>
              </div>
            </Space>
          </SummaryCard>
        </Col>
      </Row>
    </StyledModal>
  );
};

// Reusable Components
const DescriptionItem: React.FC<{ 
  title: string; 
  content: string; 
  highlight?: boolean 
}> = ({ title, content, highlight = false }) => (
  <Space 
    style={{ 
      width: "100%", 
      justifyContent: "space-between", 
      marginBottom: 12 
    }}
  >
    <Text type="secondary">{title}:</Text>
    <Text strong style={{ color: highlight ? "#2E93fA" : undefined }}>
      {content}
    </Text>
  </Space>
);

const SummaryItem: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  size?: number;
  highlight?: boolean;
}> = ({ label, value, unit = "ກີບ", size = 14, highlight = false }) => (
  <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
    <Text style={{ fontSize:size }}>{label}</Text>
    <Text 
      strong 
      style={{ 
        fontSize:size, 
        color: highlight ? "#2E93fA" : undefined 
      }}
    >
      {value} {unit}
    </Text>
  </Space>
);

export default DetailHistorySale;