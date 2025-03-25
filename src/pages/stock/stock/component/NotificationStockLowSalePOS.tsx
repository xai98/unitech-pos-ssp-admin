import { Card, Form, InputNumber, Button, Typography, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_NOTI_QTY_LOW_MANY_SALE_POS } from "../../../../services";
import { CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  product: any;
}

const NotificationStockLowSalePOS: React.FC<Props> = ({ product }) => {
  const [form] = Form.useForm();
  const [updateProduct, { loading }] = useMutation(UPDATE_NOTI_QTY_LOW_MANY_SALE_POS);

  // Sync form with product data
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        notiQtyPOS: product.notiQtyPOS || 0,
      });
    }
  }, [product, form]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    try {
      const { notiQtyPOS } = await form.validateFields();
      const updatedNotiQty = Math.max(0, notiQtyPOS); // Ensure non-negative


        // return;

      await updateProduct({
        variables: {
          data: { notiQtyPOS: updatedNotiQty },
          where: { id: product.id },
        },
      });

      message.success("ອັບເດດຂໍ້ມູນສຳເລັດ");
    } catch (error) {
      message.error("ການອັບເດດລົ້ມເຫຼວ");
      console.error(error);
    }
  }, [form, product, updateProduct]);

  return (
    <Card
      style={{
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text strong style={{ fontSize: 16, color: "#2E93fA" }}>
        ກຳນົດການແຈ້ງເຕືອນສິນຄ້າໝົດຂາຍໜ້າຮ້ານ
      </Text>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ notiQty: 0 }}
      >
        <Form.Item
          name="notiQtyPOS"
          label="ຈຳນວນແຈ້ງເຕືອນ (<)"
          rules={[
            { required: true, message: "ກະລຸນາປ້ອນຈຳນວນແຈ້ງເຕືອນ" },
            { type: "number", min: 0, message: "ຕ້ອງບໍ່ຕິດລົບ" },
          ]}
        >
          <InputNumber
            size="middle"
            placeholder="ປ້ອນຈຳນວນ"
            style={{ width: "100%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value ? Number(value.replace(/\D/g, "")) : 0}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSave}
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

export default NotificationStockLowSalePOS;