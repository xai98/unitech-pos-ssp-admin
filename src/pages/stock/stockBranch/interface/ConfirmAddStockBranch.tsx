import { Modal, Table } from "antd";
import React from "react";
import { formatNumber } from "../../../../utils/helper";

interface SelectItems {
  image: string;
  categoryId: string;
  productId: string;
  productName: string;
  barcode: string;
  oldAmount: number;
  amountPlus: number;
  amountMinus: number;
  price_sale: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: SelectItems[];
  handleSaveAddStock: () => void;
}

const ConfirmAddStockBranch: React.FC<Props> = ({
  open,
  onClose,
  data,
  handleSaveAddStock,
}) => {
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "ລາຍການ",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => <span style={{ textAlign: "left" }}>{text}</span>,
    },
    {
      title: "ຈຳນວນເດີມ",
      dataIndex: "oldAmount",
      key: "oldAmount",
      width: 120,
      render: (value: number) => formatNumber(value),
    },
    {
      title: "ຈຳນວນເພີ່ມເຂົ້າ",
      dataIndex: "amountPlus",
      key: "amountPlus",
      width: 150,
      render: (value: number) => (
        <span style={{ color: value > 0 ? "#52c41a" : "inherit" }}>
          {formatNumber(value)}
        </span>
      ),
    },
    {
      title: "ຈຳນວນນຳອອກ",
      dataIndex: "amountMinus",
      key: "amountMinus",
      width: 150,
      render: (value: number) => (
        <span style={{ color: value > 0 ? "#ff4d4f" : "inherit" }}>
          {formatNumber(value)}
        </span>
      ),
    },
    {
      title: "ຜົນໄດ້ຮັບ",
      key: "result",
      width: 120,
      render: (_: any, record: SelectItems) => {
        const result = record.amountPlus
          ? record.oldAmount + record.amountPlus
          : record.amountMinus
          ? record.oldAmount - record.amountMinus
          : record.oldAmount;
        return formatNumber(result);
      },
    },
  ];

  const dataSource = data?.filter((qty:any) => qty.amountPlus > 0 || qty.amountMinus > 0)?.map((item, index) => ({
    ...item,
    key: item.productId || index.toString(), // Use productId as key if available
  }));

  return (
    <Modal
      title="ຢືນຢັນຂໍ້ມູນ"
      open={open}
      onOk={handleSaveAddStock}
      onCancel={onClose}
      width={1000}
      cancelText="ປິດອອກ"
      okText="ຢືນຢັນ"
      style={{ maxHeight: 500, overflowY: "auto" }}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        bordered
        scroll={{ y: 400 }}
        locale={{
          emptyText: "ບໍ່ມີຂໍ້ມູນສິນຄ້າ",
        }}
      />
    </Modal>
  );
};

export default ConfirmAddStockBranch;