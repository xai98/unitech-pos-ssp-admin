import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { Input, Space, Button, Layout, Select } from "antd";
import styled from "styled-components";
import { IoFilterOutline } from "react-icons/io5";
import { GET_REPORT_STOCK_CENTER, GET_STOCK_CENTERS } from "../../../services";

// Lazy load components
const OverallInventory = lazy(
  () => import("../../../components/stockCenter/stockCenter/OverallInventory")
);
const StockCenterList = lazy(
  () => import("../../../components/stockCenter/stockCenter/StockCenterList")
);

// Styled Components
const Container = styled(Layout)`
  background: #f5f7fa;
  padding: 24px;
  min-height: 100vh;
`;

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-top: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;
`;

const SearchWrapper = styled(Space)`
  .ant-input {
    border-radius: 6px;
    width: 300px;
  }
`;

const FilterButton = styled(Button)`
  border-radius: 6px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1890ff;
  border-color: #1890ff;
  color: white;

  &:hover,
  &:focus {
    background: #40a9ff !important;
    border-color: #40a9ff !important;
    color: white !important;
  }
`;

interface FilterProps {
  productName: string;
  stockStatus: string,
  categoryId: string;
  skip: number;
  limit: number;
}

const StockCenterPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterProps>({
    productName: "",
    stockStatus: "",
    categoryId: "",
    skip: 0,
    limit: 20,
  });
  const [search, setSearch] = useState<string>("");

  const { data: reportStockCenter } = useQuery(GET_REPORT_STOCK_CENTER, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const { data, loading, error } = useQuery(GET_STOCK_CENTERS, {
    fetchPolicy: "cache-and-network",
    variables: {
      where: {
        stockStatus: filter.stockStatus || undefined,
        productName: filter.productName || undefined,
        categoryId: filter.categoryId || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
    },
    notifyOnNetworkStatusChange: true, // อัพเดท loading state เมื่อ network status เปลี่ยน
  });

  const handleNextPage = useCallback(
    ({ page, pageSize }: { page: number; pageSize?: number }) => {
      setFilter((prev) => ({
        ...prev,
        skip: (page - 1) * (pageSize || prev.limit),
        limit: pageSize || prev.limit,
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    setFilter((prev) => ({
      ...prev,
      productName: search,
      skip: 0,
    }));
  }, [search]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Memoized data to prevent unnecessary re-renders
  const stockData = useMemo(
    () => ({
      data: data?.stockCenters?.data || [],
      total: data?.stockCenters?.total || 0,
    }),
    [data]
  );

  const summaryData = useMemo(
    () => ({
      totalStockLows:
        reportStockCenter?.reportStockCenterSummary?.totalStockLows,
      totalOverStock:
        reportStockCenter?.reportStockCenterSummary?.totalOverStock,
      totalStockNearLows:
        reportStockCenter?.reportStockCenterSummary?.totalStockNearLows,
      totalItems: reportStockCenter?.reportStockCenterSummary?.totalItems,
    }),
    [reportStockCenter]
  );

  if (error) {
    console.error("Error fetching stock centers:", error);
    return (
      <Container>
        <div style={{ color: "#f5222d", padding: 24 }}>
          ເກີດຂໍ້ຜິດພາດ: {error.message}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Suspense fallback={<div>ກຳລັງໂຫຼດ...</div>}>
        <OverallInventory
          totalStockLows={summaryData.totalStockLows}
          totalOverStock={summaryData.totalOverStock}
          totalStockNearLows={summaryData.totalStockNearLows}
          totalItems={summaryData.totalItems}
        />
      </Suspense>

      <CardWrapper>
        <Header>
          <Title>ລາຍການສະຕ໋ອກ</Title>

          <Space>
            <SearchWrapper>
              <Input
                placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
                size="large"
                value={search}
                onChange={handleInputChange}
                onPressEnter={handleKeyPress}
              />
              <FilterButton
                size="large"
                icon={<IoFilterOutline />}
                onClick={handleSearch}
                loading={loading}
              >
                ຄົ້ນຫາ
              </FilterButton>
            </SearchWrapper>

            <Select
              size="large"
              placeholder="ເບິ່ງຕາມສະຖານະສະຕອກ..."
              onChange={(value) => setFilter({ ...filter, stockStatus: value })}
              optionFilterProp="label"
              style={{width:250}}
              options={[
                {
                  value: "",
                  label: "ສະແດງທຸກສະຖານະ",
                },
                {
                  value: "LOW",
                  label: "ສິນຄ້າຫຼຸດສະຕ໋ອກ",
                },
                {
                  value: "NEAR_LOW",
                  label: "ສິນຄ້າໃກ້ຫຼຸດສະຕ໋ອກ",
                },
                {
                  value: "OVER",
                  label: "ສິນຄ້າຢູ່ໃນເກນ",
                },
              ]}
            />
          </Space>
        </Header>

        <Suspense fallback={<div>ກຳລັງໂຫຼດ...</div>}>
          <StockCenterList
            loading={loading}
            data={stockData.data}
            total={stockData.total}
            filter={filter}
            handleNextPage={handleNextPage}
          />
        </Suspense>
      </CardWrapper>
    </Container>
  );
};

export default React.memo(StockCenterPage);
