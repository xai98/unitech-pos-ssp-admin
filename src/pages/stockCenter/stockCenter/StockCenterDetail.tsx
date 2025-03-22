import React, { useState, useCallback, useMemo, lazy, Suspense, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Layout, Breadcrumb, Row, Col, Input, Space, Spin } from "antd";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { GET_STOCK_BOXS, GET_STOCK_CENTER } from "../../../services";
import routes from "../../../utils/routes";
import { StockBox } from "../../../types/stockBoxTypes";
import ReactToPrint from "react-to-print";

// Lazy load components with fallback for non-default exports
const StockCenterInfo = lazy(() => import("../../../components/stockCenter/stockCenter/StockCenterInfo"));
const StockBoxForm = lazy(() => import("../../../components/stockCenter/stockBox/StockBoxForm"));
const StockBoxList = lazy(() => import("../../../components/stockCenter/stockBox/StockBoxList"));
const StockBoxImport = lazy(() => import("../../../components/stockCenter/stockBox/StockBoxImport"));
const StockBoxPrint = lazy(() => import("../../../components/stockCenter/stockBox/StockBoxPrint"));
const StockBoxExportModal = lazy(() => import("../../../components/stockCenter/stockBox/StockBoxExportModal"));

// Styled Components (เหมือนเดิม)
const Container = styled(Layout)`
  background: #f5f7fa;
  padding: 24px;
  min-height: 100vh;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
  .ant-breadcrumb-link a {
    color: #1890ff;
    &:hover {
      color: #40a9ff;
    }
  }
`;

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  height: 100%;
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
    width: 250px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: #73d13d;
  }
`;

interface FilterProps {
  boxNo: string;
  skip: number;
  limit: number;
  orderBy: "createdAt_DESC" | "createdAt_ASC";
}

const StockCenterDetail: React.FC = () => {
  const navigate = useNavigate();
  const { stockCenterId } = useParams();

  const printComponentRef = useRef<HTMLDivElement>(null);
    // const printComponentRef = useRef<any>(null);
    const reactToPrintContent = useRef<any>(null);

  const [filter, setFilter] = useState<FilterProps>({
    boxNo: "",
    skip: 0,
    limit: 20,
    orderBy: "createdAt_DESC",
  });
  const [search, setSearch] = useState<string>("");
  const [isCreateStockBox, setIsCreateStockBox] = useState(false);
  const [isImportStockBox, setIsImportStockBox] = useState(false);
  const [isExportStockBox, setIsExportStockBox] = useState(false);
  const [selectStockBox, setSelectStockBox] = useState<StockBox | null>(null);

  const [loadStockCenter, { data, error: stockCenterError }] = useLazyQuery(GET_STOCK_CENTER, {
    fetchPolicy: "cache-and-network",
  });
  const [loadStockBox, { data: stockBoxData, loading: stockBoxLoading, error: stockBoxError }] = useLazyQuery(GET_STOCK_BOXS, {
    fetchPolicy: "cache-and-network",
  });

  const loadData = useCallback(() => {
    if (stockCenterId) {
      loadStockCenter({ variables: { where: { id: stockCenterId } } });
      loadStockBox({
        variables: {
          where: { stockCenterId, boxNo: filter.boxNo || undefined },
          skip: filter.skip,
          limit: filter.limit,
          orderBy: filter.orderBy,
        },
      });
    }
  }, [stockCenterId, filter, loadStockCenter, loadStockBox]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stockCenter = useMemo(() => data?.stockCenter || null, [data]);
  const stockBoxList = useMemo(() => stockBoxData?.stockBoxes?.data || [], [stockBoxData]);

  const onBack = useCallback(() => navigate(routes.STOCK_CENTER_PAGE), [navigate]);

  const handleNextPage = useCallback(({ page, pageSize }: { page: number; pageSize?: number }) => {
    setFilter(prev => ({
      ...prev,
      skip: (page - 1) * (pageSize || prev.limit),
      limit: pageSize || prev.limit,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    setFilter(prev => ({ ...prev, boxNo: search, skip: 0 }));
  }, [search]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handlePrint = () => {
    if (reactToPrintContent.current) {
      reactToPrintContent.current.handlePrint();
    } // Trigger print after saving order
  };

  if (stockCenterError || stockBoxError) {
    return (
      <Container>
        <div style={{ color: "#f5222d", padding: 24 }}>
          ເກີດຂໍ້ຜິດພາດ: {stockCenterError?.message || stockBoxError?.message}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <StyledBreadcrumb
        items={[
          { title: <a onClick={onBack}>ລາຍການສະຕ໋ອກສິນຄ້າ</a> },
          { title: "ລາຍລະອຽດ" },
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <CardWrapper>
            <Title>ລາຍລະອຽດສິນຄ້າສະຕ໋ອກ</Title>
            <Suspense fallback={<Spin tip="ກຳລັງໂຫລດ..." />}>
              <StockCenterInfo stockCenter={stockCenter || {}} />
            </Suspense>
          </CardWrapper>
        </Col>

        <Col xs={24} md={16}>
          <CardWrapper>
            <Suspense fallback={<Spin tip="ກຳລັງໂຫລດ..." />}>
              {!isImportStockBox ? (
                <>
                  <Header>
                    <Title>ລາຍການຖົງເກັບເຄື່ອງ</Title>
                    <SearchWrapper>
                      <Input
                        placeholder="ຄົ້ນຫາຕາມລະຫັດຖົງ..."
                        size="large"
                        value={search}
                        onChange={handleSearchChange}
                        onPressEnter={handleSearch}
                        allowClear
                      />
                      <ActionButton onClick={() => setIsCreateStockBox(true)}>
                        <FaPlus /> ເພີ່ມລາຍການ
                      </ActionButton>
                    </SearchWrapper>
                  </Header>
                  <StockBoxList
                    loading={stockBoxLoading}
                    data={stockBoxList}
                    total={stockBoxData?.stockBoxes?.total || 0}
                    handleNextPage={handleNextPage}
                    filter={filter}
                    setIsImportStockBox={setIsImportStockBox}
                    setIsExportStockBox={setIsExportStockBox}
                    setSelectStockBox={setSelectStockBox}
                    handlePrint={handlePrint}
                  />
                </>
              ) : (
                <StockBoxImport
                  stockCenter={stockCenter}
                  selectStockBox={selectStockBox}
                  setIsImportStockBox={setIsImportStockBox}
                  setSelectStockBox={setSelectStockBox}
                  refetchStockBox={loadData}
                />
              )}
            </Suspense>

            <div style={{ display: "none" }}>
              <ReactToPrint
                trigger={() => <></>}
                content={() => printComponentRef.current}
                ref={reactToPrintContent}
              />
              <Suspense fallback={null}>
                <div ref={printComponentRef}>
                  <StockBoxPrint stockCenter={stockCenter} selectStockBox={selectStockBox} />
                </div>
              </Suspense>
            </div>
          </CardWrapper>
        </Col>
      </Row>

      <Suspense fallback={<Spin tip="ກຳລັງໂຫລດ..." />}>
        <StockBoxForm
          open={isCreateStockBox}
          data={stockCenter}
          onCancel={() => setIsCreateStockBox(false)}
          refetch={loadData}
        />
        <StockBoxExportModal
          open={isExportStockBox}
          onCancel={() => {
            setIsExportStockBox(false);
            setSelectStockBox(null);
          }}
          stockCenter={stockCenter}
          selectStockBox={selectStockBox}
          refetchStockBox={loadData}
        />
      </Suspense>
    </Container>
  );
};

export default React.memo(StockCenterDetail);