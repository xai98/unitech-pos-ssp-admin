import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_HISTORY_BRANCH_STOCKS } from "../../../../services";
import {
  addOneDate,
  converStatusHistory,
  currentDate,
  formatDate,
} from "../../../../utils/helper";
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Spin,
  Table,
  Tag,
  Space,
  Typography,
  DatePicker,
  Button,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { consts } from "../../../../utils";
import styled from "styled-components";
import dayjs from "dayjs";

// Types
interface Props {
  selectBranch: string;
}

interface FilterProps {
  from_date?: string;
  to_date?: string;
  limit: number;
  skip: number;
  productName?: string;
  status?: string;
  branchId?: string;
}

interface HistoryStockQueryVariables {
  where: {
    branchId?: string;
    productName?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
  };
  skip: number;
  limit: number;
}

// Constants
const INITIAL_FILTER: FilterProps = {
  from_date: currentDate().startDate,
  to_date: currentDate().endDate,
  skip: 0,
  limit: 25,
  branchId: undefined,
};

// Styled Components for Modern Look
const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FilterContainer = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const debounce = <T extends any[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HistoryBranchStockBack: React.FC<Props> = ({ selectBranch }) => {
  const [filter, setFilter] = useState<FilterProps>(INITIAL_FILTER);

  const [loadHistoryStock, { loading, data: historyStockData }] =
    useLazyQuery(GET_HISTORY_BRANCH_STOCKS, {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  // Update filter when selectBranch changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      branchId: selectBranch !== "filter" ? selectBranch : undefined,
      skip: 0,
    }));
  }, [selectBranch]);

  const queryVariables = useMemo<HistoryStockQueryVariables>(
    () => ({
      where: {
        branchId: filter.branchId,
        productName: filter.productName || undefined,
        status: filter.status || undefined,
        from_date: filter.from_date || undefined,
        to_date: addOneDate(filter.to_date) || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
    }),
    [filter]
  );

  const debouncedLoadHistory = useCallback(
    debounce((variables: HistoryStockQueryVariables) => {
      loadHistoryStock({ variables });
    }, 300),
    [loadHistoryStock]
  );

  useEffect(() => {
    debouncedLoadHistory(queryVariables);
  }, [queryVariables, debouncedLoadHistory]);

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "no",
        key: "no",
        width: 60,
        fixed: "left" as const,
      },
      {
        title: "ຮູບ",
        dataIndex: "image",
        key: "image",
        width: 80,
        render: (image: string) => (
          <img
            src={`${consts.URL_PHOTO_AW3}${image}`}
            alt="product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
            loading="lazy"
          />
        ),
      },
      {
        title: "ສິນຄ້າ",
        dataIndex: "productName",
        key: "productName",
        width: 200,
        ellipsis: true,
      },
      {
        title: "ສະຖານະ",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: string) => (
          <Tag
            color={
              status === "IMPORT_STOCK"
                ? "green"
                : status === "EXPORT_STOCK"
                ? "red"
                : "orange"
            }
            style={{ borderRadius: 12, padding: "0 8px" }}
          >
            {converStatusHistory(status)}
          </Tag>
        ),
      },
      {
        title: "ຈ/ນ ກ່ອນໜ້ານີ້",
        dataIndex: "oldAmount",
        key: "oldAmount",
        width: 100,
        align: "right" as const,
      },
      {
        title: "ເຂົ້າ",
        dataIndex: "inAmount",
        key: "inAmount",
        width: 100,
        align: "right" as const,
        render: (value: number) => (
          <span style={{ color: "#52c41a" }}>{value || 0}</span>
        ),
      },
      {
        title: "ອອກ",
        dataIndex: "outAmount",
        key: "outAmount",
        width: 100,
        align: "right" as const,
        render: (value: number) => (
          <span style={{ color: "#ff4d4f" }}>{value || 0}</span>
        ),
      },
      {
        title: "ຍັງເຫຼືອ",
        dataIndex: "currentAmount",
        key: "currentAmount",
        width: 120,
        align: "right" as const,
        render: (value: number) => <strong>{value}</strong>,
      },
      {
        title: "ພະນັກງານ",
        dataIndex: "createdBy",
        key: "createdBy",
        width: 150,
        ellipsis: true,
      },
      {
        title: "ວັນທີ",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (createdAt: Date) => formatDate(createdAt),
      },
    ],
    []
  );

  const dataSource = useMemo(() => {
    return (
      historyStockData?.historyBranchstocks?.data?.map(
        (item: any, index: number) => ({
          no: filter.skip + index + 1,
          ...item,
          image: item?.productId?.image,
          key: item.id || `${filter.skip + index}`, // Ensure unique key
        })
      ) || []
    );
  }, [historyStockData, filter.skip]);

  const handleNextPage = useCallback((page: number, pageSize?: number) => {
    setFilter((prev: FilterProps) => ({
      ...prev,
      skip: (page - 1) * (pageSize || prev.limit),
      limit: pageSize || prev.limit,
    }));
  }, []);

  const handleResetFilters = () => {
    setFilter(INITIAL_FILTER);
  };

  return (
    <StyledCard>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={4} style={{ margin: 0, color: "#1d39c4" }}>
        ປະຫວັດສະຕ໋ອກຫຼັງບ້ານ
        </Typography.Title>

        <FilterContainer>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                size="large"
                placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
                value={filter.productName || ""}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    productName: e.target.value,
                    skip: 0,
                  }))
                }
                prefix={<SearchOutlined />}
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                size="large"
                placeholder="ເບິ່ງຕາມສະຖານະ"
                value={filter.status || ""}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, status: value, skip: 0 }))
                }
                style={{ width: "100%", borderRadius: 8 }}
                options={[
                  { value: "", label: "ສະແດງທຸກສະຖານະ" },
                  { value: "IMPORT_STOCK", label: "ນຳເຂົ້າ" },
                  { value: "EXPORT_STOCK", label: "ນຳອອກ" },
                  { value: "SALE_STOCK", label: "ຂາຍອອກ" },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <DatePicker
                size="large"
                value={filter.from_date ? dayjs(filter.from_date) : null}
                onChange={(date) =>
                  setFilter((prev) => ({
                    ...prev,
                    from_date: date?.format("YYYY-MM-DD"),
                    skip: 0,
                  }))
                }
                style={{ width: "100%", borderRadius: 8 }}
                placeholder="From Date"
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <DatePicker
                size="large"
                value={filter.to_date ? dayjs(filter.to_date) : null}
                onChange={(date) =>
                  setFilter((prev) => ({
                    ...prev,
                    to_date: date?.format("YYYY-MM-DD"),
                    skip: 0,
                  }))
                }
                style={{ width: "100%", borderRadius: 8 }}
                placeholder="To Date"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  size="large"
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={() => debouncedLoadHistory(queryVariables)}
                  style={{ borderRadius: 8 }}
                >
                  ດຶງຂໍ້ມູນໃໝ່
                </Button>
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={handleResetFilters}
                  style={{ borderRadius: 8 }}
                >
                  Filter
                </Button>
              </Space>
            </Col>
          </Row>
        </FilterContainer>

        <Spin spinning={loading} tip="Loading history..." size="large">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Typography.Text type="secondary">
              ຈຳນວນ: {historyStockData?.historyBranchstocks?.total || 0} ລາຍການ
            </Typography.Text>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: Math.floor(filter.skip / filter.limit) + 1,
                total: historyStockData?.historyBranchstocks?.total || 0,
                pageSize: filter.limit,
                onChange: handleNextPage,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ຂອງ ${total} ລາຍການ`,
                pageSizeOptions: ["10", "25", "50", "100"],
              }}
              scroll={{ x: 1300 }}
              size="middle"
              rowHoverable
              style={{ background: "#fff", borderRadius: 8 }}
            />
          </Space>
        </Spin>
      </Space>
    </StyledCard>
  );
};

export default HistoryBranchStockBack;
