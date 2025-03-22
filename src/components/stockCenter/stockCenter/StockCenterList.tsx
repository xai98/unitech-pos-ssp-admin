import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Image, Space, Button, TableProps } from "antd";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import { consts } from "../../../utils";
import routes from "../../../utils/routes";
import { StockcenterListProps, StockCenter } from "../../../types/stockCenter";

// Styled Components
const StyledTable = styled(Table<StockCenter>)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
    color: #1a1a1a;
    border-bottom: 2px solid #e8ecef;
    padding: 12px 16px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    &:hover {
      background: #f5f7fa;
    }
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #e8ecef;
  }
`;

const ProductImage = styled(Image)`
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  object-fit: cover;
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #d9d9d9;
  background: #ffffff;
  color: #595959;
  
  &:hover {
    border-color: #1890ff !important;
    color: #1890ff !important;
    background: #f0f5ff !important;
  }
`;

const StockCenterList: React.FC<StockcenterListProps> = ({
  data,
  loading,
  total,
  handleNextPage,
  filter,
}) => {
  const navigate = useNavigate();

  // Define columns with explicit typing tied to StockCenter
  const columns: TableProps<StockCenter>["columns"] = [
    {
      title: "ລຳດັບ",
      key: "no",
      width: 80,
      render: (_, __, index: number) => filter.skip + index + 1,
    },
    {
      title: "ຮູບ",
      dataIndex: ["productId", "image"],
      key: "image",
      width: 100,
      render: (image?: string) => (
        <ProductImage
          src={image ? `${consts.URL_PHOTO_AW3}${image}` : "/placeholder.png"}
          alt="product"
          width={60}
          height={60}
          fallback="/placeholder.png"
        />
      ),
    },
    {
      title: "ປະເພດສິນຄ້າ",
      dataIndex: ["categoryId", "categoryName"],
      key: "categoryName",
      width: 150,
    },
    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
      width: 200,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "ຈຳນວນຍັງເຫຼືອ",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: number) => (
        <span style={{ color: amount <= 0 ? "#f5222d" : "#52c41a" }}>
          {(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "ຈ/ນ ຕ່ຳສຸດ",
      dataIndex: "minStock",
      key: "minStock",
      width: 120,
      render: (minStock: number) => (minStock || 0).toLocaleString(),
    },
    {
      title: "ຈ/ນ ສູງສຸດ",
      dataIndex: "maxStock",
      key: "maxStock",
      width: 120,
      render: (maxStock: number) => (maxStock || 0).toLocaleString(),
    },
    {
      title: "ລາຍລະອຽດ",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "ຈັດການ",
      key: "action",
      width: 100,
      render: (_, record: StockCenter) => (
        <Space>
          <ActionButton
            icon={<FaEye />}
            onClick={() => navigate(`${routes.STOCK_CENTER_DETAIL}/${record.id}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <StyledTable
      loading={loading}
      columns={columns}
      rowKey="id"
      dataSource={data || []}
      scroll={{ x: "max-content" }}
      size="middle"
      pagination={{
        current: filter.skip / filter.limit + 1,
        total: total || 0,
        pageSize: filter.limit,
        onChange: (page, pageSize) => handleNextPage({ page, pageSize }),
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} ຈາກ ${total} ລາຍການ`,
        pageSizeOptions: ["10", "25", "50", "100"],
      }}
    />
  );
};

export default StockCenterList;