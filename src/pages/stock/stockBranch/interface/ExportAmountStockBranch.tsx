import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  EXPORT_STOCK_MANY,
  CATEGORIES,
  GET_BRANCH_STOCKS,
} from "../../../../services";
import {
  Card,
  Col,
  Divider,
  Flex,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import ButtonAction from "../../../../components/ButtonAction";
import { consts } from "../../../../utils";
import { SearchOutlined } from "@ant-design/icons";
import ConfirmAddStockBranch from "./ConfirmAddStockBranch";

interface Props {
  selectBranch: string;
}

type SelectItems = {
  categoryId: string;
  productId: string;
  productName: string;
  barcode: string;
  image: string;
  oldAmount: number;
  amount: number;
};

interface FilterProps {
  skip: number;
  limit: number;
  productName?: string;
  categoryId?: string;
}

const ExportAmountStockBranch: React.FC<Props> = ({ selectBranch }) => {
  const [selectedItems, setSelectedItems] = useState<SelectItems[]>([]);
  const [filter, setFilter] = useState<FilterProps>({ skip: 0, limit: 0 });
  const [search, setSearch] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<{ show: boolean; data: any }>({
    show: false,
    data: null,
  });

  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [createStockMany, { loading: createLoading }] =
    useMutation(EXPORT_STOCK_MANY,{
      onCompleted: () => {
        if (selectBranch !== "filter") {
          loadListStock({
            variables: {
              where: {
                branchId: selectBranch,
                productName: filter?.productName || undefined,
                categoryId: filter?.categoryId || undefined,
              },
              skip: filter?.skip,
              limit: filter?.limit,
            },
          });
        } else {
          loadListStock({
            variables: {
              where: {
                productName: filter?.productName || undefined,
                categoryId: filter?.categoryId || undefined,
              },
              skip: filter?.skip,
              limit: filter?.limit,
            },
          });
        }
      },
      onError: (error) => {
        message.error("Failed to add stock: " + error.message);
      },
    });

  const [loadListStock, { data: stockList, loading }] = useLazyQuery(
    GET_BRANCH_STOCKS,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    if (selectBranch !== "filter") {
      loadListStock({
        variables: {
          where: {
            branchId: selectBranch,
            productName: filter?.productName || undefined,
            categoryId: filter?.categoryId || undefined,
          },
          skip: filter?.skip,
          limit: filter?.limit,
        },
      });
    } else {
      loadListStock({
        variables: {
          where: {
            productName: filter?.productName || undefined,
            categoryId: filter?.categoryId || undefined,
          },
          skip: filter?.skip,
          limit: filter?.limit,
        },
      });
    }
  }, [selectBranch, filter]);

  useEffect(() => {
    if (stockList?.stocks?.data) {
      const allItems = stockList?.stocks?.data?.map((item: any) => ({
        categoryId: item.categoryId?.id,
        productId: item.productId.id,
        image: item.productId.image,
        productName: item.productName,
        barcode: item.barcode || "",
        oldAmount: item.amount, // เริ่มต้นด้วยจำนวน 0
        amount: 0,
      }));
      setSelectedItems(allItems);
    }
  }, [stockList?.stocks?.data]);


  const handleItemChange = (
    index: number,
    key: keyof SelectItems,
    value: any
  ) => {
    const updatedItems = [...selectedItems];

    // อัปเดตค่า field ที่ถูกแก้ไข
    updatedItems[index] = { ...updatedItems[index], [key]: value };

    // อัปเดตสถานะของ cartItems
    setSelectedItems(updatedItems);
  };

  const handleConfirmAddStock = () => {
    if (selectBranch === "filter")
      return message.warning("ກະລຸນາເລືອກສາຂາທີ່ຕ້ອງການເພີ່ມກ່ອນ");
    if (!selectedItems || selectedItems.length <= 0)
      return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");
    setIsConfirm({ show: true, data: selectedItems });
  };

  const handleSaveAddStock = async () => {
    if (createLoading) return;
    if (selectBranch === "filter")
      return message.warning("ກະລຸນາເລືອກສາຂາທີ່ຕ້ອງການເພີ່ມກ່ອນ");
    if (!selectedItems || selectedItems.length <= 0)
      return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");

    const items = selectedItems
      ?.filter((qty:any) => qty.amount > 0)
      ?.map((item: any) => ({
      categoryId: item.categoryId,
      productId: item.productId,
      productName: item.productName,
      barcode: item.barcode || "",
      amount: item.amount, 
    }));

    Modal.confirm({
      title: "ຢືນຢັນການເພີ່ມສະຕ໋ອກ",
      content: (
        <div>
          <div>ຖ້າທ່ານໝັ້ນໃຈ ແລ້ວກະລຸນາກົດຢືນຢັນຂໍ້ມູນ</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນການນຳອອກ",
      cancelText: "ປິດອອກ",
      async onOk() {
        try {
          const result = await createStockMany({
            variables: {
              data: {
                branchId: selectBranch,
                orderItems: items,
              },
            },
          });

          if (result?.data?.exportStockMany?.count) {
            message.success(
              `ນຳສະຕ໋ອກຈຳນວນ ${result?.data?.exportStockMany?.count}  ອອກສຳເລັດ`
            );
            setIsConfirm({ show: false, data: null });
          }
        } catch (error: any) {
          message.error("ການດຳເນີນການລົ້ມແຫລວ ກະລຸນາກວດຂໍ້ມູນສິນຄ້າຄືນ");
        }
      },
    });
  };

  const handleSearch = () => {
    setFilter({
      ...filter,
      productName: search || "",
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

  return (
    <div>
      <Spin
        size="large"
        spinning={loading || createLoading}
        tip="ກຳລັງໂຫລດຂໍ້ມູນ..."
      >
        <Row>
          <Col span={24}>
            <Card>
              <Flex justify="space-between" align="center">
                <div style={{ fontSize: 18 }}>
                  <div>ນຳສິນຄ້າອອກຈາກສະຕ໋ອກ</div>
                </div>

                <ButtonAction
                  size="large"
                  label="ຢືນຢັນນຳສະຕ໋ອກສາຂາ"
                  onClick={handleConfirmAddStock}
                  type="primary"
                  htmlType="button"
                  style={{ backgroundColor: "green" }}
                />
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
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card>
              <div style={{ fontSize: 18 }}>ລາຍການສິນຄ້າທີ່ມີຢູ່</div>
              <Divider style={{ margin: "10px 0px" }} />

              <p>ທັງໝົດ {stockList?.stocks?.total || 0} ລາຍການ</p>

              {selectedItems &&
                selectedItems?.map((item: any, index: number) => (
                  <div key={item?.id}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={10}>
                        <span>{index+1}</span>
                        <Image
                          width={50}
                          height={50}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          src={
                            item?.image
                              ? consts.URL_PHOTO_AW3 + item?.image
                              : "/logoMinipos.jpg"
                          }
                        />
                        <div>
                          <div>{item?.productName}</div>
                          <div style={{ fontSize: 10, color: "gray" }}>
                            {item?.categoryId?.categoryName}
                          </div>
                        </div>
                      </Flex>
                      <div>ຈຳນວນມີຢູ່: {item?.oldAmount}</div>

                      <InputNumber
                        placeholder="ປ້ອນຈຳນວນທີ່ຕ້ອງການເພີ່ມ"
                        autoComplete="off"
                        min={0}
                        style={{ width: "20%" }}
                        value={item?.amount || 0}
                        onChange={(value) =>
                          handleItemChange(index, "amount", value)
                        }
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />

                      <div> ລວມ : {item?.oldAmount - item?.amount}</div>
                    </Flex>
                    <Divider style={{ margin: "10px 0px" }} />
                  </div>
                ))}
            </Card>
          </Col>
        </Row>
      </Spin>

      <ConfirmAddStockBranch
        open={isConfirm?.show}
        data={isConfirm?.data}
        onClose={() => setIsConfirm({ show: false, data: null })}
        handleSaveAddStock={handleSaveAddStock}
      />
    </div>
  );
};

export default ExportAmountStockBranch;
