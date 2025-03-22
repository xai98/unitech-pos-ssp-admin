import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Col, Row, Input, message, Modal, Select, Spin, Table, Switch, Tag } from "antd";
import styled from "styled-components";
import {
  CATEGORIES,
  DELETE_BRANCH_STOCK,
  GET_BRANCH_STOCKS,
  UPDATE_SHOW_STOCK,
} from "../../../../services";
import { consts } from "../../../../utils";
import { formatNumber } from "../../../../utils/helper";
import { DeleteOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { downloadExcel } from "../../../../utils/downloadExcel";
import SetCommissionSalePos from "./SetCommissionSalePos";

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 600;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.danger ? '#ff4d4f' : '#52c41a'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.danger ? '#ff7875' : '#40a9ff'};
  }
  
  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 24px;
`;

const StyledImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

// Interfaces
interface Stock {
  id: string;
  productName: string;
  amount: number;
  commission: number;
  isShowSale: boolean;
  commissionStatus: boolean;
  categoryId: { categoryName: string };
  productId: {
    image: string;
    colorName: string;
    size: string;
    price_sale: number;
    productName: string;
  };
}

interface Category {
  id: string;
  categoryName: string;
}

interface FilterProps {
  skip: number;
  limit: number;
  productName?: string;
  categoryId?: string;
}

interface CommissionState {
  show: boolean;
  data: Stock | null;
}

interface Props {
  selectBranch: string;
}

const StockListPage: React.FC<Props> = ({ selectBranch }) => {
  const [filter, setFilter] = useState<FilterProps>({ skip: 0, limit: 25 });
  const [search, setSearch] = useState<string>("");
  const [dataStock, setDataStock] = useState<Stock[]>([]);
  const [isExport, setIsExport] = useState(false);
  const [isCommission, setIsCommission] = useState<CommissionState>({ show: false, data: null });

  // GraphQL Hooks
  const [deleteStock, { loading: deleteLoading }] = useMutation(DELETE_BRANCH_STOCK, {
    onCompleted: () => loadListStock({ variables: getQueryVariables() }),
    onError: (error) => message.error(`ລົບຂໍ້ມູນລົ້ມເຫຼວ: ${error.message}`),
  });

  const { data: categoryData, loading: categoryLoading } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [updateShowStock] = useMutation(UPDATE_SHOW_STOCK, {
    onError: (error) => message.error(`ອັບເດດຂໍ້ມູນລົ້ມເຫຼວ: ${error.message}`),
  });

  const [loadListStock, { data: stockList, loading }] = useLazyQuery(GET_BRANCH_STOCKS, {
    fetchPolicy: "network-only",
  });

  const [loadStockExport, { data: dataToExecl }] = useLazyQuery(GET_BRANCH_STOCKS, {
    fetchPolicy: "network-only",
  });

  // Functions
  const getQueryVariables = useCallback(() => {
    const variables: any = {
      where: {
        productName: filter.productName || undefined,
        categoryId: filter.categoryId || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
    };
    if (selectBranch !== "filter") variables.where.branchId = selectBranch;
    return variables;
  }, [filter, selectBranch]);

  useEffect(() => {
    if (selectBranch) loadListStock({ variables: getQueryVariables() });
  }, [selectBranch, filter, getQueryVariables, loadListStock]);

  useEffect(() => {
    if (stockList?.stocks?.data) setDataStock(stockList.stocks.data);
  }, [stockList?.stocks?.data]);

  useEffect(() => {
    if (!isExport || !stockList?.stocks?.total) return;
    loadStockExport({
      variables: {
        where: {
          branchId: selectBranch !== "filter" ? selectBranch : undefined,
          productName: filter.productName || undefined,
          categoryId: filter.categoryId || undefined,
        },
        limit: stockList.stocks.total,
      },
    }).then(() => {
      if (dataToExecl?.stocks?.data) {
        const rows = dataToExecl.stocks.data.map((item: Stock, index: number) => ({
          id: index + 1,
          productName: item.productName,
          quantity: formatNumber(item.amount),
          price: formatNumber(item.productId?.price_sale),
        }));
        const titles = ["ລຳດັບ", "ຊື່ສິນຄ້າ", "ຈຳນວນ", "ລາຄາຂາຍ"];
        const fileName = `ລາຍການສິນຄ້າສາຂາ-${moment().format("DD-MM-YYYY HH:mm")}.xlsx`;
        downloadExcel(titles, rows, fileName);
        setIsExport(false);
      }
    });
  }, [isExport, dataToExecl, filter, loadStockExport, selectBranch, stockList]);

  const handleDelete = useCallback((data: Stock) => {
    Modal.confirm({
      title: "ຢືນຢັນການລຶບຂໍ້ມູນ",
      content: (
        <div style={{ padding: "16px 0" }}>
          <StyledImage
            src={data?.productId?.image ? `${consts.URL_PHOTO_AW3}${data?.productId?.image}` : "/logoMinipos.jpg"}
            alt="product"
          />
          <p style={{ marginTop: 16 }}>
            ທ່ານຕ້ອງການລຶບສິນຄ້າ <Tag color="red">{data?.productId?.productName}</Tag> ນີ້ແທ້ບໍ່?
          </p>
        </div>
      ),
      okText: "ລຶບ",
      cancelText: "ຍົກເລີກ",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteStock({ variables: { where: { id: data.id } } });
        message.success("ລຶບຂໍ້ມູນສຳເລັດ");
      },
    });
  }, [deleteStock]);

  const columns = useMemo(() => [
    { title: "#", dataIndex: "no", key: "no", width: 60 },
    {
      title: "ຮູບ",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string) => (
        <StyledImage
          src={image ? `${consts.URL_PHOTO_AW3}${image}` : "/logoMinipos.jpg"}
          alt="product"
        />
      ),
    },
    {
      title: "ສິນຄ້າ",
      dataIndex: "record",
      key: "product",
      render: (_: any, record: Stock) => (
        <div>
          <div style={{ fontWeight: 500, marginTop: 4 }}>{record?.productName}</div>
          <div><Tag color="blue">{record?.categoryId?.categoryName}</Tag></div>

        </div>
      ),
    },
    {
      title: "ລາຍລະອຽດ",
      dataIndex: "record",
      key: "details",
      render: (_: any, record: Stock) => (
        <div>
          <div>ສີ: <Tag>{record?.productId?.colorName}</Tag></div>
          <div>ຂະໜາດ: <Tag>{record?.productId?.size}</Tag></div>
        </div>
      ),
    },
    {
      title: "ຈຳນວນ ແລະ ລາຄາ",
      dataIndex: "record",
      key: "inventory",
      render: (_: any, record: Stock) => (
        <div>
          <div>ຈຳນວນ: {formatNumber(record?.amount || 0)}</div>
          <div>ລາຄາ: {formatNumber(record?.productId?.price_sale || 0)}</div>
          <div 
            style={{ color: "#1890ff", cursor: "pointer", marginTop: 4 }}
            onClick={() => setIsCommission({ show: true, data: record })}
          >
            ຄອມ: {formatNumber(record?.commission || 0)} <EditOutlined />
          </div>
        </div>
      ),
    },
    {
      title: "ຕັ້ງຄ່າ",
      dataIndex: "record",
      key: "settings",
      render: (_: any, record: Stock) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Switch
            checked={record?.isShowSale}
            size="small"
            checkedChildren="ເປີດຂາຍ"
            unCheckedChildren="ປິດຂາຍ"
            onChange={async (checked) => {
              try {
                setDataStock(prev => 
                  prev.map(item => 
                    item.id === record.id ? { ...item, isShowSale: checked } : item
                  )
                );
                await updateShowStock({
                  variables: {
                    data: { isShowSale: checked },
                    where: { id: record.id },
                  },
                });
                message.success("ອັບເດດສະຖານະການຂາຍສຳເລັດ");
              } catch (error) {
                setDataStock(prev => 
                  prev.map(item => 
                    item.id === record.id ? { ...item, isShowSale: !checked } : item
                  )
                );
                message.error("ອັບເດດສະຖານະລົ້ມເຫຼວ");
              }
            }}
          />
          <Switch
            checked={record?.commissionStatus}
            size="small"
            checkedChildren="ໃຫ້ຄອມ"
            unCheckedChildren="ບໍ່ໃຫ້ຄອມ"
            onChange={async (checked) => {
              try {
                setDataStock(prev => 
                  prev.map(item => 
                    item.id === record.id ? { ...item, commissionStatus: checked } : item
                  )
                );
                await updateShowStock({
                  variables: {
                    data: { commissionStatus: checked },
                    where: { id: record.id },
                  },
                });
                message.success("ອັບເດດສະຖານະຄອມມິດຊັ່ນສຳເລັດ");
              } catch (error) {
                setDataStock(prev => 
                  prev.map(item => 
                    item.id === record.id ? { ...item, commissionStatus: !checked } : item
                  )
                );
                message.error("ອັບເດດສະຖານະລົ້ມເຫຼວ");
              }
            }}
          />
        </div>
      ),
    },
    {
      title: "ຈັດການ",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (_: any, record: Stock) => (
        <ActionButton
          danger
          onClick={() => handleDelete(record)}
          disabled={deleteLoading}
        >
          <DeleteOutlined /> ລຶບ
        </ActionButton>
      ),
    },
  ], [dataStock, deleteLoading, updateShowStock]);

  const tableData = useMemo(() =>
    dataStock.map((item: Stock, index: number) => ({
      index,
      no: filter.skip + index + 1,
      image: item.productId?.image,
      ...item,
    })),
    [dataStock, filter.skip]
  );

  const categoryOptions = useMemo(() => [
    { value: "", label: "ສະແດງທຸກປະເພດ" },
    ...(categoryData?.categorys?.data?.map((category: Category) => ({
      value: category.id,
      label: category.categoryName,
    })) || []),
  ], [categoryData?.categorys?.data]);

  const reloadListStock = useCallback(() => {
    loadListStock({ variables: getQueryVariables() });
  }, [getQueryVariables, loadListStock]);

  return (
    <Container>
      <Header>
        <Title>ສິນຄ້າທີ່ນຳຂື້ນໜ້າຂາຍ</Title>
        <ActionButton onClick={() => setIsExport(true)}>
          ດາວໂຫລດ Excel
        </ActionButton>
      </Header>

      <FilterContainer>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              size="large"
              placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => setFilter(prev => ({ ...prev, productName: search }))}
              style={{ borderRadius: 6 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              size="large"
              placeholder="ເລືອກປະເພດສິນຄ້າ"
              style={{ width: "100%", borderRadius: 6 }}
              onChange={(value) => setFilter(prev => ({ ...prev, categoryId: value }))}
              options={categoryOptions}
              showSearch
              optionFilterProp="label"
              loading={categoryLoading}
            />
          </Col>
        </Row>
      </FilterContainer>

      <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="no"
          pagination={{
            current: filter.skip / filter.limit + 1,
            total: stockList?.stocks?.total || 0,
            pageSize: filter.limit,
            onChange: (page, pageSize) => setFilter(prev => ({
              ...prev,
              skip: (page - 1) * pageSize,
              limit: pageSize,
            })),
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} ຈາກ ${total} ລາຍການ`,
          }}
          scroll={{ x: "max-content" }}
          style={{ borderRadius: 8, overflow: "hidden" }}
        />
      </Spin>

      <SetCommissionSalePos
        data={isCommission?.data}
        show={isCommission?.show}
        onClose={() => setIsCommission({ show: false, data: null })}
        loadListStock={reloadListStock}
      />
    </Container>
  );
};

export default StockListPage;