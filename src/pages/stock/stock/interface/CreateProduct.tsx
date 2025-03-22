import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Modal,
  Image,
  InputNumber,
  Row,
  Col,
  Switch,
  Checkbox,
  message,
  Space,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CATEGORIES,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../../../../services";
import UploadImageOne from "../../../../components/UploadImageOne";
import { consts } from "../../../../utils";
import { LuRefreshCcw } from "react-icons/lu";

interface Props {
  open: boolean;
  onClose: () => void;
  data?: any;
  editMode: boolean;
  refetch: () => void;
  categoryData?: any[];
}

const CreateProduct: React.FC<Props> = ({
  open,
  onClose,
  data,
  editMode,
  refetch,
  categoryData,
}) => {
  const [form] = Form.useForm();
  const { UploadImage, imageName, setImageName } = UploadImageOne();
  const [isEditable, setIsEditable] = useState(false);
  const [isAddBranch, setIsAddBranch] = useState(false);
  const [isCommission, setIsCommission] = useState(false);

  const [createData, { loading: createLoading }] = useMutation(CREATE_PRODUCT);
  const [updateData, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT);
  const [deleteData, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT);
  const [loadCategory, { data: categories }] = useLazyQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  // Memoize category options
  const categoryOptions = useMemo(() => {
    const source = categoryData || categories?.categorys?.data;
    return source?.map((category: any) => ({
      value: category.id,
      label: category.categoryName,
    })) || [];
  }, [categoryData, categories]);

  // Generate EAN13 barcode
  const generateValidEAN13 = useCallback(() => {
    const base = Array(12)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("");
    const digits = base.split("").map(Number);
    const sum = digits.reduce((acc, digit, idx) => 
      acc + digit * (idx % 2 === 0 ? 1 : 3), 0);
    const checkDigit = (10 - (sum % 10)) % 10;
    return base + checkDigit;
  }, []);

  // Initialize form
  useEffect(() => {
    if (!editMode) {
      form.setFieldsValue({ barcode: generateValidEAN13() });
    }
    if (!categoryData) {
      loadCategory();
    }
  }, [form, editMode, categoryData, generateValidEAN13, loadCategory]);

  // Set form values when editing
  useEffect(() => {
    if (editMode && data) {
      setImageName(data.image || "");
      form.setFieldsValue({
        ...data,
        categoryId: data.categoryId?.id,
      });
      setIsEditable(false);
    } else {
      form.resetFields();
      form.setFieldsValue({ barcode: generateValidEAN13() });
    }
  }, [data, editMode, form, setImageName, generateValidEAN13]);

  const handleSubmit = async (values: any) => {
    const payload = { ...values, image: imageName };
    try {
      const mutation = editMode ? updateData : createData;
      const variables = editMode
        ? { data: payload, where: { id: data?.id } }
        : { data: payload };

      const result = await mutation({ variables });
      const success = editMode 
        ? result?.data?.updateProduct?.id 
        : result?.data?.createProduct?.id;

      if (success) {
        message.success(editMode ? "ແກ້ໄຂຂໍ້ມູນສຳເລັດ" : "ເພີ່ມຂໍ້ມູນສຳເລັດ");
        handleClose();
      }
    } catch (error) {
      message.error("ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "ຢືນຢັນການລຶບຂໍ້ມູນ",
      content: (
        <Space direction="vertical" align="center">
          <Image
            width={70}
            style={{ borderRadius: "50%" }}
            src={data?.image ? `${consts.URL_PHOTO_AW3}${data.image}` : "/logoMinipos.jpg"}
            preview={false}
          />
          <div>
            ທ່ານຕ້ອງການລືບຂໍ້ມູນສິນຄ້າ{" "}
            <span style={{ color: "red" }}>{data?.productName}</span> ນີ້ແທ້ ຫຼື ບໍ່?
          </div>
        </Space>
      ),
      okText: "ລືບ",
      cancelText: "ປິດ",
      okType: "danger",
      onOk: async () => {
        try {
          const result = await deleteData({
            variables: { where: { id: data?.id } },
          });
          if (result?.data?.deleteProduct?.id) {
            message.success("ລຶບຂໍ້ມູນສຳເລັດ");
            handleClose();
          }
        } catch (error) {
          message.error("ການລຶບລົ້ມເຫຼວ");
        }
      },
    });
  };

  const handleClose = () => {
    setIsEditable(false);
    form.resetFields();
    setImageName("");
    onClose();
    refetch();
  };

  return (
    <Drawer
      title={editMode ? "ລາຍລະອຽດສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}
      width={500}
      onClose={handleClose}
      open={open}
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        editMode && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deleteLoading}
          >
            ລຶບ
          </Button>
        )
      }
    >
      {editMode && (
        <Checkbox
          checked={isEditable}
          onChange={(e) => setIsEditable(e.target.checked)}
          style={{ marginBottom: 16 }}
        >
          ແກ້ໄຂຂໍ້ມູນ
        </Checkbox>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={editMode && !isEditable}
      >
        <Form.Item label="ຮູບສິນຄ້າ">
          {editMode && !isEditable ? (
            <Image
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
              src={imageName ? `${consts.URL_PHOTO_AW3}${imageName}` : "/logoMinipos.jpg"}
              preview={false}
            />
          ) : (
            UploadImage()
          )}
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label="ປະເພດສິນຄ້າ"
              name="categoryId"
              rules={[{ required: true, message: "ກະລຸນາເລືອກປະເພດສິນຄ້າ" }]}
            >
              <Select
                showSearch
                size="middle"
                optionFilterProp="label"
                options={categoryOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ຊື່ສິນຄ້າ"
              name="productName"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ສິນຄ້າ" }]}
            >
              <Input size="middle" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="ລະຫັດບາໂຄດ"
              name="barcode"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນບາໂຄດ" }]}
            >
              <Input
                size="middle"
                suffix={
                  !editMode && (
                    <Button
                      type="text"
                      icon={<LuRefreshCcw />}
                      onClick={() => form.setFieldsValue({ barcode: generateValidEAN13() })}
                    />
                  )
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="ສີ" name="colorName">
              <Input size="middle" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="ຂະໜາດ" name="size">
              <Input size="middle" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="ລາຄາຕົ້ນທຶນ" name="price_cost">
              <InputNumber
                size="middle"
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value ? Number(value.replace(/\D/g, "")) : 0}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="ລາຄາຂາຍ" name="price_sale" rules={[{ required: true, message: "ກະລຸນາປ້ອນລາຄາຂາຍ" }]}>
              <InputNumber
                size="middle"
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value ? Number(value.replace(/\D/g, "")) : 0}
              />
            </Form.Item>
          </Col>

          {!editMode && (
            <>
              <Col span={12}>
                <Form.Item label="ເພີ່ມສິນຄ້າລົງທຸກສາຂາ" name="isAddBranch" valuePropName="checked">
                  <Switch
                    checkedChildren="ເປີດ"
                    unCheckedChildren="ປິດ"
                    onChange={setIsAddBranch}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="ເປີດຂາຍເລີຍ" name="isShowSale" valuePropName="checked">
                  <Switch checkedChildren="ເປີດ" unCheckedChildren="ປິດ" />
                </Form.Item>
              </Col>

              {isAddBranch && (
                <>
                  <Col span={12}>
                    <Form.Item label="ເປີດໃຫ້ຄ່າຄອມ" name="isCommission" valuePropName="checked">
                      <Switch
                        checkedChildren="ເປີດ"
                        unCheckedChildren="ປິດ"
                        onChange={setIsCommission}
                      />
                    </Form.Item>
                  </Col>
                  {isCommission && (
                    <Col span={12}>
                      <Form.Item label="ຄ່າຄອມມິດຊັ່ນ" name="commission">
                        <InputNumber
                          size="middle"
                          style={{ width: "100%" }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value ? Number(value.replace(/\D/g, "")) : 0}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}

              <Col span={24}>
                <Form.Item
                  label="ຈຳນວນແຈ້ງເຕືອນ < ນ້ອຍກວ່າ"
                  name="notiQty"
                  rules={[{ required: true, message: "ກະລຸນາປ້ອນຈຳນວນ" }]}
                >
                  <InputNumber
                    size="middle"
                    style={{ width: "100%" }}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item label="ໝາຍເຫດ" name="note">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            size="large"
            block
            loading={createLoading || updateLoading}
            disabled={editMode && !isEditable}
          >
            {editMode ? "ບັນທຶກການແກ້ໄຂ" : "ບັນທຶກສິນຄ້າໃໝ່"}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateProduct;