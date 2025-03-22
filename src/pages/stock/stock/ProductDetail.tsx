import { useLazyQuery } from "@apollo/client";
import { Breadcrumb, Button, Card, Col, Image, Row, Space, Spin, Tag, Typography } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../../../services";
import { formatDate, formatNumber } from "../../../utils/helper";
import { consts } from "../../../utils";
import routes from "../../../utils/routes";
import { EditOutlined } from "@ant-design/icons";
import NotificationStockLow from "./component/NotificationStockLow";
import OpenSaleProduct from "./component/OpenSaleProduct";
import CommissionSetting from "./component/CommissionSetting";
import CreateProduct from "./interface/CreateProduct";
import StockCenterForm from "../../../components/stockCenter/stockCenter/StockCenterForm";

const { Title, Text } = Typography;

// interface ProductDetailProps {
//   productId?: string;
// }

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<any>({});
  const [isCreateStock, setIsCreateStock] = React.useState(false);
  const [isCreateProduct, setIsCreateProduct] = React.useState({
    show: false,
    data: null,
    editMode: false,
  });

  const [loadProduct, { loading, data, refetch }] = useLazyQuery(GET_PRODUCT_BY_ID, {
    fetchPolicy: "network-only",
  });

  // Fetch product data
  const fetchProduct = useCallback(() => {
    if (productId) {
      loadProduct({
        variables: { where: { id: productId } },
      });
    }
  }, [productId, loadProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (data?.product) {
      setProduct(data.product);
    }
  }, [data?.product]);

  // Memoized breadcrumb items
  const breadcrumbItems = useMemo(() => [
    {
      title: (
        <Text onClick={() => navigate(routes.STOCK_PAGE, { replace: true })} style={{ cursor: "pointer" }}>
          ຈັດການສິນຄ້າ
        </Text>
      ),
    },
    { title: product?.productName || "ລາຍລະອຽດສິນຄ້າ" },
  ], [navigate, product?.productName]);

  // Memoized product info
  const productInfo = useMemo(() => [
    { title: "ສະຖານະສ້າງສະຕ໋ອກ", description: (
      <Tag color={product?.isCreatedStock ? "green" : "red"}>
        {product?.isCreatedStock ? "ສ້າງສະຕ໋ອກແລ້ວ" : "ສະຕ໋ອກຍັງບໍ່ຖືກສ້າງ"}
      </Tag>
    ), span: 8 },
    { title: "ເລກບາໂຄດ", description: product?.barcode, span: 8 },
    { title: "ປະເພດສິນຄ້າ", description: product?.categoryId?.categoryName, span: 8 },
    { title: "ຊື່ສິນຄ້າ", description: product?.productName, span: 8 },
    { title: "ສີ", description: product?.colorName, span: 8 },
    { title: "ຂະໜາດ", description: product?.size, span: 8 },
    { title: "ລາຄາຕົ້ນທຶນ", description: `${formatNumber(product?.price_cost || 0)} ກີບ`, span: 8 },
    { title: "ລາຄາຂາຍ", description: `${formatNumber(product?.price_sale || 0)} ກີບ`, span: 8 },
    { title: "ຜູ້ສ້າງລາຍການ", description: product?.createdBy, span: 8 },
    { title: "ວັນທີສ້າງ", description: formatDate(product?.createdAt), span: 8 },
  ], [product]);

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />

      <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ..." size="large">
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Row gutter={[32, 32]}>
            {/* Product Image Section */}
            <Col xs={24} md={6}>
              <Space direction="vertical" align="center" style={{ width: "100%" }}>
                <Title level={4}>ຮູບສິນຄ້າ</Title>
                <Image
                  src={product?.image ? `${consts.URL_PHOTO_AW3}${product.image}` : "/logoMinipos.jpg"}
                  width={200}
                  height={200}
                  style={{ objectFit: "contain", borderRadius: 8 }}
                  preview={false}
                />
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="large"
                    block
                    onClick={() => setIsCreateProduct({ show: true, data: product, editMode: true })}
                  >
                    ແກ້ໄຂຂໍ້ມູນສິນຄ້າ
                  </Button>
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    size="large"
                    block
                    onClick={() => setIsCreateStock(true)}
                  >
                    ສ້າງສະຕ໋ອກສິນຄ້າ
                  </Button>
                </Space>
              </Space>
            </Col>

            {/* Product Details Section */}
            <Col xs={24} md={18}>
              <Title level={4}>ຂໍ້ມູນສິນຄ້າ</Title>
              <Card  style={{ background: "#fafafa", borderRadius: 8 }}>
                <Row gutter={[16, 24]}>
                  {productInfo.map((item, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Text type="secondary">{item.title}</Text>
                      <div style={{ marginTop: 4 }}>
                        <Text strong>{item.description || "-"}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>

              <Title level={4} style={{ marginTop: 24 }}>ຕັ້ງຄ່າສິນຄ້າ</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <NotificationStockLow product={product} />
                </Col>
                <Col xs={24} md={12}>
                  <OpenSaleProduct product={product} setProduct={setProduct} />
                </Col>
                <Col xs={24} md={12}>
                  <CommissionSetting product={product} setProduct={setProduct} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Spin>

      {/* Modals */}
      <CreateProduct
        open={isCreateProduct.show}
        onClose={() => setIsCreateProduct({ show: false, data: null, editMode: false })}
        data={isCreateProduct.data}
        editMode={isCreateProduct.editMode}
        refetch={refetch}
      />
      <StockCenterForm
        open={isCreateStock}
        data={product}
        onCancel={() => setIsCreateStock(false)}
        refetch={refetch}
      />
    </div>
  );
};

export default ProductDetail;