import { useState } from "react";
import { BoxContainer, TextHeader } from "../../../components/stylesComponent/otherComponent";
import { BRANCHS, GET_CHANGE_ORDERS } from "../../../services";
import { useQuery } from "@apollo/client";
import { 
  addOneDate, 
  converTypePay, 
  currentDate, 
  formatDate, 
  formatNumber 
} from "../../../utils/helper";
import { 
  Col, 
  Row, 
  Input, 
  Select, 
  Spin, 
  Table, 
  Typography,
  Space 
} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import DetailHistoryChange from "./DetailHistoryChange";
import styled from "styled-components";


// Styled Components
const FilterContainer = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #f0f2f5;
    font-weight: 600;
  }
  
  .ant-table-row {
    cursor: pointer;
    &:hover {
      background: #fafafa;
    }
  }
`;

interface FilterProps {
  from_date?: string;
  to_date?: string;
  limit: number;
  skip: number;
  order_no?: string;
  status?: string;
  branchId?: string;
}

function HistoryChangePage() {
  const [filter, setFilter] = useState<FilterProps>({
    from_date: currentDate().startDate,
    to_date: currentDate().endDate,
    skip: 0,
    limit: 25,
  });

  const [search, setSearch] = useState<string>("");
  const [isViewDetail, setIsViewDetail] = useState<{
    show: boolean;
    data: any;
  }>({ show: false, data: null });

  // Queries
  const { loading, data: orderData } = useQuery(GET_CHANGE_ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: {
      where: {
        branchId: filter?.branchId || undefined,
        order_no: filter?.order_no || undefined,
        from_date: filter?.from_date || undefined,
        to_date: addOneDate(filter?.to_date) || undefined,
      },
      skip: filter?.skip,
      limit: filter?.limit,
      orderBy: "createdAt_DESC",
    },
  });

  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  // Handlers
  const handleViewDetail = (record: any) => {
    setIsViewDetail({ show: true, data: record });
  };

  const handleNextPage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      skip: (page - 1) * (pageSize || filter.limit),
      limit: pageSize || filter.limit,
    });
  };

  const handleSearch = () => {
    setFilter({ ...filter, order_no: search || "" });
  };

  // const handleDateRangeChange = (dates: any) => {
  //   if (dates) {
  //     setFilter({
  //       ...filter,
  //       from_date: dates[0].format("YYYY-MM-DD"),
  //       to_date: dates[1].format("YYYY-MM-DD"),
  //     });
  //   }
  // };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "no", key: "no", width: "50px" },
    { 
      title: "ວັນທີ", 
      dataIndex: "createdAt", 
      key: "createdAt", 
      width: "150px",
      render: (date: Date) => formatDate(date)
    },
    { title: "ເລກບິນ", dataIndex: "order_no", key: "order_no", width: "150px" },
    { 
      title: "ປະເພດຊຳລະ", 
      dataIndex: "typePay", 
      key: "typePay",
      render: (type: string) => converTypePay(type)
    },
    { 
      title: "ລວມເງິນ", 
      dataIndex: "totalNewOrder", 
      key: "totalNewOrder",
      render: (value: number) => formatNumber(value || 0)
    },
    { 
      title: "ຮັບເພີ່ມ", 
      dataIndex: "amountAddOnNewOrder", 
      key: "amountAddOnNewOrder",
      render: (value: number) => formatNumber(value || 0)
    },
    { 
      title: "ເງິນທອນ", 
      dataIndex: "send_back_customer", 
      key: "send_back_customer",
      render: (value: number) => formatNumber(value || 0)
    },
    { title: "ຜູ້ເຮັດລາຍການ", dataIndex: "createdBy", key: "createdBy" },
  ];

  const data = orderData?.changeOrders?.data?.map((item: any, index: number) => ({
    no: filter.skip + index + 1,
    ...item,
  })) || [];

  const optionsBranch = [
    { value: "", label: "ສະແດງທຸກສາຂາ" },
    ...(branchData?.Branchs?.data?.map((branch: any) => ({
      value: branch.id.toString(),
      label: branch.branchName,
    })) || []),
  ];

  return (
    <BoxContainer>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <TextHeader>ປະຫວັດການປ່ຽນເຄື່ອງ</TextHeader>
        
        <FilterContainer>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                size="large"
                placeholder="ຄົ້ນຫາຕາມເລກທີ່ບິນ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                showSearch
                size="large"
                placeholder="ເບິ່ງຕາມສາຂາ..."
                onChange={(value) => setFilter({ ...filter, branchId: value })}
                style={{ width: "100%" }}
                optionFilterProp="label"
                options={optionsBranch}
              />
            </Col>
            <Col span="4">
            <Input
              type="date"
              size="large"
              placeholder="ວັນທີ...."
              onChange={(e) => {
                setFilter({ ...filter, from_date: e.target.value || "" });
              }}
              value={filter?.from_date || ""}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span="4">
            <Input
              type="date"
              size="large"
              placeholder="ຫາວັນທີ...."
              onChange={(e) => {
                setFilter({ ...filter, to_date: e.target.value || "" });
              }}
              value={filter?.to_date || ""}
              prefix={<SearchOutlined />}
            />
          </Col>
          </Row>
        </FilterContainer>

        <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Typography.Text>
                ທັງໝົດ: {formatNumber(orderData?.changeOrders?.total || 0)} ລາຍການ
              </Typography.Text>
            </Col>
          </Row>

          <StyledTable
            columns={columns}
            dataSource={data}
            rowKey="no"
            pagination={{
              current: filter.skip / filter.limit + 1,
              total: orderData?.changeOrders?.total,
              pageSize: filter.limit,
              onChange: handleNextPage,
              showSizeChanger: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} ຂອງ ${total} ລາຍການ`,
              pageSizeOptions: ['10', '25', '50', '100'],
            }}
            scroll={{ x: 1200 }}
            onRow={(record) => ({
              onClick: () => handleViewDetail(record),
            })}
          />
        </Spin>
      </Space>

      <DetailHistoryChange
        open={isViewDetail.show}
        data={isViewDetail.data}
        onClose={() => setIsViewDetail({ show: false, data: null })}
      />
    </BoxContainer>
  );
}

export default HistoryChangePage;