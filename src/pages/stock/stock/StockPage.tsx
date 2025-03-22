import { Col, Row, Input, Select, Spin, Table, Typography, Button, Space } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CATEGORIES, GET_PRODUCTS } from "../../../services";
import { consts } from "../../../utils";
import { formatNumber } from "../../../utils/helper";
import routes from "../../../utils/routes";
import CreateProduct from "./interface/CreateProduct";
import PrintBarcode from "./interface/PrintBarcode";
import { downloadExcel } from "../../../utils/downloadExcel";
import moment from "moment";
import { PlusOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBarcode } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";

const { Title, Text } = Typography;

const StockPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ productName: "", categoryId: "", skip: 0, limit: 20 });
  const [isCreateProduct, setIsCreateProduct] = useState({ show: false, data: null, editMode: false });
  const [isPrintBarcode, setIsPrintBarcode] = useState({ show: false, data: null });
  const [isExport, setIsExport] = useState(false);

  const { data: categoryData } = useQuery(CATEGORIES, { fetchPolicy: "network-only" });
  const { data: productList, loading, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        categoryId: filter.categoryId || undefined,
        productName: filter.productName || undefined,
      },
      orderBy: "createdAt_DESC",
      skip: filter.skip,
      limit: filter.limit,
    },
  });
  const [loadStockExport, { data: dataToExcel }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  // Memoized category options
  const categoryOptions = useMemo(() => [
    { value: "", label: "ສະແດງທຸກປະເພດ" },
    ...(categoryData?.categorys?.data?.map((category: any) => ({
      value: category.id,
      label: category.categoryName,
    })) || []),
  ], [categoryData]);

  // Memoized table columns
  const columns = useMemo(() => [
    {
      title: "ພິມບາໂຄດ",
      key: "barcode",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<FaBarcode />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsPrintBarcode({ show: true, data: record });
          }}
        >
          ພິມ
        </Button>
      ),
    },
    { title: "#", dataIndex: "index", key: "index", width: 50, align: "center" as const },
    {
      title: "ຮູບສິນຄ້າ",
      dataIndex: "image",
      key: "image",
      width: 80,
      align: "center" as const,
      render: (image: string) => (
        <img
          src={image ? `${consts.URL_PHOTO_AW3}${image}` : "/logoMinipos.jpg"}
          alt="product"
          style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "ປະເພດສິນຄ້າ",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: any) => categoryId?.categoryName || "-",
    },
    { title: "ຊື່ສິນຄ້າ", dataIndex: "productName", key: "productName" },
    { title: "ສີ", dataIndex: "colorName", key: "colorName", width: 100 },
    { title: "ຂະໜາດ", dataIndex: "size", key: "size", width: 100 },
    {
      title: "ລາຄາຕົ້ນທຶນ",
      dataIndex: "price_cost",
      key: "price_cost",
      render: (price: number) => formatNumber(price || 0),
    },
    {
      title: "ລາຄາຂາຍ",
      dataIndex: "price_sale",
      key: "price_sale",
      render: (price: number) => formatNumber(price || 0),
    },
    { title: "ຜູ້ສ້າງ", dataIndex: "createdBy", key: "createdBy" },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`${routes.PRODUCT_DETAIL}/${record.id}`);
          }}
        />
      ),
    },
  ], [navigate]);

  // Memoized data source
  const dataSource = useMemo(() => 
    productList?.products?.data?.map((item: any, index: number) => ({
      key: item.id,
      index: filter.skip + index + 1,
      ...item,
    })) || [],
  [productList, filter.skip]);

  // Handle export
  useEffect(() => {
    if (isExport) {
      loadStockExport({ variables: { limit: productList?.products?.total } });
    }
    if (isExport && dataToExcel?.products?.data) {
      const rows = dataToExcel.products.data.map((item: any, index: number) => ({
        id: index + 1,
        productName: item.productName,
        price: formatNumber(item.price_sale || 0),
      }));
      downloadExcel(
        ["ລຳດັບ", "ຊື່ສິນຄ້າ", "ລາຄາຂາຍ"],
        rows,
        `ລາຍການສິນຄ້າ-${moment().format("DD-MM-YYYY HH:mm")}.xlsx`
      );
      setIsExport(false);
    }
  }, [isExport, productList, dataToExcel, loadStockExport]);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setFilter((prev) => ({ ...prev, productName: value, skip: 0 }));
  }, []);

  const handleTableChange = useCallback((pagination: any) => {
    setFilter((prev) => ({
      ...prev,
      skip: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    }));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0, color: "#2E93fA" }}>
            ຈັດການສິນຄ້າ
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<BiCategoryAlt />}
              onClick={() => navigate(routes.STOCK_CATEGORY)}
            >
              ປະເພດສິນຄ້າ
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateProduct({ show: true, data: null, editMode: false })}
            >
              ເພີ່ມສິນຄ້າ
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#52c41a" }}
              icon={<RiFileExcel2Fill />}
              onClick={() => setIsExport(true)}
            >
              Export Excel
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input.Search
            placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
            onSearch={handleSearch}
            enterButton
            size="large"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            showSearch
            size="large"
            placeholder="ປະເພດສິນຄ້າ..."
            onChange={(value) => setFilter((prev) => ({ ...prev, categoryId: value, skip: 0 }))}
            style={{ width: "100%" }}
            options={categoryOptions}
            optionFilterProp="label"
          />
        </Col>
      </Row>

      <Text strong>{productList?.products?.total || 0} ລາຍການ</Text>

      <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ..." size="large">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: Math.floor(filter.skip / filter.limit) + 1,
            total: productList?.products?.total || 0,
            pageSize: filter.limit,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ລາຍການ`,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
          }}
          scroll={{ x: "max-content" }}
          size="small"
          bordered
          onRow={(record) => ({
            onClick: () => navigate(`${routes.PRODUCT_DETAIL}/${record.id}`),
          })}
        />
      </Spin>

      <CreateProduct
        open={isCreateProduct.show}
        onClose={() => setIsCreateProduct({ show: false, data: null, editMode: false })}
        data={isCreateProduct.data}
        editMode={isCreateProduct.editMode}
        refetch={refetch}
        categoryData={categoryData?.categorys?.data || []}
      />
      <PrintBarcode
        open={isPrintBarcode.show}
        data={isPrintBarcode.data}
        onClose={() => setIsPrintBarcode({ show: false, data: null })}
      />
    </div>
  );
};

export default StockPage;