import {useState } from "react";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import { BRANCHS, GET_ORDERS } from "../../../services";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  addOneDate,
  converTypePay,
  currentDate,
  formatDate,
  formatNumber,
} from "../../../utils/helper";
import {
  Table,
  Typography,
  Space,
  Spin,
  Button,
} from "antd";
import DetailHistorySale from "./DetailHistorySale";
import moment from "moment";
import { downloadExcel } from "../../../utils/downloadExcel";
import styled from "styled-components";
import HistoryFilters from "../../../components/້historySale/HistoryFilters";
import { RiFileExcel2Line } from "react-icons/ri";

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

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

interface FilterProps {
  from_date: string;
  to_date: string;
  limit: number;
  skip: number;
  order_no?: string;
  status?: string;
  branchId?: string;
}

function HistorySalePage() {
  const [filter, setFilter] = useState<FilterProps>({
    from_date: currentDate().startDate,
    to_date: currentDate().endDate,
    skip: 0,
    limit: 25,
    order_no: "",
  });

  const [isViewDetail, setIsViewDetail] = useState<{
    show: boolean;
    data: any;
  }>({ show: false, data: null });

  // Queries
  const { loading, data: orderData } = useQuery(GET_ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: {
      where: {
        branchId: filter.branchId || undefined,
        order_no: filter.order_no || undefined,
        from_date: filter.from_date || undefined,
        to_date: addOneDate(filter.to_date) || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
      orderBy: "createdAt_DESC",
    },
  });

  const [loadOrderExport, { loading: exportLoading }] =
    useLazyQuery(GET_ORDERS, {
      fetchPolicy: "network-only",
      variables: {
        where: {
          branchId: filter.branchId || undefined,
          order_no: filter.order_no || undefined,
          from_date: filter.from_date || undefined,
          to_date: addOneDate(filter.to_date) || undefined,
        },
        limit: orderData?.orders?.total,
      },
      onCompleted: (data) => {
        if (data?.orders?.data) {
          handleExportExcel(data.orders.data);
        }
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

  const handleFilterChange = (newFilter: Partial<FilterProps>) => {
    setFilter({ ...filter, ...newFilter, skip: 0 });
  };

  const handleExportExcel = (data: any[]) => {
    const rows = data.map((item: any, index: number) => ({
      id: index + 1,
      productName: formatDate(item?.createdAt),
      order_no: item?.order_no,
      typePay: converTypePay(item?.typePay),
      total_price: formatNumber(item?.total_price),
      discount_total: formatNumber(item?.discount_total),
      final_receipt_total: formatNumber(item?.final_receipt_total),
      cash_lak: formatNumber(item?.cash_lak),
      transfer_lak: formatNumber(item?.transfer_lak),
      send_back_customer: formatNumber(item?.send_back_customer),
    }));

    const titles = [
      "ລຳດັບ",
      "ວັນທີ",
      "ເລກບິນ",
      "ປະເພດຊຳລະ",
      "ລວມເງິນ",
      "ສ່ວນຫຼຸດ",
      "ລວມເງິນຮັບຕົວຈິງ",
      "ຮັບກີບສົດ",
      "ຮັບກີບໂອນ",
      "ເງິນທອນ",
    ];

    const fileName = `ຂໍ້ມູນການຂາຍ-${moment().format(
      "DD-MM-YYYY HH:mm"
    )}.xlsx`;

    downloadExcel(titles, rows, fileName);
  };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "no", key: "no", width: "50px" },
    {
      title: "ວັນທີ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "150px",
      render: (date: Date) => formatDate(date),
    },
    { title: "ເລກບິນ", dataIndex: "order_no", key: "order_no", width: "150px" },
    {
      title: "ປະເພດຊຳລະ",
      dataIndex: "typePay",
      key: "typePay",
      render: (type: string) => converTypePay(type),
    },
    {
      title: "ລວມເງິນ",
      dataIndex: "total_price",
      key: "total_price",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: "ສ່ວນຫຼຸດ",
      dataIndex: "discount_total",
      key: "discount_total",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: "ຮັບຕົວຈິງ",
      dataIndex: "final_receipt_total",
      key: "final_receipt_total",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: "ຮັບກີບສົດ",
      dataIndex: "cash_lak",
      key: "cash_lak",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: "ຮັບກີບໂອນ",
      dataIndex: "transfer_lak",
      key: "transfer_lak",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: "ເງິນທອນ",
      dataIndex: "send_back_customer",
      key: "send_back_customer",
      render: (value: number) => formatNumber(value || 0),
    },
    { title: "ຜູ້ເຮັດລາຍການ", dataIndex: "createdBy", key: "createdBy" },
  ];

  const tableData =
    orderData?.orders?.data?.map((item: any, index: number) => ({
      no: filter.skip + index + 1,
      ...item,
    })) || [];

  const branchOptions = [
    { value: "", label: "ສະແດງທຸກສາຂາ" },
    ...(branchData?.Branchs?.data?.map((branch: any) => ({
      value: branch.id.toString(),
      label: branch.branchName,
    })) || []),
  ];

  return (
    <BoxContainer>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <TextHeader>ປະຫວັດການຂາຍ</TextHeader>

        <FilterContainer>
          <HistoryFilters 
            filter={filter} 
            onFilterChange={handleFilterChange} 
            branchOptions={branchOptions} 
          />
        </FilterContainer>

        <Spin spinning={loading || exportLoading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <ActionContainer>
            <Typography.Text>
              ທັງໝົດ: {formatNumber(orderData?.orders?.total || 0)} ລາຍການ
            </Typography.Text>
            
            <Button
              size="large"
              onClick={() => loadOrderExport()}
              type="primary"
              style={{ backgroundColor: "#52c41a", minWidth: 150 }}
              icon={<RiFileExcel2Line />}
            >
            ດາວໂຫລດ Excel
              </Button>
          </ActionContainer>

          <StyledTable
            columns={columns}
            dataSource={tableData}
            rowKey="no"
            pagination={{
              current: Math.floor(filter.skip / filter.limit) + 1,
              total: orderData?.orders?.total,
              pageSize: filter.limit,
              onChange: handleNextPage,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ຂອງ ${total} ລາຍການ`,
              pageSizeOptions: ["10", "25", "50", "100"],
            }}
            scroll={{ x: 1500 }}
            onRow={(record) => ({
              onClick: () => handleViewDetail(record),
            })}
          />
        </Spin>
      </Space>

      <DetailHistorySale
        open={isViewDetail.show}
        data={isViewDetail.data}
        onClose={() => setIsViewDetail({ show: false, data: null })}
      />
    </BoxContainer>
  );
}

export default HistorySalePage;