import { Table } from "antd";
import { formatNumber, converTypePay } from "../../utils/helper";
import { useMemo } from "react";
import moment from "moment";
import { Order } from "../../types/order";

// Extended interface to include the 'no' property added in HistorySalePage
interface OrderWithNo extends Order {
  no: number;
}

const dateFormat = (date: Date | string): string => {
  return moment(date).format("DD-MM-YYYY HH:mm");
};

interface HistorySaleTableProps {
  data: OrderWithNo[];  // Updated to use OrderWithNo
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick: (record: Order) => void;
}

const HistorySaleTable = ({
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onRowClick,
}: HistorySaleTableProps) => {
  const columns = useMemo(
    () => [
      { title: "#", dataIndex: "no", key: "no", width: "50px" },
      {
        title: "ວັນທີ",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "200px",
        render: (createdAt: string) => dateFormat(createdAt),
      },
      {
        title: "ເລກບິນ",
        dataIndex: "order_no",
        key: "order_no",
        width: "200px",
      },
      {
        title: "ປະເພດຊຳລະ",
        dataIndex: "typePay",
        key: "typePay",
        render: (typePay: string) => converTypePay(typePay),
      },
      {
        title: "ລວມເງິນ",
        dataIndex: "total_price",
        key: "total_price",
        render: (total_price: number) => formatNumber(total_price || 0),
      },
      {
        title: "ສ່ວນຫຼຸດ",
        dataIndex: "discount_total",
        key: "discount_total",
        render: (discount_total: number) => formatNumber(discount_total || 0),
      },
      {
        title: "ຮັບຕົວຈິງ",
        dataIndex: "final_receipt_total",
        key: "final_receipt_total",
        render: (final_receipt_total: number) =>
          formatNumber(final_receipt_total || 0),
      },
      {
        title: "ຮັບກີບສົດ",
        dataIndex: "cash_lak",
        key: "cash_lak",
        render: (cash_lak: number) => formatNumber(cash_lak || 0),
      },
      {
        title: "ຮັບກີບໂອນ",
        dataIndex: "transfer_lak",
        key: "transfer_lak",
        render: (transfer_lak: number) => formatNumber(transfer_lak || 0),
      },
      {
        title: "ເງິນທອນ",
        dataIndex: "send_back_customer",
        key: "send_back_customer",
        render: (send_back_customer: number) =>
          formatNumber(send_back_customer || 0),
      },
      { title: "ຜູ້ເຮັດລາຍການ", dataIndex: "createdBy", key: "createdBy" },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="no"
      pagination={{
        current: currentPage,
        total,
        pageSize,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} ລາຍການ`,
      }}
      sticky={{ offsetHeader: 60 }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default HistorySaleTable;