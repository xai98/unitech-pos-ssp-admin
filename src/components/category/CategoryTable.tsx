import { Table } from "antd";
import { useMemo } from "react";

interface CategoryTableProps {
  data: any[];
  loading: boolean;
  total: number;
  onRowClick: (record: any) => void;
}

const CategoryTable = ({ data, loading, total, onRowClick }: CategoryTableProps) => {
  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        width: "50px",
        render: (text: string) => (
          <div style={{ textAlign: "center" }}>{text}</div>
        ),
      },
      { title: "ຊື່ປະເພດ", dataIndex: "categoryName", width: "100px" },
      { title: "ໝາຍເຫດ", dataIndex: "note", width: "200px" },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        pageSize: 25,
        total,
        showSizeChanger: false,
      }}
      size="small"
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: "pointer" },
      })}
      scroll={{ x: "max-content" }}
    />
  );
};

export default CategoryTable;