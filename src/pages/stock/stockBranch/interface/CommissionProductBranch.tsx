import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { CATEGORIES, GET_BRANCH_STOCKS, UPDATE_COMMISSION_MANY } from "../../../../services";
import {
  Card,
  Checkbox,
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
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

interface Props {
  selectBranch: string;
}

type SelectItems = {
  categoryId: string;
  productId: string;
  productName: string;
  barcode: string;
  commission: number;
};

interface FilterProps {
  skip: number;
  limit: number;
  productName?: string;
  categoryId?: string;
}

const CommissionProductBranch: React.FC<Props> = ({ selectBranch }) => {
  const [selectedItems, setSelectedItems] = useState<SelectItems[]>([]);
  const [filter, setFilter] = useState<FilterProps>({ skip: 0, limit: 25 });
  const [search, setSearch] = useState<string>("");

  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [updateCommissionMany, { loading: createLoading }] =
    useMutation(UPDATE_COMMISSION_MANY);

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

  // ฟังก์ชันสำหรับจัดการการเลือก checkbox
  const handleSelectItem = (item: any) => {
    const itemExists = selectedItems.some(
      (selected) => selected.productId === item.id
    );

    if (itemExists) {
      // ถ้าข้อมูลถูกเลือกแล้ว จะลบออก
      setSelectedItems(
        selectedItems.filter((selected) => selected.productId !== item.id)
      );
    } else {
      // ถ้ายังไม่ได้เลือก จะเพิ่มข้อมูลใหม่เข้าไป
      setSelectedItems([
        ...selectedItems,
        {
          categoryId: item.categoryId?.id,
          productId: item.productId.id,
          productName: item.productName,
          barcode: item.barcode || "",
          commission: item.commission || 0, // เริ่มต้นด้วยจำนวน 1
        },
      ]);
      message.success(`ເພີ່ມລາຍການ ${item.productName}`);
    }
  };

  // ฟังก์ชันสำหรับเลือกทั้งหมด
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItems = stockList?.stocks?.data?.map((item: any) => ({
        categoryId: item.categoryId?.id,
        productId: item.productId.id,
        productName: item.productName,
        barcode: item.barcode || "",
        commission: item.commission || 0, // เริ่มต้นด้วยจำนวน 1
      }));
      setSelectedItems(allItems || []);
      message.success("ເພີ່ມທັງໝົດສຳເລັດ");
    } else {
      setSelectedItems([]);
    }
  };

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

  const handleRemoveItem = (index: number) => {
    const newCartItem = selectedItems.filter((_, i) => i !== index); // ลบรายการออกจาก array โดยใช้ index
    setSelectedItems(newCartItem);
  };


  const handleSave = async () => {
    if (createLoading) return;
    if (selectBranch === "filter")
      return message.warning("ກະລຸນາເລືອກສາຂາທີ່ຕ້ອງການເພີ່ມກ່ອນ");
    if (!selectedItems || selectedItems.length <= 0)
      return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");

    Modal.confirm({
      title: "ຢືນຢັນການກຳນົດຄ່າຄອມ",
      content: (
        <div>
          <div>ຖ້າທ່ານໝັ້ນໃຈ ແລ້ວກະລຸນາກົດຢືນຢັນຂໍ້ມູນ</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນ",
      cancelText: "ປິດອອກ",
      async onOk() {
        try {
          const result = await updateCommissionMany({
            variables: {
              data: {
                branchId: selectBranch,
                orderItems: selectedItems,
              },
            },
          });

          if (result?.data?.updateCommissionMany?.count) {
            message.success(
              `ກຳນົດຄ່າຄອມຈຳນວນ ${result?.data?.updateCommissionMany?.count}  ລາຍການສຳເລັດ`
            );
            setSelectedItems([]);
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
                  <div>ກຳນົດຄ່າຄອມມິດຊັ່ນສາຂາ</div>
                </div>

                <ButtonAction
                  size="large"
                  label="ຢືນຢັນຂໍ້ມູນ"
                  onClick={handleSave}
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

          <Col span={8}>
            <Card>
              <div style={{ fontSize: 18 }}>ລາຍການສິນຄ້າທີ່ມີຢູ່</div>
              <Checkbox
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  selectedItems.length === stockList?.stocks?.data.length
                }
              >
                ເລືອກທັງໝົດ
              </Checkbox>
              <Divider style={{ margin: "10px 0px" }} />

              {stockList &&
                stockList?.stocks?.data?.map((item: any) => (
                  <div key={item?.id}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={10}>
                        <Checkbox
                          checked={selectedItems.some(
                            (selected) => selected.productId === item?.id
                          )}
                          onChange={() => handleSelectItem(item)}
                        />
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

                      <ButtonAction
                        size="small"
                        label="ເພີ່ມ"
                        onClick={() => handleSelectItem(item)}
                        type="primary"
                        htmlType="button"
                        icon={<PlusOutlined />}
                      />
                    </Flex>
                    <Divider style={{ margin: "10px 0px" }} />
                  </div>
                ))}
            </Card>
          </Col>
          <Col span={16}>
            <Card>
              <div style={{ fontSize: 18 }}>ສິນຄ້າທີ່ຖືກເລືອກ</div>
              <ButtonAction
                size="small"
                label="ຍົກເລິກທັງໝົດ"
                onClick={() => setSelectedItems([])}
                type="primary"
                htmlType="button"
                style={{ backgroundColor: "red", width: 90 }}
              />

              <Divider style={{ margin: "10px 0px" }} />
              {selectedItems &&
                selectedItems?.map((item: any, index: number) => (
                  <div key={item?.id}>
                    <Flex justify="space-between" align="center" gap={10}>
                      <Flex align="center" gap={10} style={{ width: "50%" }}>
                        {index + 1}

                        <div>{item?.productName}</div>
                      </Flex>

                      <InputNumber
                        placeholder="ລາຄາບາດ/ຫໜ"
                        autoComplete="off"
                        min={0}
                        value={item?.commission || 0}
                        style={{ width: "50%" }}
                        onChange={(value) =>
                          handleItemChange(index, "commission", value)
                        }
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />

                      <ButtonAction
                        size="small"
                        label="ຍົກເລິກ"
                        onClick={() => handleRemoveItem(index)}
                        type="primary"
                        htmlType="button"
                        style={{ backgroundColor: "red" }}
                      />
                    </Flex>
                    <Divider style={{ margin: "10px 0px" }} />
                  </div>
                ))}
            </Card>
          </Col>
        </Row>
      </Spin>

 
    </div>
  );
};

export default CommissionProductBranch;
