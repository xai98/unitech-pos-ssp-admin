import { Card, Table } from "antd";
import { formatNumber } from "../../utils/helper";
import styled from "styled-components";

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }
`;

interface CirculationTableProps {
  reportOrder: any;
}

export const CirculationTable = ({ reportOrder }: CirculationTableProps) => {
  const safeFormatNumber = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return formatNumber(numericValue);
  };

  const circulationColumns = [
    { title: "#", dataIndex: "index", width: 50 },
    { title: "ລາຍການ", dataIndex: "item", align: "left" as const },
    { title: "ຈຳນວນເງິນ", dataIndex: "amount", render: safeFormatNumber },
  ];

  return (

        <Card title="ລາຍງານເງິນໝູນວຽນ">
          <StyledTable
            columns={circulationColumns}
            dataSource={[
              {
                key: '1',
                index: 1,
                item: 'ຄ່າຄອມມິດຊັ່ນພະນັກງານ',
                amount: reportOrder?.totalCommission || 0
              },
              {
                key: '2',
                index: 2,
                item: 'ສ່ວນຫຼຸດ',
                amount: reportOrder?.totalDiscount || 0
              },
              {
                key: '3',
                index: 3,
                item: 'ເງິນທອນ',
                amount: reportOrder?.totalSendBack || 0
              }
            ]}
            pagination={false}
            size="small"
          />
        </Card>

  );
};