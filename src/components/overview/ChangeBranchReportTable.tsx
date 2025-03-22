import { Card, Col, Row, Table } from "antd";
import { formatNumber } from "../../utils/helper";


import styled from "styled-components";

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;

interface ChangeBranchReportTableProps {
  reportChangeBranch: any[];
}

export const ChangeBranchReportTable = ({ reportChangeBranch }: ChangeBranchReportTableProps) => {
  const safeFormatNumber = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return formatNumber(numericValue);
  };

  const changeBranchReportColumns = [
    { title: "#", dataIndex: "index", width: 50 },
    { title: "ຊື່ສາຂາ", dataIndex: "branchName" },
    { title: "ອໍເດີ້ທັງໝົດ", dataIndex: "totalOrders", render: safeFormatNumber },
    { title: "ຍອດຂາຍທັງໝົດ", dataIndex: "amountAddOnNewOrder", render: safeFormatNumber },
    { title: "ຮັບເງິນສົດຕົວຈິງ", dataIndex: "totalActualCashLak", render: safeFormatNumber },
    { title: "ຍອດເງິນສົດກີບ", dataIndex: "totalCashLak", render: safeFormatNumber },
    { title: "ຍອດເງິນໂອນກີບ", dataIndex: "totalTransferLak", render: safeFormatNumber },
    { title: "ເງິນທອນ", dataIndex: "totalSendBack", render: safeFormatNumber },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24}>
        <Card title="ລາຍງານເງິນໝູນວຽນ">
          <StyledTable
            columns={changeBranchReportColumns}
            dataSource={reportChangeBranch?.map((item: any, index: number) => ({
              key: index.toString(),
              index: index + 1,
              branchName: item.branchName,
              totalOrders: item.totalOrders || 0,
              amountAddOnNewOrder: item.amountAddOnNewOrder || 0,
              totalActualCashLak: item.totalActualCashLak || 0,
              totalCashLak: item.totalCashLak || 0,
              totalTransferLak: item.totalTransferLak || 0,
              totalSendBack: item.totalSendBack || 0,
            }))}
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
          />
        </Card>
      </Col>
    </Row>
  );
};