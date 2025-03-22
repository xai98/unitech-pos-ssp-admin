import {
  Breadcrumb,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Image,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import {
  BRANCHS,
  CREATE_BRANCH_STOCK_BACK_MANY,
  GET_PRODUCTS,
} from "../../../services";
import { useMutation, useQuery } from "@apollo/client";
import { consts } from "../../../utils";
import ButtonAction from "../../../components/ButtonAction";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import ConfirmAddStock from "./ConfirmAddStock";
import routes from "../../../utils/routes";
import { useNavigate } from "react-router-dom";

// ประกาศ type สำหรับข้อมูลที่ต้องการเก็บใน selectedItems
type SelectItems = {
  categoryId: string;
  productId: string;
  productName: string;
  barcode: string;
  amount: number;
  commissionStatus: boolean;
  commission:number;
  notiQty: number;
};

function AddStockBranchPage() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<SelectItems[]>([]);
  const [selectBranch, setSelectBranch] = useState<string>("");

  const [isConfirm, setIsConfirm] = useState<{ show: boolean; data: any }>({
    show: false,
    data: null,
  });

  const [createBranchStockMany, { loading: createLoading }] = useMutation(
    CREATE_BRANCH_STOCK_BACK_MANY
  );
  
  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  const { data: productList, loading } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
  });

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
          productId: item.id,
          productName: item.productName,
          barcode: item.barcode || "",
          amount: 0, // เริ่มต้นด้วยจำนวน 1
          commissionStatus: item.isCommission,
          commission:item.commission,
          notiQty: item.notiQty,
        },
      ]);
      message.success(`ເພີ່ມລາຍການ ${item.productName}`);
    }
  };

  // ฟังก์ชันสำหรับเลือกทั้งหมด
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItems = productList?.products?.data?.map((item: any) => ({
        categoryId: item.categoryId?.id,
        productId: item.id,
        productName: item.productName,
        barcode: item.barcode || "",
        amount: 0, // เริ่มต้นด้วยจำนวน 1
        commissionStatus: item.isCommission,
        commission:item.commission,
        notiQty: item.notiQty,
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

  const handleConfirmAddStock = () => {
    if (!selectBranch)
      return message.warning("ກະລຸນາເລືອກສາຂາທີ່ຕ້ອງການເພີ່ມກ່ອນ");
    if (!selectedItems || selectedItems.length <= 0)
      return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");
    setIsConfirm({ show: true, data: selectedItems });
  };

  const handleSaveAddStock = async () => {
    if (!selectBranch)
      return message.warning("ກະລຸນາເລືອກສາຂາທີ່ຕ້ອງການເພີ່ມກ່ອນ");
    if (!selectedItems || selectedItems.length <= 0)
      return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");

    Modal.confirm({
      title: "ຢືນຢັນການເພີ່ມສະຕ໋ອກ",
      content: (
        <div>
          <div>ຖ້າທ່ານໝັ້ນໃຈ ແລ້ວກະລຸນາກົດຢືນຢັນຂໍ້ມູນ</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນການເພີ່ມ",
      cancelText: "ປິດອອກ",
      async onOk() {
        const result = await createBranchStockMany({
          variables: {
            data: {
              branchId: selectBranch,
              orderItems: selectedItems,
            },
          },
        });

        if (result?.data?.createBranchStockMany?.count) {
          message.success(
            `ເພີ່ມສະຕ໋ອກຈຳນວນ ${result?.data?.createBranchStockMany?.count} ສຳເລັດ`
          );
          setSelectBranch("");
          setSelectedItems([]);
          setIsConfirm({ show: false, data: null });
        }
      },
    });
  };

  const onBack = () => {
    navigate(routes.BRANCH);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: (
              <a href="#" onClick={onBack}>
                ຈັດການສາຂາ
              </a>
            ),
          },
          {
            title: "ເພີ່ມເຄື່ອງລົງສາຂາ",
          },
        ]}
      />


      <BoxContainer>
        <TextHeader>ເພີ່ມສິນຄ້າລົງສາຂາ</TextHeader>
        <Divider style={{ margin: "10px 0px" }} />
        <Spin
          size="large"
          spinning={loading || createLoading}
          tip="ກຳລັງໂຫລດຂໍ້ມູນ..."
        >
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card>
                <Flex justify="space-between" align="center">
                  <div style={{ fontSize: 18 }}>
                    <div>ເລືອກສາຂາ ທີ່ຕ້ອງການເພີ່ມສະຕ໋ອກ</div>
                    <Select
                      showSearch
                      size="large"
                      placeholder="ເບິ່ງຕາມສາຂາ..."
                      onChange={(value) => {
                        setSelectBranch(value);
                      }}
                      style={{ width: "100%" }}
                      optionFilterProp="label"
                      options={optionsBranch}
                    />
                  </div>
                  
                  <div>
                  <ButtonAction
                    size="large"
                    label="ຢືນຢັນເພີ່ມສະຕ໋ອກສາຂາ"
                    onClick={handleConfirmAddStock}
                    type="primary"
                    htmlType="button"
                    style={{ backgroundColor: "green" }}
                  />
                  </div>
                </Flex>
              </Card>
            </Col>

            <Col span={8}>
              <Card>
                <div style={{ fontSize: 18 }}>ລາຍການສິນຄ້າທີ່ມີຢູ່</div>
                <Checkbox
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    selectedItems.length === productList?.products?.data.length
                  }
                >
                  ເລືອກທັງໝົດ
                </Checkbox>
                <Divider style={{ margin: "10px 0px" }} />

                {productList &&
                  productList?.products?.data?.map(
                    (item: any) => (
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

                          <div>
                          <ButtonAction
                            size="small"
                            label="ເພີ່ມ"
                            onClick={() => handleSelectItem(item)}
                            type="primary"
                            htmlType="button"
                            icon={<PlusOutlined />}
                          />
                          </div>
                        </Flex>
                        <Divider style={{ margin: "10px 0px" }} />
                      </div>
                    )
                  )}
              </Card>
            </Col>
            <Col span={16}>
              <Card>
                <div style={{ fontSize: 18 }}>ສິນຄ້າທີ່ຖືກເພີ່ມສະຕ໋ອກ</div>
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
                          value={item?.amount || 0}
                          style={{ width: "50%" }}
                          onChange={(value) =>
                            handleItemChange(index, "amount", value)
                          }
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />

                        <div>
                        <ButtonAction
                          size="small"
                          label="ຍົກເລິກ"
                          onClick={() => handleRemoveItem(index)}
                          type="primary"
                          htmlType="button"
                          style={{ backgroundColor: "red" }}
                        />
                        </div>
                      </Flex>
                      <Divider style={{ margin: "10px 0px" }} />
                    </div>
                  ))}
              </Card>
            </Col>
          </Row>
        </Spin>
      </BoxContainer>

      <ConfirmAddStock
        open={isConfirm?.show}
        data={isConfirm?.data}
        onClose={() => setIsConfirm({ show: false, data: null })}
        selectBranch={selectBranch}
        branchList={branchData?.Branchs?.data || []}
        handleSaveAddStock={handleSaveAddStock}
      />
    </>
  );
}

export default AddStockBranchPage;
