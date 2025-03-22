import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  CATEGORIES,
  GET_BRANCH_STOCK_BACK_LISTS,
  UPDATE_STOCK_BRANCH_BACK_MANY,
} from "../../../../services";
import {
  Card,
  Col,
  Flex,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Badge,
  Tooltip,
  Space,
} from "antd";
import ButtonAction from "../../../../components/ButtonAction";
import { consts } from "../../../../utils";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ConfirmAddStockBranch from "./ConfirmAddStockBranch";
import { formatNumber } from "../../../../utils/helper";

interface Props {
  selectBranch: string;
}

interface SelectItems {
  image: string;
  categoryId: string;
  productId: string;
  productName: string;
  barcode: string;
  oldAmount: number;
  amountPlus: number;
  amountMinus: number;
  price_sale: number;
}

interface FilterProps {
  skip: number;
  limit: number;
  productName?: string;
  categoryId?: string;
  branchId?: string;
}

const AddStockBranchBack: React.FC<Props> = ({ selectBranch }) => {
  const [selectedItems, setSelectedItems] = useState<SelectItems[]>([]);
  const [filter, setFilter] = useState<FilterProps>({ 
    skip: 0, 
    limit: 50,
    branchId: undefined // Start with no branch filter
  });
  const [search, setSearch] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<{ show: boolean; data: any }>({
    show: false,
    data: null,
  });

  const { data: categoryData, loading: categoryLoading } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [createStockMany, { loading: createLoading }] = useMutation(
    UPDATE_STOCK_BRANCH_BACK_MANY,
    {
      onCompleted: (data) => {
        message.success(`ອັບເດດສະຕ໋ອກຈຳນວນ ${data?.updateBranchStockMany?.count} ລາຍການສຳເລັດ`);
        refetchStockList();
      },
      onError: (error) => {
        message.error(`Failed to update stock: ${error.message}`);
      },
    }
  );

  const [loadListStock, { data: stockList, loading, refetch }] = useLazyQuery(
    GET_BRANCH_STOCK_BACK_LISTS,
    { fetchPolicy: "network-only" }
  );

  const refetchStockList = useCallback(() => {
    const variables = {
      where: {
        branchId: filter.branchId,
        productName: filter.productName || undefined,
        categoryId: filter.categoryId || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
    };
    refetch?.(variables) || loadListStock({ variables });
  }, [filter, loadListStock, refetch]);

  // Update filter when selectBranch changes
  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      branchId: selectBranch !== "filter" ? selectBranch : undefined,
      skip: 0 // Reset pagination when branch changes
    }));
  }, [selectBranch]);

  // Fetch stock list when filter changes
  useEffect(() => {
    refetchStockList();
  }, [filter, refetchStockList]);

  useEffect(() => {
    if (stockList?.branchStocks?.data) {
      const allItems = stockList?.branchStocks?.data.map((item: any) => ({
        categoryId: item.categoryId?.id,
        productId: item.productId.id,
        image: item.productId.image,
        productName: item.productName,
        price_sale: item.productId.price_sale,
        barcode: item.barcode || "",
        oldAmount: item.amount ?? 0, // Default to 0 if no amount exists
        amountPlus: 0,
        amountMinus: 0,
      }));
      setSelectedItems(allItems);
    }
  }, [stockList?.branchStocks?.data]);

  const handleItemChange = useCallback((
    index: number,
    key: keyof SelectItems,
    value: number | null
  ) => {
    setSelectedItems(prev => {
      const updatedItems = [...prev];
      const newValue = value ?? 0;
      updatedItems[index] = { 
        ...updatedItems[index], 
        [key]: newValue,
        ...(key === "amountPlus" ? { amountMinus: 0 } : { amountPlus: 0 })
      };
      return updatedItems;
    });
  }, []);

  const handleConfirmAddStock = () => {
    if (selectBranch === "filter") {
      message.warning("ກະລຸນາເລືອກສາຂາ");
      return;
    }
    if (!selectedItems?.length) {
      message.warning("ກະລຸນາເພີ່ມຈຳນວນທີ່ຕ້ອງການອັບເດດ");
      return;
    }
    setIsConfirm({ show: true, data: selectedItems });
  };

  const handleSaveAddStock = async () => {
    if (createLoading || selectBranch === "filter" || !selectedItems?.length) {
      message.warning("Please check branch selection and items");
      return;
    }

    const itemsToUpdate = selectedItems
      .filter(item => item.amountPlus > 0 || item.amountMinus > 0)
      .map(item => ({
        categoryId: item.categoryId,
        productId: item.productId,
        productName: item.productName,
        amountPlus: item.amountPlus,
        amountMinus: item.amountMinus,
      }));

    if (!itemsToUpdate.length) {
      message.warning("No changes to save");
      return;
    }

    Modal.confirm({
      title: "ຢືນຢັນການເພີ່ມ",
      content: (
        <div>
          <p>ເຈົ້າແນ່ໃຈລະບໍທີ່ຕ້ອງການອັບເດດສະຕ໋ອກ {itemsToUpdate.length} ລາຍການ?</p>
          <p>ກະລຸນາກວດຄືນອີກຄັ້ງກ່ອນຢືນຢັນ.</p>
        </div>
      ),
      okText: "ຢືນຢັນການເພີ່ມ",
      cancelText: "ປິດອອກ",
      okButtonProps: { type: "primary" },
      onOk: async () => {
        try {
          await createStockMany({
            variables: {
              data: {
                branchId: selectBranch,
                orderItems: itemsToUpdate,
              },
            },
          });
          setIsConfirm({ show: false, data: null });
        } catch (error) {
          message.error("Failed to update stock. Please try again.");
        }
      },
    });
  };

  const handleSearch = useCallback(() => {
    setFilter(prev => ({ ...prev, productName: search, skip: 0 }));
  }, [search]);

  const categoryOptions = useMemo(() => [
    { value: "", label: "ສະແດງທັງໝົດ" },
    ...(categoryData?.categorys?.data?.map((category: any) => ({
      value: category.id,
      label: category.categoryName,
    })) || []),
  ], [categoryData]);

  // const getTotalChanges = () => {
  //   return selectedItems.reduce((acc, item) => 
  //     acc + (item.amountPlus > 0 ? 1 : item.amountMinus > 0 ? 1 : 0), 0);
  // };

  return (
    <>
      <Spin spinning={loading || createLoading} tip="Loading...">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card 
              title={
                <Flex justify="space-between" align="center">
                  <Space>
                    <span style={{ fontSize: 18 }}>ຈັດການສິນຄ້າສະຕ໋ອກຮ້ານ</span>
                  </Space>
                  <ButtonAction
                    size="middle"
                    label="ກວດຄືນ & ຢືນຢັນ"
                    onClick={handleConfirmAddStock}
                    type="primary"
                    icon={<InfoCircleOutlined />}
                    style={{ backgroundColor: "#1890ff", width: 200 }}
                  />
                </Flex>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Input
                    size="large"
                    placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={handleSearch}
                    prefix={<SearchOutlined />}
                    suffix={
                      <Tooltip title="Press Enter to search">
                        <InfoCircleOutlined style={{ color: "#999" }} />
                      </Tooltip>
                    }
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Select
                    showSearch
                    size="large"
                    placeholder="Select category"
                    onChange={(value) => setFilter(prev => ({ ...prev, categoryId: value, skip: 0 }))}
                    style={{ width: "100%" }}
                    optionFilterProp="label"
                    options={categoryOptions}
                    loading={categoryLoading}
                    value={filter.categoryId || ""}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card 
              title={
                <Space>
                  <span>ລາຍການທີ່ມີຢູ່</span>
                  <Badge count={stockList?.branchStocks?.total || 0} />
                </Space>
              }
            >
              {selectedItems?.length ? (
                selectedItems.map((item, index) => (
                  <Card.Grid 
                    key={item.productId} 
                    style={{ width: "100%", padding: "12px" }}
                    hoverable
                  >
                    <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                      <Flex align="center" gap={12}>
                        <Badge count={index + 1} style={{ backgroundColor: "#52c41a" }} />
                        <Image
                          width={50}
                          height={50}
                          style={{ borderRadius: "8px", objectFit: "cover" }}
                          src={item.image ? `${consts.URL_PHOTO_AW3}${item.image}` : "/logoMinipos.jpg"}
                          preview={false}
                        />
                        <Space direction="vertical" size={2}>
                          <strong>{item.productName}</strong>
                          {/* <span style={{ color: "#666", fontSize: "12px" }}>{item.barcode}</span> */}
                          <span>{formatNumber(item.price_sale || 0)} LAK</span>
                        </Space>
                      </Flex>

                      <Space size="middle" align="center">
                        <Space direction="vertical" size={4}>
                          <span style={{ color: "#666" }}>ຍັງເຫຼືອ: {item.oldAmount}</span>
                          <InputNumber
                            placeholder="Add"
                            min={0}
                            value={item.amountPlus}
                            onChange={(value) => handleItemChange(index, "amountPlus", value)}
                            disabled={!!item.amountMinus}
                            style={{ 
                              width: "120px",
                              borderColor: item.amountPlus > 0 ? "#52c41a" : undefined
                            }}
                            addonBefore={<span style={{ color: "#52c41a" }}>+</span>}
                          />
                        </Space>
                        <Space direction="vertical" size={4}>
                          <span style={{ color: "#666" }}>ນຳອອກ</span>
                          <InputNumber
                            placeholder="ນຳອອກ"
                            min={0}
                            max={item.oldAmount}
                            value={item.amountMinus}
                            onChange={(value) => handleItemChange(index, "amountMinus", value)}
                            disabled={!!item.amountPlus}
                            style={{ 
                              width: "120px",
                              borderColor: item.amountMinus > 0 ? "#ff4d4f" : undefined
                            }}
                            addonBefore={<span style={{ color: "#ff4d4f" }}>-</span>}
                          />
                        </Space>
                        <Tooltip title="ຜົນລັບຫຼັງການແກ້ໄຂ">
                          <span>
                            ລວມ: {item.amountPlus 
                              ? item.oldAmount + item.amountPlus 
                              : item.amountMinus 
                                ? item.oldAmount - item.amountMinus 
                                : item.oldAmount}
                          </span>
                        </Tooltip>
                      </Space>
                    </Flex>
                  </Card.Grid>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No items found. Loading all products...
                </p>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>

      <ConfirmAddStockBranch
        open={isConfirm.show}
        data={isConfirm.data}
        onClose={() => setIsConfirm({ show: false, data: null })}
        handleSaveAddStock={handleSaveAddStock}
      />
    </>
  );
};

export default AddStockBranchBack;