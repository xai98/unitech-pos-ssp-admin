import { Card, Input, message, Select, Space, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_BRANCH_STOCK } from "../../services";
import { formatNumber } from "../../utils/helper";
import { consts } from "../../utils";

const defaultImage =
  "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

interface ProductData {
  newOrderList: any[];
  setNewOrderList: (newOrderList: any[]) => void;
  stockData: any;
  loading: boolean;
  filter: any;
  setFilter: (filter: any) => void;
  branchInfo: any;
  categoryData: any;
}

const ProductList: React.FC<ProductData> = ({
  newOrderList,
  setNewOrderList,
  stockData,
  loading,
  filter,
  setFilter,
  branchInfo,
  categoryData,
}) => {
  const [barcode, setBarcode] = useState<string>("");

  const [loadOneStock] = useLazyQuery(GET_BRANCH_STOCK, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setBarcode((prev) => prev + e.key);

      if (e.key === "Enter") {
        handleAddToOrder(barcode);
        setBarcode("");
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [barcode]);

  const addNewOrder = (product: any) => {
    const existingItem = newOrderList.find(
      (item) => item.productId === product?.productId?.id
    );

    if (product.amount <= 0) {
      return message.warning("ສິນຄ້າບໍ່ພຽງພໍ");
    }

    if (existingItem) {
      if (existingItem.order_qty >= product.amount) {
        return message.warning("ສິນຄ້າບໍ່ພຽງພໍ");
      }

      const updatedList = newOrderList.map((item) =>
        item.productId === product?.productId?.id
          ? {
              ...item,
              order_qty: item.order_qty + 1,
              order_total_price: item.order_total_price + item?.price_sale,
              commission: product?.commissionStatus
                ? item.commission + product?.commission
                : 0,
            }
          : item
      );

      setNewOrderList(updatedList);
    } else {

      const newOrder = {
        productId: product?.productId?.id,
        productName: product?.productName,
        price_cost: product?.productId?.price_cost,
        price_sale: product?.productId?.price_sale,
        order_qty: 1,
        commission: product?.commissionStatus ? product?.commission : 0,
        order_total_price: product?.productId?.price_sale,
      };

      setNewOrderList([newOrder, ...newOrderList]);
    }
  };

  const handleAddToOrder = async (barcode: string) => {
    const formattedBarcode = barcode.length === 12 ? "0" + barcode : barcode;

    const result = await loadOneStock({
      variables: {
        where: {
          branchId: branchInfo?.branchId?.id || undefined,
          barcode: formattedBarcode,
          isShowSale: true,
        },
      },
    });

    if (result?.data?.stock?.id) {
      addNewOrder(result?.data?.stock);
    }
  };

  // const filteredProducts =
  //   stockData?.stocks?.data &&
  //   stockData?.stocks?.data?.filter((product: any) => {
  //     if (!filter.productName) return true; // Return all products if no filter is applied
  //     return product.productName
  //       .toLowerCase()
  //       .includes(filter.productName.toLowerCase());
  //   });

  const filteredProducts = stockData?.stocks?.data?.filter((product: any) => {
    // ถ้าไม่มีการกรองตาม productName และ categoryId เป็น "ALL" ให้แสดงผลทั้งหมด
    if (!filter.productName && filter.categoryId === "ALL") return true;

    // ถ้า categoryId เป็น "ALL" แสดงผลตามการกรอง productName
    if (filter.categoryId === "ALL") {
      return filter.productName
        ? product.productName
            .toLowerCase()
            .includes(filter.productName.toLowerCase())
        : true;
    }

    // ถ้า filter.categoryId ไม่ใช่ "ALL" ให้กรองตาม categoryId และ productName
    const matchesCategory =
      filter.categoryId === undefined ||
      product.categoryId?.id === filter.categoryId;

    const matchesProductName =
      filter.productName === undefined ||
      product.productName
        .toLowerCase()
        .includes(filter.productName.toLowerCase());

    return matchesCategory && matchesProductName;
  });

  return (
    <div className="posProductList">
      <div className="sticky">
        <Space>
          <Select
            showSearch
            style={{
              width: "250px",
            }}
            value={filter?.orderBy}
            size="large"
            placeholder="ການສະແດງສິນຄ້າ"
            onChange={(value) =>
              setFilter({
                ...filter,
                orderBy: value || "",
              })
            }
            optionFilterProp="label"
            options={[
              {
                value: "noShow_ASC",
                label: "ສະແດງລຳດັບຈາກນ້ອຍຫາໃຫ່ຍ",
              },
              {
                value: "noShow_DESC",
                label: "ສະແດງລຳດັບຈາກໃຫ່ຍຈາກນ້ອຍ",
              },
            ]}
          />

          <Input
            size="large"
            style={{width: "350px"}}
            placeholder="ຄົ້ນຫາຕາມລາຍການລາງວັນ...."
            value={filter?.productName}
            onChange={(e) =>
              setFilter({
                ...filter,
                productName: e.target.value || "",
              })
            }
            prefix={<SearchOutlined />}
          />
        </Space>
        <div className="scrollable-container">
          <div
            className={`scrollable-item ${
              filter?.categoryId === "ALL" ? "scrollable-active" : ""
            }`}
            onClick={() =>
              setFilter({
                ...filter,
                categoryId: "ALL",
              })
            }
          >
            ສະແດງທັງໝົດ
          </div>
          {categoryData?.map((item: any, index: number) => (
            <div
              key={index}
              className={`scrollable-item ${
                item?.id === filter?.categoryId ? "scrollable-active" : ""
              } `}
              onClick={() =>
                setFilter({
                  ...filter,
                  categoryId: item?.id,
                })
              }
            >
              {item?.categoryName}
            </div>
          ))}
        </div>
      </div>

      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Card
          style={{
            padding: 0,
            border: 0,
            marginTop: 10,
            background: "#F5F5F5",
          }}
        >
          {filteredProducts?.map((item: any) => (
            <Card.Grid
              key={item.productId.id}
              style={{
                width: "25%",
                padding: 5,
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => addNewOrder(item)}
            >
              <Card
                style={{borderRadius:0}}
                cover={
                  <img
                    alt="product"
                    src={
                      item.productId.image
                        ? consts.URL_PHOTO_AW3 + item.productId.image
                        : defaultImage
                    }
                    style={{ height: 150, objectFit: "cover" }}
                  />
                }
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0%",
                    right: "0%",
                    padding: "3px 20px",
                    backgroundColor: "#1976d2",
                    borderRadius: 2,
                    color: "#fff",
                  }}
                >
                  {item.amount}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, color: "gray" }}>
                    {item.productName}
                  </div>
                  <div style={{ fontSize: 18 }}>
                    {formatNumber(item.productId.price_sale)} ກີບ
                  </div>
                </div>
              </Card>
            </Card.Grid>
          ))}
        </Card>
      </Spin>
    </div>
  );
};

export default ProductList;
