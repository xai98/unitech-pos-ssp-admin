import { Col, Row, Typography } from "antd";
import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const { Title } = Typography;

interface PopularReportProps {
  reportPopularList: Array<{
    productName: string;
    totalQuantitySold: number;
    totalSale: number;
  }>;
}

// Chart configuration แยกออกมาเพื่อลดการ re-render
const getChartOptions = (categories: string[], unit: string) => ({
  chart: {
    type: "bar" as const,
    height: 350,
    toolbar: { show: false },
    animations: { enabled: true, speed: 800 },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      borderRadiusApplication: "end" as const,
      horizontal: true,
      barHeight: "70%",
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toLocaleString()} ${unit}`,
    offsetX: -6,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
      fontWeight: 600,
    },
  },
  xaxis: { categories },
  colors: ["#2E93fA"],
  grid: {
    borderColor: "#f1f1f1",
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toLocaleString()} ${unit}`,
    },
  },
});

const PopularChart: React.FC<PopularReportProps> = ({ reportPopularList }) => {
  // คำนวณข้อมูลเพียงครั้งเดียวด้วย useMemo
  const chartData = useMemo(() => {
    if (!reportPopularList?.length) return { quantity: null, total: null };

    const sortedByTotal = [...reportPopularList].sort(
      (a, b) => b.totalSale - a.totalSale
    );

    return {
      quantity: {
        series: [{ name: "ຈຳນວນ", data: reportPopularList.map(item => item.totalQuantitySold) }],
        options: getChartOptions(
          reportPopularList.map(item => item.productName),
          "ອໍເດີ້"
        ),
      },
      total: {
        series: [{ name: "ຍອດລວມ", data: sortedByTotal.map(item => item.totalSale) }],
        options: getChartOptions(
          sortedByTotal.map(item => item.productName),
          "ກີບ"
        ),
      },
    };
  }, [reportPopularList]);

  if (!chartData.quantity || !chartData.total) {
    return <div>ຍັງບໍ່ມີຂໍ້ມູນລາຍການຂາຍປະຈຳວັນເທື່ອ</div>;
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 12,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '0 auto',
    }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={4} style={{ 
            color: '#2E93fA', 
            textAlign: 'center',
            marginBottom: 24,
          }}>
            ລາຍການອໍເດີ້ສູງສຸດ
          </Title>
          <ReactApexChart
            options={chartData.quantity.options}
            series={chartData.quantity.series}
            type="bar"
            height={Math.max(400, reportPopularList.length * 50)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={4} style={{ 
            color: '#2E93fA', 
            textAlign: 'center',
            marginBottom: 24,
          }}>
            ຍອດລວມສູງສຸດ
          </Title>
          <ReactApexChart
            options={chartData.total.options}
            series={chartData.total.series}
            type="bar"
            height={Math.max(400, reportPopularList.length * 50)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PopularChart;