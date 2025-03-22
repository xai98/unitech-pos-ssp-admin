import { Card, Table } from "antd";
import { formatNumber } from "../../utils/helper";
import styled from "styled-components";



const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;

interface MoneyReportTableProps {
  reportOrder: any;
  reportChange: any;
}

export const MoneyReportTable = ({ reportOrder, reportChange }: MoneyReportTableProps) => {
  const safeFormatNumber = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return formatNumber(numericValue);
  };

  const moneyReportColumns = [
    { title: "#", dataIndex: "index", width: 50 },
    { title: "ລາຍການ", dataIndex: "item", align: "left" as const },
    { title: "ເງິນສົດ", dataIndex: "cash", render: safeFormatNumber },
    { title: "ເງິນໂອນ", dataIndex: "transfer", render: safeFormatNumber },
    { title: "ເງິນທອນ", dataIndex: "sendBack", render: safeFormatNumber },
    { title: "ລວມເງິນ", dataIndex: "total", render: safeFormatNumber },
  ];

  return (

        <Card title="ລາຍງານຍອດເງິນ">
          <StyledTable
            columns={moneyReportColumns}
            dataSource={[
              {
                key: '1',
                index: 1,
                item: 'ຍອດຂາຍປະຈຳວັນ',
                cash: reportOrder?.totalCashLak || 0,
                transfer: reportOrder?.totalTransferLak || 0,
                sendBack: reportOrder?.totalSendBack || 0,
                total: reportOrder?.totalActualIncome || 0
              },
              {
                key: '2',
                index: 2,
                item: 'ຍອດປ່ຽນເຄື່ອງປະຈຳວັນ',
                cash: reportChange?.totalCashLak || 0,
                transfer: reportChange?.totalTransferLak || 0,
                sendBack: reportChange?.totalSendBack || 0,
                total: reportChange?.totalActualIncome || 0
              },
              {
                key: '3',
                index: 3,
                item: 'ເງິນຕ້ອງຮັບຕົວຈິງ',
                cash: (reportOrder?.totalCashLak || 0) + (reportChange?.totalCashLak || 0),
                transfer: (reportOrder?.totalTransferLak || 0) + (reportChange?.totalTransferLak || 0),
                sendBack: (reportOrder?.totalSendBack || 0) + (reportChange?.totalSendBack || 0),
                total: (reportOrder?.totalActualIncome || 0) + (reportChange?.totalActualIncome || 0)
              }
            ]}
            pagination={false}
            size="small"
          />
        </Card>
  
  );
};