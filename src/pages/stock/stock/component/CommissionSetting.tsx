import { Card, Form, InputNumber, Switch, Button, Typography, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_COMMISSION_MANY_PRODUCTS } from "../../../../services";
import { CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  product: any;
  setProduct: (value: any) => void;
}

const CommissionSetting: React.FC<Props> = ({ product, setProduct }) => {
  const [form] = Form.useForm();
  const [updateProduct, { loading }] = useMutation(UPDATE_COMMISSION_MANY_PRODUCTS);

  // Sync form with product data
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        isCommission: product.isCommission || false,
        commission: product.commission || 0,
      });
    }
  }, [product, form]);

  // Handle form submission
  const handleUpdate = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const data = {
        isCommission: values.isCommission,
        commission: values.commission,
      };

      const result = await updateProduct({
        variables: {
          data,
          where: { id: product.id },
        },
      });

      if (result?.data) {
        setProduct({ ...product, ...data });
        message.success("ອັບເດດຂໍ້ມູນສຳເລັດ");
      }
    } catch (error) {
      message.error("ການອັບເດດລົ້ມເຫຼວ");
      console.error(error);
    }
  }, [form, product, setProduct, updateProduct]);

  return (
    <Card
      style={{
        padding: 16 ,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text strong style={{ fontSize: 16, color: "#2E93fA" }}>
        ກຳນົດຄ່າຄອມມິດຊັ່ນ
      </Text>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ isCommission: false, commission: 0 }}
      >
        <Form.Item
          name="isCommission"
          label="ເປີດໃຫ້ຄ່າຄອມທຸກສາຂາ"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="ເປີດ"
            unCheckedChildren="ປິດ"
            style={{ backgroundColor: form.getFieldValue("isCommission") ? "#2E93fA" : "#d9d9d9" }}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.isCommission !== curr.isCommission}
        >
          {({ getFieldValue }) =>
            getFieldValue("isCommission") && (
              <Form.Item
                name="commission"
                label="ຄ່າຄອມມິດຊັ່ນ (ກີບ)"
                rules={[
                  { required: true, message: "ກະລຸນາປ້ອນຄ່າຄອມມິດຊັ່ນ" },
                  { type: "number", min: 0, message: "ຕ້ອງບໍ່ຕິດລົບ" },
                ]}
              >
                <InputNumber
                  size="middle"
                  placeholder="ປ້ອນຈຳນວນເງິນ"
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value ? Number(value.replace(/\D/g, "")) : 0}
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleUpdate}
            loading={loading}
            block
          >
            ຢືນຢັນການອັບເດດ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CommissionSetting;