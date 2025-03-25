import { Col, Row, Statistic } from "antd";
import { Flex } from "antd";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import routes from "../../utils/routes";
import { formatNumber } from "../../utils/helper";
import { StatCard } from "./styled";

interface StatsCardsProps {
  reportOrder: any;
  reportChange: any;
  totalChangeOrder: number | undefined;
  totalStockLow: number | undefined;
  summaryStockCenterData: any;
}

export const StatsCards = ({ reportOrder, reportChange, totalStockLow,totalChangeOrder,summaryStockCenterData }: StatsCardsProps) => {
  const navigate = useNavigate();
  const safeFormatNumber = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return formatNumber(numericValue);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <StatCard>
          <Statistic 
            title="ອໍເດີ້ທັງໝົດ" 
            value={reportOrder?.totalOrders || 0} 
            formatter={safeFormatNumber}
          />
          <Statistic 
            title="ອໍເດີ້ປ່ຽນເຄື່ອງ" 
            value={totalChangeOrder || 0} 
            formatter={safeFormatNumber}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard>
          <Statistic 
            title="ຍອດຂາຍທັງໝົດ" 
            value={(reportOrder?.totalPrice || 0) + (reportChange?.amountAddOnNewOrder || 0)} 
            formatter={safeFormatNumber}
          />
          <Statistic 
            title="ລວມຄ່າຄອມມິດຊັ່ນ" 
            value={reportOrder?.totalCommission || 0} 
            formatter={safeFormatNumber}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard>
          <Statistic 
            title="ມູນຄ່າຕົ້ນທຶນ" 
            value={(reportOrder?.totalOriginPrice || 0) + (reportChange?.totalOriginPriceNewItem || 0)} 
            formatter={safeFormatNumber}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard>
          <Statistic 
            title="ຄາດຄະເນກຳໄລ" 
            value={(reportOrder?.totalProfit || 0) + (reportChange?.totalProfit || 0)} 
            formatter={safeFormatNumber}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <StatCard style={{ position: 'relative' }}>
          <Statistic 
            title="ຈ/ນສິນຄ້າຂາຍໜ້າຮ້ານໃກ້ໝົດ" 
            value={totalStockLow || 0} 
            formatter={safeFormatNumber}
            style={{ marginBottom: 15 }}
          />
          <Flex 
            onClick={() => navigate(routes.STOCK_LOWS_PAGE)} 
            justify="space-around" 
            align="center" 
            className="textHover" 
            style={{
              backgroundColor: '#efefef',
              position: "absolute",
              left: '0%',
              bottom: '0%',
              width: "100%",
              cursor: "pointer",
              padding: 8
            }}
          >
            <div>ເບິ່ງລາຍລະອຽດ</div>
            <IoIosArrowRoundForward />
          </Flex>
        </StatCard>
      </Col>

      <Col xs={24} sm={12} md={4}>
        <StatCard style={{ position: 'relative' }}>
          <Statistic 
            title="ສະຕ໋ອກສາງໃຫ່ຍຢູ່ໃນເກນ" 
            value={summaryStockCenterData?.totalOverStock || 0} 
            formatter={safeFormatNumber}
            valueStyle={{ marginBottom: 15,color: 'green' }}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <StatCard style={{ position: 'relative' }}>
          <Statistic 
            title="ສະຕ໋ອກສາງໃຫ່ຍໃກ້ຫຼຸດສະຕ໋ອກ" 
            value={summaryStockCenterData?.totalStockNearLows || 0} 
            formatter={safeFormatNumber}
            valueStyle={{ marginBottom: 15,color: 'orange' }}
          />
        </StatCard>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <StatCard style={{ position: 'relative' }}>
          <Statistic 
            title="ສະຕ໋ອກສາງໃຫ່ຍຫຼຸດສະຕ໋ອກ" 
            value={summaryStockCenterData?.totalStockLows || 0} 
            formatter={safeFormatNumber}
            valueStyle={{ marginBottom: 15,color: 'red' }}
          />
        </StatCard>
      </Col>







    </Row>
  );
};