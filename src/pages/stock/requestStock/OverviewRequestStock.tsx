import {
  Card,
  Col,
  Row,
  Skeleton,
  Spin,
  Statistic,
  Table,
} from "antd";
import React from "react";
import { FaFileInvoice } from "react-icons/fa";
import { GiConfirmed, GiNotebook } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { useQuery } from "@apollo/client";
import {
  GET_REQUEST_STOCKS,
  GET_SUMMARY_REQUEST_STOCK,
} from "../../../services";
import { BoxContainer } from "../../../components/stylesComponent/otherComponent";
import { convertStatus, formatDate } from "../../../utils/helper";
import routes from "../../../utils/routes";
import { useNavigate } from 'react-router-dom';




function OverviewRequestStock() {
  return (
    <div>
      <SummaryRequestStock />
      <div style={{ height: 10 }}></div>
      <ListRequestStock />
    </div>
  );
}

const SummaryRequestStock: React.FC = () => {
  const { data, loading } = useQuery(GET_SUMMARY_REQUEST_STOCK);

  const qtyReport = (status: string): number => {
    const statusCounts: { [key: string]: number } =
      data?.sumaryRequestStock?.reduce(
        (acc: { [key: string]: number }, item: any) => {
          acc[item?.status] = item?.count || 0;
          return acc;
        },
        {}
      ) || {};

    return statusCounts[status] || 0;
  };

  return (
    <div>
      {loading ? (
        <Row gutter={16}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col span={4} key={i}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))}
          ;
        </Row>
      ) : (
        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic
                title="ພ/ງ ສັ່ງເຄື່ອງໃໝ່"
                value={qtyReport("REQUESTING")}
                valueStyle={{ color: "orange" }}
                prefix={<FaFileInvoice />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="ພ/ງ ຢືນຢັນການສົ່ງຂໍ"
                value={qtyReport("SEND_REQUESTING")}
                valueStyle={{ color: "#13b8a6" }}
                prefix={<FaFileInvoice />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="ພ/ງ ຂໍຍົກເລິກ"
                value={qtyReport("REQUESTING_CANCEL")}
                valueStyle={{ color: "#ff7575" }}
                prefix={<FaFileInvoice />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="ຮັບຮູ້ການສັ່ງເຄື່ອງ"
                value={qtyReport("APPROVED")}
                valueStyle={{ color: "#296e78" }}
                prefix={<GiNotebook />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="ສັ່ງເຄື່ອງສຳເລັດ"
                value={qtyReport("SUCCESS")}
                valueStyle={{ color: "#3f8600" }}
                prefix={<GiConfirmed />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="ປະຕິເສດການສັ່ງເຄື່ອງ"
                value={qtyReport("REJECTED")}
                valueStyle={{ color: "#cf1322" }}
                prefix={<FcCancel />}
                suffix="ຄັ້ງ"
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

const ListRequestStock: React.FC = () => {

  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_REQUEST_STOCKS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        status_in: ["REQUESTING", "SEND_REQUESTING", 'REQUESTING_CANCEL' ,"APPROVED", "READY_UPDATE_STOCK","UPDATE_STOCK_SUCCESS"],
      },
      limit: 30,
      skip: 0,
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
        <div style={{ textAlign: "left" }}>{convertStatus(status)}</div>)
    },
    {
      title: "ວັນທີ",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) => (
        <div style={{ textAlign: "left" }}>{formatDate(createdAt)}</div>)
    },
  ];

  const dataList =
    data?.requestStocks?.data &&
    data?.requestStocks?.data?.map((item: any, index: number) => ({
      index: index + 1,
      id: item.id,
      ...item,
    }));

    const handleViewDetail = (record: any) => {
      navigate(routes.REQUEST_STOCK_DETAIL + '/' + record.id)
      // Navigate to the detail page
    };

  return (
    <div>
      <BoxContainer>
        <h3 style={{ margin: 0 }}>ລາຍການກຳລັງຮ້ອງຂໍ {data?.requestStocks?.total || 0} ລາຍການ</h3>
        <div style={{ height: 20 }}></div>
        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <Table
            size="small"
            columns={columns}
            dataSource={dataList}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleViewDetail(record), // Trigger handleViewDetail when the row is clicked
            })}
          />
        </Spin>
      </BoxContainer>
    </div>
  );
};

export default OverviewRequestStock;
