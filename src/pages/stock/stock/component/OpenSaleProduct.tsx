import { Card, Form, Switch, Typography, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_IS_SHOW_SALE_PRODUCT } from "../../../../services";

const { Text } = Typography;

interface Props {
  product: any;
  setProduct: (value: any) => void;
}

const OpenSaleProduct: React.FC<Props> = ({ product, setProduct }) => {
  const [form] = Form.useForm();
  const [updateProduct, { loading }] = useMutation(UPDATE_IS_SHOW_SALE_PRODUCT);

  // Sync form with product data
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        isShowSale: product.isShowSale || false,
      });
    }
  }, [product, form]);

  // Handle switch change
  const handleCheck = useCallback(
    async (checked: boolean) => {
      try {
        const result = await updateProduct({
          variables: {
            data: { isShowSale: checked },
            where: { id: product?.id },
          },
        });

        if (result?.data) {
          setProduct({ ...product, isShowSale: checked });
          message.success(`ການຂາຍຖືກ${checked ? "ເປີດ" : "ປິດ"}ສຳເລັດ`);
        }
      } catch (error) {
        message.error("ການອັບເດດລົ້ມເຫຼວ");
        form.setFieldsValue({ isShowSale: product.isShowSale }); // Revert on error
        console.error(error);
      }
    },
    [form, product, setProduct, updateProduct]
  );

  return (
    <Card
      style={{
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text strong style={{ fontSize: 16, color: "#2E93fA" }}>
        ການຕັ້ງຄ່າການຂາຍ
      </Text>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ isShowSale: false }}
      >
        <Form.Item
          name="isShowSale"
          label="ເປີດການຂາຍທຸກສາຂາ"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="ເປີດ"
            unCheckedChildren="ປິດ"
            onChange={handleCheck}
            disabled={loading}
            style={{ backgroundColor: form.getFieldValue("isShowSale") ? "#2E93fA" : "#d9d9d9" }}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OpenSaleProduct;