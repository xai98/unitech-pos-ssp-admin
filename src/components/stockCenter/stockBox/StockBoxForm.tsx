import { Form, Input, InputNumber, message, Modal } from "antd";
import React from "react";
import { StockCenterFormProps } from "../../../types/stockCenter";
import { useMutation } from "@apollo/client";
import { CREATE_STOCK_BOX } from "../../../services";

const StockBoxForm: React.FC<StockCenterFormProps> = ({
  open,
  data,
  onCancel,
  refetch,
}) => {
  const [form] = Form.useForm();

  const [createStockBox, { loading: createLoading }] = useMutation(CREATE_STOCK_BOX, {
    onCompleted: () => {
      refetch();
      message.success("ສ້າງຖົງເກັບເຄື່ອງສຳເລັດ");
      onCancel();
    },
    onError: (error) => {
      message.error(`ເກີດຂໍ້ຜິດພາດ: ${error.message}`);
      console.error("Error creating stock center:", error.message);
    },
  });

  // ตั้งค่า initial values เมื่อ data เปลี่ยน
//   useEffect(() => {
//     if (data) {
//       form.setFieldsValue({
//         amountLimit: data.amountLimit || 0, // ปรับตามข้อมูลที่มี
//         amount: data.amount || 0,
//         details: data.details || "",
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      await createStockBox({
        variables: {
          data: { // ปรับชื่อ field ตาม schema (อาจต้องตรวจสอบ CREATE_STOCK_CENTER)
            stockCenterId: data?.id,
            ...values,
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
    <>
      <Modal
        title={`ສ້າງຖົງເກັບເຄື່ອງ: ${data?.productName || ""}`}
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
            label="ຈຳກັດຈຳນວນບັນຈຸ"
            name="amountLimit"
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
            label="ລາຍລະອຽດ"
            name="details"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StockBoxForm;