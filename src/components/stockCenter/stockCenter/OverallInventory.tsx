import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Statistic } from "antd";
import styled from "styled-components";
import { BsUpcScan } from "react-icons/bs";
import routes from "../../../utils/routes";
import { SummaryProps } from "../../../types/stockCenter";

// Styled Components
const CardWrapper = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e8ecef;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f5ff;
  }
`;

const ActionButton = styled(Button)`
  height: 48px;
  font-size: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fa8c16;
  border-color: #fa8c16;
  color: white;

  &:hover, &:focus {
    background: #ff9c33 !important;
    border-color: #ff9c33 !important;
    color: white !important;
  }
`;

const OverallInventory: React.FC<SummaryProps>= ({
  totalStockLows,
  totalOverStock,
  totalStockNearLows,
  totalItems,
}) => {
  const navigate = useNavigate();

  const handleExportStockBox = () => {
    navigate(routes.EXPORT_STOCK_BOX_PAGE);
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>ພາບລວມສິນຄ້າໃນສະຕ໋ອກ</CardTitle>
      </CardHeader>
      
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <StatItem>
                <Statistic
                  title="ສິນຄ້າໃນສະຕ໋ອກ"
                  value={totalItems}
                  valueStyle={{ color: "#1890ff", fontSize: 24, fontWeight: 500 }}
                  suffix="ລາຍການ"
                />
              </StatItem>
            </Col>
            <Col xs={24} sm={6}>
              <StatItem>
                <Statistic
                  title="ສິນຄ້າຢູ່ໃນເກນ"
                  value={totalOverStock}
                  valueStyle={{ color: "orange", fontSize: 24, fontWeight: 500 }}
                  suffix="ລາຍການ"
                />
              </StatItem>
            </Col>
            <Col xs={24} sm={6}>
              <StatItem>
                <Statistic
                  title="ໃກ້ຫຼຸດສະຕ໋ອກ"
                  value={totalStockNearLows}
                  valueStyle={{ color: "#52c41a", fontSize: 24, fontWeight: 500 }}
                  suffix="ລາຍການ"
                />
              </StatItem>
            </Col>
            <Col xs={24} sm={6}>
              <StatItem>
                <Statistic
                  title="ສິນຄ້າຫຼຸດສະຕ໋ອກ"
                  value={totalStockLows}
                  valueStyle={{ color: "#f5222d", fontSize: 24, fontWeight: 500 }}
                  suffix="ລາຍການ"
                />
              </StatItem>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={6}>
          <ActionButton
            size="large"
            icon={<BsUpcScan style={{ fontSize: 18 }} />}
            onClick={handleExportStockBox}
            block
          >
            ຍິງເຄື່ອງອອກ
          </ActionButton>
        </Col>
      </Row>
    </CardWrapper>
  );
};

export default OverallInventory;