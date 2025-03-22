import { Col, Flex, Image, Input, Row, Select, Spin, Table } from "antd";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { BRANCHS, CATEGORIES, GET_BRANCH_STOCKS } from "../../../services";
import { useQuery } from "@apollo/client";
import { consts } from "../../../utils";
import { formatNumber } from "../../../utils/helper";

function CheckStockBranchPage() {
  const [filter, setFilter] = useState({
    productName: "",
    categoryId: "",
    branchId:"",
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


  const { data: productList, loading } = useQuery(GET_BRANCH_STOCKS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        categoryId: filter?.categoryId || undefined,
        branchId: filter?.branchId || undefined,
        productName: filter?.productName || undefined,
        isShowSale: true,
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
      title: "ຮູບສິນຄ້າ",
      dataIndex: "productId",
      key: "productId",
      width: "100px",
      render: (productId: any) => {
        return (
          <center>
            <Image
              width={50}
              height={50}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              src={
                productId?.image
                  ? consts.URL_PHOTO_AW3 + productId?.image
                  : "/logoMinipos.jpg"
              }
            />
          </center>
        ); // Ensure you return the role
      },
      onClick: (info: any) => {
        info.domEvent.stopPropagation();
      },
    },
    {
      title: "ສາຂາ",
      dataIndex: "branchId",
      key: "branchId",
      render: (branchId: any) => <div>{branchId?.branchName}</div>,
    },
    {
      title: "ປະເພດສິນຄ້າ",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: any) => <div>{categoryId?.categoryName}</div>,
    },

    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "ຈຳນວນ",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span>{formatNumber(amount || 0)}</span>; // Ensure you return the role
      },
    },
    {
      title: "ລາຄາຂາຍ",
      dataIndex: "productId",
      key: "productId",
      render: (productId: any) => {
        return <span>{formatNumber(productId?.price_sale || 0)}</span>; // Ensure you return the role
      },
    },
  ];

  const dataList =
    productList?.stocks?.data &&
    productList?.stocks?.data?.map((item: any, index: number) => ({
      index: filter.skip + index + 1,
      id: item.id,
      ...item,
    }));

  const handleSearch = () => {
    setFilter({
      ...filter,
      productName: search || "",
    });
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

  const optionsBranch =[
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
        <Flex justify="space-between" align="center">
          <TextHeader>ກວດສິນຄ້າສາຂາ</TextHeader>
        </Flex>

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
          <Col span="8">
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
          <Col span="8">
            <Select
              showSearch
              size="large"
              placeholder="ເບິ່ງຕາມສາຂາ..."
              onChange={(value) => {
                setFilter({ ...filter, branchId: value });
              }}
              style={{ width: "100%" }}
              optionFilterProp="label"
              options={optionsBranch}
            />
          </Col>
        </Row>

        <p>{productList?.stocks?.total} ລາຍການ</p>

        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <Table
            size="small"
            columns={columns}
            dataSource={dataList}
            rowKey="id"
            pagination={{
              current: filter.skip / filter.limit + 1,
              total: productList?.stocks?.total,
              pageSize: filter.limit,
              onChange: handleNextPage,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} ລາຍການ`,
            }}
            sticky={{
              offsetHeader: 60,
            }}
          />
        </Spin>
      </BoxContainer>
    </div>
  );
}

export default CheckStockBranchPage;
