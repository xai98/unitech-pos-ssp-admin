import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { BRANCHS, GET_REQUEST_STOCKS } from "../../../services";
import { BoxContainer } from "../../../components/stylesComponent/otherComponent";
import {
  addOneDate,
  convertStatus,
  convertStatusRequestStock,
  formatDate,
  requestStatus,
} from "../../../utils/helper";
import routes from "../../../utils/routes";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
const { RangePicker } = DatePicker;

function HistoryRequestStock() {
  return (
    <div>
      <ListRequestStock />
    </div>
  );
}

const ListRequestStock: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<any>({
    branchId: "",
    status: "all",
    from_date: "",
    to_date: "",
    limit: 20,
    skip: 0,
  });

  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  const { data, loading } = useQuery(GET_REQUEST_STOCKS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: filter?.branchId || undefined,
        from_date: filter?.from_date ? filter?.from_date : undefined,
        to_date: filter?.to_date? addOneDate(filter?.to_date) : undefined,
        status: filter?.status !== "all" ? filter?.status : undefined,
      },
      limit: filter?.limit,
      skip: filter?.skip,
      orderBy:'createdAt_DESC'
    },
  });

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "50px",
      render: (index: number) => (
        <div style={{ textAlign: "center" }}>{index}</div>
      ),
    },
    {
      title: "ຊື່ສາຂາ",
      dataIndex: "branchId",
      key: "branchId",
      render: (branchId: any) => (
        <div style={{ textAlign: "left" }}>{branchId?.branchName}</div>
      ),
    },
    {
      title: "ຊື່ຜູ້ຮ້ອງຂໍ",
      dataIndex: "requestBy",
      key: "requestBy",
    },
    {
      title: "ຈຳນວນລາຍການຂໍ",
      dataIndex: "items",
      key: "items",
      render: (items: any[]) => (
        <div style={{ textAlign: "left" }}>{items?.length} ລາຍການ</div>
      ),
    },
    {
      title: "ສະຖານະ",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div style={{ textAlign: "left" }}>{convertStatus(status)}</div>
      ),
    },
    {
      title: "ວັນທີ",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) => (
        <div style={{ textAlign: "left" }}>{formatDate(createdAt)}</div>
      ),
    },
  ];

  const dataList =
    data?.requestStocks?.data &&
    data?.requestStocks?.data?.map((item: any, index: number) => ({
      index: filter.skip + index + 1,
      id: item.id,
      ...item,
    }));

  const handleViewDetail = (record: any) => {
    navigate(routes.REQUEST_STOCK_DETAIL + "/" + record.id);
    // Navigate to the detail page
  };

  const handleNextPage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      skip: (page - 1) * (pageSize || filter.limit),
      limit: pageSize || filter.limit,
    });
  };

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    // ตรวจสอบว่า dateStrings ไม่ใช่ค่าว่าง
    if (dateStrings && dateStrings[0] && dateStrings[1]) {
      setFilter({
        ...filter,
        from_date: dateStrings[0],
        to_date: dateStrings[1],
      });
    } else {
      // ตั้งค่าให้วันที่เป็นว่างเมื่อไม่เลือกวันที่
      setFilter({
        ...filter,
        from_date: "",
        to_date: "",
      });
    }
  };

  const optionsBranch = [
    {
      value: "",
      label: "ສະແດງທຸກສາຂາ",
    },
    ...(branchData?.Branchs?.data?.map((branch: any) => ({
      value: branch.id.toString(),
      label: branch.branchName,
    })) || []),
  ];

  return (
    <div>
      <BoxContainer>
        <h3 style={{ margin: 0 }}>
          ລາຍການກຳລັງຮ້ອງຂໍ {data?.requestStocks?.total || 0} ລາຍການ
        </h3>
        <div style={{ height: 10 }}></div>

        <Row gutter={[10, 10]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item layout="vertical" label="ເບິ່ງຕາມສາຂາ">
              <Select
                showSearch
                size="large"
                value={filter?.branchId}
                placeholder="ເບິ່ງຕາມສາຂາ..."
                onChange={(value) => setFilter({ ...filter, branchId: value })}
                style={{ width: "100%" }}
                optionFilterProp="label"
                options={optionsBranch}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item layout="vertical" label="ເບິ່ງຕາມວັນທີສັ່ງ">
              <RangePicker
                size="large"
                style={{ width: "100%" }}
                onChange={handleDateChange}
                placeholder={["ແຕ່ວັນທີ", "ຫາວັນທີ"]}
                format="YYYY-MM-DD"
                value={[
                  filter.from_date ? dayjs(filter.from_date) : null,
                  filter.to_date ? dayjs(filter.to_date) : null,
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Flex gap="small" wrap>
          <Button
            type={filter?.status === "all" ? "primary" : "dashed"}
            onClick={() => setFilter({ ...filter, status: "all" })}
          >
            ສະແດງທັງໝົດ
          </Button>

          {requestStatus?.map((status) => (
            <Button
              key={status}
              type={filter?.status === status ? "primary" : "dashed"}
              onClick={() => setFilter({ ...filter, status: status })}
            >
              {convertStatusRequestStock(status)}
            </Button>
          ))}
        </Flex>
        <div style={{ height: 15 }}></div>

        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <Table
            size="small"
            columns={columns}
            dataSource={dataList}
            rowKey="id"
            pagination={{
              current: filter.skip / filter.limit + 1,
              total: data?.requestStocks?.total,
              pageSize: filter.limit,
              onChange: handleNextPage,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} ລາຍການ`,
            }}
            sticky={{
              offsetHeader: 60,
            }}
            onRow={(record) => ({
              onClick: () => handleViewDetail(record), // Trigger handleViewDetail when the row is clicked
            })}
          />
        </Spin>
      </BoxContainer>
    </div>
  );
};

export default HistoryRequestStock;
