import React, { useCallback, useMemo } from "react";
import { Table, Space, Tooltip, Button, TableProps } from "antd";
import styled from "styled-components";
import { FiPrinter } from "react-icons/fi";
import { TbPackageImport } from "react-icons/tb";
import { StockBox, StockBoxListProps } from "../../../types/stockBoxTypes";
import { convertStatusStockBox, formatDate } from "../../../utils/helper";
import { ColumnsType } from "antd/es/table";

// Styled Components
const StyledTable = styled(Table)<TableProps<StockBox>>`
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
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-table-expanded-row {
    background: #fafafa;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  ${({ color }) => color === "green" && `
    background: #52c41a;
    border-color: #52c41a;
    color: white;
    &:hover, &:focus {
      background: #73d13d !important;
      border-color: #73d13d !important;
      color: white !important;
    }
  `}
  ${({ color }) => color === "blue" && `
    background: #1890ff;
    border-color: #1890ff;
    color: white;
    &:hover, &:focus {
      background: #40a9ff !important;
      border-color: #40a9ff !important;
      color: white !important;
    }
  `}
`;

const ExpandedContent = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`;

const StockBoxList: React.FC<StockBoxListProps> = ({
  data,
  loading,
  total,
  handleNextPage,
  filter,
  setIsImportStockBox,
  setSelectStockBox,
  handlePrint,
  setIsExportStockBox,
}) => {
  const handleImportAndExport = useCallback(
    async (record: StockBox, type: "import" | "export") => {
      await setSelectStockBox(record);
      if (type === "import") setIsImportStockBox(true);
      else setIsExportStockBox(true);
    },
    [setSelectStockBox, setIsImportStockBox, setIsExportStockBox]
  );

  const handlePrintStockBox = useCallback(
    async (record: StockBox) => {
      await setSelectStockBox(record);
      handlePrint();
    },
    [setSelectStockBox, handlePrint]
  );

  // ปรับเพื่อแปลง (page, pageSize) จาก onChange เป็น PaginationParams
  const onPaginationChange = useCallback(
    (page: number, pageSize: number) => {
      handleNextPage({ page, pageSize });
    },
    [handleNextPage]
  );

  const columns: ColumnsType<StockBox> = useMemo(
    () => [
      {
        title: "ລຳດັບ",
        key: "no",
        width: 65,
        render: (_, __, index) => filter.skip + index + 1,
      },
      {
        title: "ລະຫັດຖົງ",
        dataIndex: "boxNo",
        key: "boxNo",
        width: 120,
      },
      {
        title: "ຈຳນວນໃນຖົງ",
        dataIndex: "amount",
        key: "amount",
        width: 150,
        render: (_, record) =>
          `${(record.amount || 0).toLocaleString("th-TH")} / ${(record.amountLimit || 0).toLocaleString("th-TH")}`,
      },
      {
        title: "ວັນທີນຳອອກ",
        dataIndex: "exportDate",
        key: "exportDate",
        width: 150,
        render: (exportDate?: string) =>
          exportDate ? formatDate(new Date(exportDate)) : "-",
      },
      {
        title: "ຜູ້ນຳອອກ",
        dataIndex: "exportBy",
        key: "exportBy",
        width: 120,
        render: (exportBy?: string) => exportBy || "-",
      },
      {
        title: "ສະຖານະ",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status: string) => convertStatusStockBox(status) || "-",
      },
      {
        title: "ລາຍລະອຽດ",
        dataIndex: "details",
        key: "details",
        ellipsis: true,
        render: (details?: string) => details || "-",
      },
      {
        title: "ຈັດການ",
        key: "action",
        fixed: "right",
        width: 100,
        render: (_, record) => (
          <Space>
            <Tooltip title="ນຳເຄື່ອງເຂົ້າ" color="green">
              <ActionButton
                color="green"
                icon={<TbPackageImport />}
                onClick={() => handleImportAndExport(record, "import")}
              />
            </Tooltip>
            <Tooltip title="ພິມບິນຕິດໜ້າຖົງ" color="blue">
              <ActionButton
                color="blue"
                icon={<FiPrinter />}
                onClick={() => handlePrintStockBox(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [filter.skip, handleImportAndExport, handlePrintStockBox]
  );

  const expandedRowRender = useCallback(
    (record: StockBox) => (
      <ExpandedContent>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
          <strong>ສາຂາຮັບເຄື່ອງ:</strong>
          <span>{record?.branchId?.branchName || "N/A"}</span>
          <strong>ຜູ້ຮັບເຄື່ອງ:</strong>
          <span>{record?.acceptBy || "-"}</span>
          <strong>ວັນທີຮັບເຄື່ອງ:</strong>
          <span>{record?.acceptDate ? formatDate(record.acceptDate) : "-"}</span>
          <strong>ວັນທີສ້າງ:</strong>
          <span>{record?.createdAt ? formatDate(record.createdAt) : "-"}</span>
          <strong>ຜູ້ສ້າງ:</strong>
          <span>{record?.createdBy || "-"}</span>
        </div>
      </ExpandedContent>
    ),
    []
  );

  return (
    <StyledTable
      loading={loading}
      columns={columns}
      rowKey="id"
      dataSource={data || []}
      scroll={{ x: "max-content" }}
      size="middle"
      expandable={{ expandedRowRender }}
      pagination={{
        current: filter.skip / filter.limit + 1,
        total: total || 0,
        pageSize: filter.limit,
        onChange: onPaginationChange, // ใช้ฟังก์ชันแปลง
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} ຈາກ ${total} ລາຍການ`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    />
  );
};

export default React.memo(StockBoxList);