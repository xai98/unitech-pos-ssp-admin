import { Form, Input, InputNumber, message, Modal } from "antd";
import React, { useEffect } from "react";
import { StockCenterFormProps } from "../../../types/stockCenter";
import { useMutation } from "@apollo/client";
import { CREATE_STOCK_CENTER } from "../../../services";

const StockCenterForm: React.FC<StockCenterFormProps> = ({
  open,
  data,
  onCancel,
  refetch,
}) => {
  const [form] = Form.useForm();

  const [createStockCenter, { loading: createLoading }] = useMutation(CREATE_STOCK_CENTER, {
    onCompleted: () => {
      refetch();
      message.success("ສ້າງສະຕ໋ອກສິນຄ້າສຳເລັດ");
      onCancel();
    },
    onError: (error) => {
      message.error(`ເກີດຂໍ້ຜິດພາດ: ${error.message}`);
      console.error("Error creating stock center:", error.message);
    },
  });

  // ตั้งค่า initial values เมื่อ data เปลี่ยน
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        minStock: data.minStock || 0, // ปรับตามข้อมูลที่มี
        maxStock: data.maxStock || 0,
        details: data.details || "",
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      await createStockCenter({
        variables: {
          data: { // ปรับชื่อ field ตาม schema (อาจต้องตรวจสอบ CREATE_STOCK_CENTER)
            productId: data?.id, // เพิ่มจาก data ที่ส่งมา
            categoryId: data.categoryId.id,
            productName: data.productName,
            productBarcode: data.barcode,
            minStock: values.minStock,
            maxStock: values.maxStock,
            details: values.details,
          },
        },
      });


    } catch (error) {
      message.error("ການສ້າງສະຕ໋ອກລົ້ມເຫຼວ");
      console.error("Failed to submit:", error);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  return (
    <div>
      <Modal
        title={`ສ້າງສະຕ໋ອກສິນຄ້າ: ${data?.productName || ""}`}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        cancelText={"ຍົກເລິກ"}
        okText={"ຢືນຢັນການສ້າງ"}
        confirmLoading={createLoading}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="ກຳນົດຈຳນວນໜ້ອຍສຸດ"
            name="minStock"
            rules={[
              {
                required: true,
                type: "number",
                message: "ກະລຸນາປ້ອນຈຳວນ!",
              },
            ]}
            style={{ marginBottom: 16 }} // ปรับ margin ให้ดูดีขึ้น
          >
            <InputNumber
              size="middle"
              autoComplete="off"
              placeholder="ປ້ອນຈຳນວນ"
              style={{ width: "100%" }}
              min={0} // เพิ่มเพื่อป้องกันค่าติดลบ
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any} // เพิ่ม parser
            />
          </Form.Item>
          <Form.Item
            label="ກຳນົດຈຳນວນຫຼາຍສຸດ"
            name="maxStock"
            rules={[
              {
                required: true,
                type: "number",
                message: "ກະລຸນາປ້ອນຈຳວນ!",
              },
              {
                validator: (_, value) =>
                  value >= form.getFieldValue("minStock")
                    ? Promise.resolve()
                    : Promise.reject("ຈຳນວນຫຼາຍສຸດຕ້ອງຫຼາຍກວ່າຈຳນວນໜ້ອຍສຸດ"),
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              size="middle"
              autoComplete="off"
              placeholder="ປ້ອນຈຳນວນ"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
          <Form.Item
            label="ລາຍລະອຽດ"
            name="details"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockCenterForm;