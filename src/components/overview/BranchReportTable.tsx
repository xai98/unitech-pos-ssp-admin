import { Card, Col, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./BranchReportTable.css"; // Create this CSS file separately
import { formatNumber } from "../../utils/helper";

interface BranchReportData {
  key: string;
  index: number;
  branchName: string;
  totalOrders: number;
  totalPrice: number;
  totalActualCashLak: number;
  totalCashLak: number;
  totalTransferLak: number;
  totalCashBath: number;
  totalTransferBath: number;
  totalDiscount: number;
  totalSendBack: number;
  totalOriginPrice: number;
  totalCommission: number;
  totalProfit: number;
}

interface BranchReportTableProps {
  reportBranch: any[];
}

export const BranchReportTable = ({ reportBranch }: BranchReportTableProps) => {
  const safeFormatNumber = (value: string | number): string => {
    const numericValue = typeof value === "string" ? parseFloat(value) || 0 : value;
    return formatNumber(numericValue || 0);
  };

  const renderNumber = (value: number | string) => safeFormatNumber(value);

  const branchReportColumns: ColumnsType<BranchReportData> = [
    { title: "#", dataIndex: "index", width: 50 },
    { title: "ຊື່ສາຂາ", dataIndex: "branchName" },
    { title: "ອໍເດີ້ທັງໝົດ", dataIndex: "totalOrders", render: renderNumber },
    { title: "ຍອດຂາຍທັງໝົດ", dataIndex: "totalPrice", render: renderNumber },
    { title: "ຮັບເງິນສົດຕົວຈິງ", dataIndex: "totalActualCashLak", render: renderNumber },
    { title: "ຍອດເງິນສົດກີບ", dataIndex: "totalCashLak", render: renderNumber },
    { title: "ຍອດເງິນໂອນກີບ", dataIndex: "totalTransferLak", render: renderNumber },
    { title: "ຍອດເງິນສົດບາດ", dataIndex: "totalCashBath", render: renderNumber },
    { title: "ຍອດເງິນໂອນບາດ", dataIndex: "totalTransferBath", render: renderNumber },
    { title: "ເງິນສ່ວນຫລຸດ", dataIndex: "totalDiscount", render: renderNumber },
    { title: "ເງິນທອນ", dataIndex: "totalSendBack", render: renderNumber },
    { title: "ຕົ້ນທຶນ", dataIndex: "totalOriginPrice", render: renderNumber },
    { title: "ຄ່າຄອມມິດຊັ່ນ", dataIndex: "totalCommission", render: renderNumber },
    { title: "ກຳໄລ", dataIndex: "totalProfit", render: renderNumber },
  ];

  // Calculate totals
  const totals = reportBranch?.reduce(
    (acc, item) => ({
      totalOrders: acc.totalOrders + (item.totalOrders || 0),
      totalPrice: acc.totalPrice + (item.totalPrice || 0),
      totalActualCashLak: acc.totalActualCashLak + (item.totalActualCashLak || 0),
      totalCashLak: acc.totalCashLak + (item.totalCashLak || 0),
      totalTransferLak: acc.totalTransferLak + (item.totalTransferLak || 0),
      totalCashBath: acc.totalCashBath + (item.totalCashBath || 0),
      totalTransferBath: acc.totalTransferBath + (item.totalTransferBath || 0),
      totalDiscount: acc.totalDiscount + (item.totalDiscount || 0),
      totalSendBack: acc.totalSendBack + (item.totalSendBack || 0),
      totalOriginPrice: acc.totalOriginPrice + (item.totalOriginPrice || 0),
      totalCommission: acc.totalCommission + (item.totalCommission || 0),
      totalProfit: acc.totalProfit + (item.totalProfit || 0),
    }),
    {
      totalOrders: 0,
      totalPrice: 0,
      totalActualCashLak: 0,
      totalCashLak: 0,
      totalTransferLak: 0,
      totalCashBath: 0,
      totalTransferBath: 0,
      totalDiscount: 0,
      totalSendBack: 0,
      totalOriginPrice: 0,
      totalCommission: 0,
      totalProfit: 0,
    }
  ) || {};

  const dataSource: BranchReportData[] = reportBranch?.map((item: any, index: number) => ({
    key: index.toString(),
    index: index + 1,
    branchName: item.branchName,
    totalOrders: item.totalOrders || 0,
    totalPrice: item.totalPrice || 0,
    totalActualCashLak: item.totalActualCashLak || 0,
    totalCashLak: item.totalCashLak || 0,
    totalTransferLak: item.totalTransferLak || 0,
    totalCashBath: item.totalCashBath || 0,
    totalTransferBath: item.totalTransferBath || 0,
    totalDiscount: item.totalDiscount || 0,
    totalSendBack: item.totalSendBack || 0,
    totalOriginPrice: item.totalOriginPrice || 0,
    totalCommission: item.totalCommission || 0,
    totalProfit: item.totalProfit || 0,
  })) || [];

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24}>
        <Card title="ລາຍງານຍອດເງິນ">
          <Table
            className="branch-report-table"
            columns={branchReportColumns}
            dataSource={dataSource}
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>ລວມທັງໝົດ</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{safeFormatNumber(totals.totalOrders)}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{safeFormatNumber(totals.totalPrice)}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{safeFormatNumber(totals.totalActualCashLak)}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{safeFormatNumber(totals.totalCashLak)}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{safeFormatNumber(totals.totalTransferLak)}</Table.Summary.Cell>
                <Table.Summary.Cell index={7}>{safeFormatNumber(totals.totalCashBath)}</Table.Summary.Cell>
                <Table.Summary.Cell index={8}>{safeFormatNumber(totals.totalTransferBath)}</Table.Summary.Cell>
                <Table.Summary.Cell index={9}>{safeFormatNumber(totals.totalDiscount)}</Table.Summary.Cell>
                <Table.Summary.Cell index={10}>{safeFormatNumber(totals.totalSendBack)}</Table.Summary.Cell>
                <Table.Summary.Cell index={11}>{safeFormatNumber(totals.totalOriginPrice)}</Table.Summary.Cell>
                <Table.Summary.Cell index={12}>{safeFormatNumber(totals.totalCommission)}</Table.Summary.Cell>
                <Table.Summary.Cell index={13}>{safeFormatNumber(totals.totalProfit)}</Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};