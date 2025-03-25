import {
  Drawer,
  Form,
  Input,
  Space,
  FormProps,
  message,
  Checkbox,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import ButtonAction from "../../../../components/ButtonAction";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  CREATE_CATEOGRY,
  DELETE_CATEOGRY,
  UPDATE_CATEOGRY,
} from "../../../../services";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  editMode: boolean;
  refetch: () => void;
}

const CreateCategory: React.FC<Props> = ({
  open,
  onClose,
  data,
  editMode,
  refetch,
}) => {
  const [form] = Form.useForm();

  const [createData, { loading: createLoading }] = useMutation(CREATE_CATEOGRY);
  const [updateData, { loading: updateLoading }] = useMutation(UPDATE_CATEOGRY);
  const [deleteData, { loading: deleteLoading }] = useMutation(DELETE_CATEOGRY);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (data && editMode) {
      form.setFieldsValue(data);
    }
    setIsEdit(editMode);
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

        if (result?.data?.updateCategory?.id) {
          message.success("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
        }
      } else {
        const result = await createData({
          variables: {
            data: values,
          },
        });

        if (result?.data?.createCategory?.id) {
          message.success("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        }
      }

      handleOnClose();
    } catch (error: any) {
      if (error?.message === "HAVE_ALREADY_EXIST") {
        return message.warning(
          `ຊື່ປະເພດສິນຄ້າ ${values.categoryName} ມີແລ້ວໃນຖານຂໍ້ມູນ`
        );
      } else {
        return message.error("ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
      }
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "ຢືນຢັນການລຶບຂໍ້ມູນ",
      content: (
        <div>
          <div>
            ທ່ານຕ້ອງການລືບຂໍ້ມູນ{" "}
            <span style={{ color: "red" }}>{data?.categoryName}</span> ນີ້ແທ້
            ຫຼື ບໍ່?
          </div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ລືບ",
      cancelText: "ປິດອອກ",
      okType: "danger",
      async onOk() {
        await deleteData({
          variables: {
            where: {
              id: data.id,
            },
          },
        });

        await handleOnClose();
        message.success("ລຶບລາຍການສຳລັດ");
      },
    });
  };

  const handleOnClose = () => {
    setIsEdit(false);
    form.resetFields();
    onClose();
    refetch();
  };
  return (
    <div>
      <Drawer
        title="ເພີ່ມປະເພດສິນຄ້າໃໝ່"
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
            <ButtonAction
              size="middle"
              label="ລຶບ"
              type="primary"
              onClick={handleDelete}
              htmlType="button"
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: "red",
                display: !editMode ? "none" : "",
              }}
              loading={createLoading || updateLoading}
              disabled={deleteLoading}
              form="admin-form"
            />
          </Space>
        }
      >
        <Checkbox
          checked={isEdit}
          onChange={(e) => setIsEdit(e.target.checked)}
          style={{ display: !editMode ? "none" : "" }}
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
            label="ຊື່ປະເພດສິນຄ້າ"
            name="categoryName"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ປະເພດສິນຄ້າ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="categoryName" />
          </Form.Item>

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

export default CreateCategory;
