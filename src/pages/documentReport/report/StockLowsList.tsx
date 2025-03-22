import { useState } from "react";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import { Breadcrumb, Col, Image, Input, Row, Select, Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";
import { BRANCHS, CATEGORIES, GET_STOCK_LOWS } from "../../../services";
import { useQuery } from "@apollo/client";
import { consts } from "../../../utils";
import { formatNumber } from "../../../utils/helper";
import { SearchOutlined } from '@ant-design/icons';

function StockLowsList() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    productName: "",
    branchId: "",
    categoryId:'',
    skip: 0,
    limit: 20,
  });
  const [search, setSearch] = useState<string>("");

  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const { data: branchData } = useQuery(BRANCHS, {
      fetchPolicy: "network-only",
  });
  

  const { data: stockList, loading } = useQuery(GET_STOCK_LOWS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: filter?.branchId || undefined,
        productName: filter?.productName || undefined,
        categoryId: filter?.categoryId || undefined,
      },
      skip: filter?.skip,
      limit: filter?.limit,
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
      title: "ສາຂາ",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "ຮູບສິນຄ້າ",
      dataIndex: "image",
      key: "image",
      width: "100px",
      render: (image: string) => {
        return (
          <center>
            <Image
              width={50}
              height={50}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              src={image ? consts.URL_PHOTO_AW3 + image : "/logoMinipos.jpg"}
            />
          </center>
        ); // Ensure you return the role
      },
      onClick: (info: any) => {
        info.domEvent.stopPropagation();
      },
    },
    {
      title: "ປະເພດສິນຄ້າ",
      dataIndex: "categoryName",
      key: "categoryName",
    },

    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "ຈຳນວນຍັງເຫຼືອ",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span>{formatNumber(amount || 0)}</span>; // Ensure you return the role
      },
    },

    {
      title: "ໝາຍເຫດ",
      dataIndex: "note",
      key: "note",
    },
  ];

  const dataList =
    stockList?.stockLows?.data &&
    stockList?.stockLows?.data?.map((item: any, index: number) => ({
      index: filter.skip + index + 1,
      id: item.id,
      image: item?.productId?.image,
      branchName: item?.branchId?.branchName,
      categoryName: item?.categoryId?.categoryName,
      ...item,
    }));

  const handleBack = () => {
    navigate(routes.REPORT_DASHBOARD, { replace: true });
  };

  const handleNextPage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      skip: (page - 1) * (pageSize || filter.limit),
      limit: pageSize || filter.limit,
    });
  };

  const options = [
    {
      value: "",
      label: "ສະແດງທຸກປະເພດ",
    },
    ...(categoryData?.categorys?.data?.map((category: any) => ({
      value: category.id.toString(),
      label: category.categoryName,
    })) || []),
  ];

  const handleSearch = () => {
    setFilter({
      ...filter,
      productName: search || "",
    });
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
      <Breadcrumb
        items={[
          {
            title: (
              <div onClick={handleBack} style={{ cursor: "pointer" }}>
                ພາບລວມ
              </div>
            ),
          },
          {
            title: "ລາຍການສິນຄ້າໃກ້ໝົດ",
          },
        ]}
      />

      <div style={{ height: 10 }}></div>

      <BoxContainer>
        <TextHeader>ຂໍ້ມູນສິນຄ້າທີ່ໃກ້ຈະໝົດ</TextHeader>
        <div style={{ height: 10 }}></div>

        <Row gutter={10}>
          <Col span="8">
            <Input
              size="large"
              placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ.... ແລ້ວກົດ enter"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
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
            </Col>

          <Col span="6">
            <Select
              showSearch
              size="large"
              placeholder="ປະເພດສິນຄ້າ..."
              onChange={(value) => {
                setFilter({ ...filter, categoryId: value });
              }}
              style={{ width: "100%" }}
              optionFilterProp="label"
              options={options}
            />
          </Col>
        </Row>

        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <p>{stockList?.stockLows?.total} ລາຍການ</p>

          <Table
            size="small"
            columns={columns}
            dataSource={dataList}
            rowKey="id"
            pagination={{
              current: filter.skip / filter.limit + 1,
              total: stockList?.stockLows?.total,
              pageSize: filter.limit,
              onChange: handleNextPage,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} ລາຍການ`,
            }}
            sticky={{
              offsetHeader: 60,
            }}
            // onRow={(record) => ({
            //   onClick: () => handleViewDetail(record), // Trigger handleViewDetail when the row is clicked
            // })}
          />
        </Spin>
      </BoxContainer>
    </div>
  );
}

export default StockLowsList;
