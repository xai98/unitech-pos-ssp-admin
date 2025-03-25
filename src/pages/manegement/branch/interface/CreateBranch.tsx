import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  FormProps,
  message,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import ButtonAction from "../../../../components/ButtonAction";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { CREATE_BRANCH, UPDATE_BRANCH } from "../../../../services";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  editMode: boolean;
  refetch: () => void;
}

const CreateBranch: React.FC<Props> = ({
  open,
  onClose,
  data,
  editMode,
  refetch,
}) => {
  const [form] = Form.useForm();

  const [createData, { loading: createLoading }] = useMutation(CREATE_BRANCH);
  const [updateData, { loading: updateLoading }] = useMutation(UPDATE_BRANCH);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (data && editMode) {
      form.setFieldsValue(data);
    }
    setIsEdit(editMode)
  }, [data, editMode, form]);

  const onFinish: FormProps["onFinish"] = async (values) => {

    try {
      if (editMode) {
        const result = await updateData({
          variables: {
            data: values,
            where: {
              id: data.id,
            },
          },
        });

        if (result?.data?.updateBranch?.id) {
          message.success("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
        }
      } else {
        const result = await createData({
          variables: {
            data: values,
          },
        });

        if (result?.data?.createBranch?.id) {
          message.success("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        }
      }

      refetch();
      handleOnClose();
    } catch (error: any) {
      if (error?.message === "NAME_IS_ALREADY_EXIST") {
        return message.warning(`ຊື່ບໍລິສັດ ${values.name} ມີແລ້ວໃນຖານຂໍ້ມູນ`);
      } else {
        return message.error("ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
      }
    }
  };

  const handleOnClose = () => {
    setIsEdit(false)
    form.resetFields();
    onClose();
  }

  return (
    <div>
      <Drawer
        title="ສ້າງສາຂາໃໝ່"
        width={400}
        onClose={handleOnClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={handleOnClose}>ປິດອອກ</Button>
          </Space>
        }
      >
        <Checkbox
          checked={isEdit}
          onChange={(e) => setIsEdit(e.target.checked)}
          style={{ display: !editMode ? 'none' : "" }}
        >
          ແກ້ໄຂຂໍ້ມູນ
        </Checkbox>

        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
        //   initialValues={data}
          onFinish={onFinish}
          autoComplete="off"
          disabled={isEdit}
        >
          <Form.Item
            label="ຊື່ສາຂາ"
            name="branchName"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ສາຂາ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="branchName" />
          </Form.Item>

          <Row gutter={10}>
   
            <Col span={12}>
              <Form.Item
                label="ຕົວຫຍໍ້ອັງລາວ"
                name="code_la"
                rules={[
                  { required: true, message: "ກະລຸນາປ້ອນຕົວຫຍໍ້ລາວ!" },
                ]}
                style={{ margin: 0 }}
              >
                <Input autoComplete="code_la" />
              </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                label="ຕົວຫຍໍ້ອັງກິດ"
                name="code"
                rules={[{ required: true, message: "ກະລຸນາປ້ອນຕົວຫຍໍ້ອັງກິດ!" }]}
                style={{ margin: 0 }}
              >
                <Input autoComplete="code" />
              </Form.Item>
           
            </Col>
          </Row>

          <Form.Item label="ໝາຍເຫດ" name="note" style={{ margin: 0 }}>
            <Input.TextArea />
          </Form.Item>
          <div style={{ height: 20 }}></div>
          <ButtonAction
            size="large"
            label="ບັນທຶກ"
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={createLoading || updateLoading}
            disabled={isEdit}
          />
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateBranch;
