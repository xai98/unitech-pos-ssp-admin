import {
  Drawer,
  Form,
  Input,
  Space,
  message,
  Checkbox,
  Select,
  Modal,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import ButtonAction from "../../../../components/ButtonAction";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { CREATE_USER, DELETE_USER, UPDATE_USER } from "../../../../services";
import UploadImageOne from "../../../../components/UploadImageOne";
import { converGender } from "../../../../utils/helper";
import { consts } from "../../../../utils";
import styles from "../../../../styles/Component.module.css";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  editMode: boolean;
  refetch: () => void;
}

const CreateStaffAdmin: React.FC<Props> = ({
  open,
  onClose,
  data,
  editMode,
  refetch,
}) => {
  const [form] = Form.useForm();

  const [deleteData, { loading: deleteLoading }] = useMutation(DELETE_USER);
  const [createData, { loading: createLoading }] = useMutation(CREATE_USER);
  const [updateData, { loading: updateLoading }] = useMutation(UPDATE_USER);
  const { UploadImage, imageName, setImageName } = UploadImageOne();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (data && editMode) {
      setImageName(data.imageProfile);
      form.setFieldsValue(data);
    }
    setIsEdit(editMode);
  }, [data, editMode, form]);

  const onFinish = async (value: any) => {
    console.log(value);

    const dataForm = {
      ...value,
      imageProfile: imageName,
    };

    try {
      if (editMode) {
        const result = await updateData({
          variables: {
            data: dataForm,
            where: {
              id: data.id,
            },
          },
        });

        if (result?.data?.updateUser?.id) {
          message.success("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
        }
      } else {
        const result = await createData({
          variables: {
            data: dataForm,
          },
        });

        if (result?.data?.createUser?.id) {
          message.success("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        }
      }

      handleOnClose();
    } catch (error: any) {
      if (error?.message === "USER_ALREADY_EXIST") {
        return message.warning(`ຊື່ ${value.username} ມີແລ້ວໃນຖານຂໍ້ມູນ`);
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
          <Image
            width={70}
            style={{ borderRadius: "50%" }}
            src={
              data?.imageProfile
                ? consts.URL_PHOTO_AW3 + data?.imageProfile
                : "/logoMinipos.jpg"
            }
          />
          <div>
            ທ່ານຕ້ອງການລືບຂໍ້ມູນຂອງ{" "}
            <span style={{ color: "red" }}>
              {" "}
              {converGender(data?.gender)} {data?.firstName} {data?.lastName}
            </span>{" "}
            ນີ້ແທ້ ຫຼື ບໍ່?
          </div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ລືບ",
      cancelText: "ປິດອອກ",
      okType: "danger",
      onOk() {
        deleteUser();
      },
    });
  };

  const deleteUser = async () => {
    const result = await deleteData({
      variables: {
        where: {
          id: data?.id,
        },
      },
    });

    if (result?.data?.deleteUser?.id) {
      message.success("ລຶບຂໍ້ມູນສຳເລັດ");
      handleOnClose();
    }
  };

  const handleOnClose = () => {
    setIsEdit(false);
    form.resetFields();
    setImageName("");
    onClose();
    refetch();
  };

  return (
    <div>
      <Drawer
        title={editMode ? "ລາຍລະອຽດ" : "ເພີ່ມແອັດມິນໃໝ່"}
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
            <ButtonAction
              size="middle"
              label="ບັນທຶກ"
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={createLoading || updateLoading}
              disabled={isEdit}
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
          id="admin-form"
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
          disabled={isEdit}
        >
          <p style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
            ຂໍ້ມູນສ່ວນຕົວ
          </p>

          <Form.Item label="ຮູບໂປຣຟາຍ" style={{ margin: 0 }}>
            {/* {UploadImage()} */}

            {!isEdit ? (
              UploadImage()
            ) : (
              <div className={styles.boxUploadImage}>
                <Image
                  style={{ width: "100%", height: "100px", objectFit: "contain" }}
                  src={
                    data?.imageProfile
                      ? consts.URL_PHOTO_AW3 + data?.imageProfile
                      : "/logoMinipos.jpg"
                  }
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="ຊື່"
            name="firstName"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="firstName" />
          </Form.Item>

          <Form.Item
            label="ນາມສະກຸນ"
            name="lastName"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນນາມສະກຸນ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="lastName" />
          </Form.Item>

          <Form.Item
            label="ເພດ"
            name="gender"
            rules={[{ required: true, message: "ກະລຸນາເລືອກເພດ!" }]}
            style={{ margin: 0 }}
          >
            <Select placeholder="ເລືອກເພດ">
              <Option value="MALE">ຊາຍ</Option>
              <Option value="FEMALE">ຍິງ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ເບີໂທ"
            name="phone"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນເບີໂທ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="phone" />
          </Form.Item>

          <p style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
            ຂໍ້ມູນໃຊ້ເຂົ້າລະບົບ
          </p>

          <Form.Item
            label="ສິດນຳໃຊ້"
            name="role"
            rules={[{ required: true, message: "ກະລຸນາເລືອກສິດນຳໃຊ້!" }]}
            style={{ margin: 0 }}
          >
            <Select placeholder="ເລືອກສິດນຳໃຊ້">
              <Option value="ADMIN">ແອັດມິນສູນໃຫ່ຍ</Option>
              <Option value="ADMIN_BRANCH">ແອັດມິນສາຂາ</Option>
              <Option value="ACCOUNTING">ພະນັກງານບັນຊີ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ຊື່ເຂົ້າໃຊ້ລະບົບ"
            name="username"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ເຂົ້າໃຊ້ລະບົບ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="ລະຫັດຜ່ານ"
            name="password"
            rules={[{ required: !editMode, message: "ກະລຸນາປ້ອນລະຫັດຜ່ານ!" }]}
            style={{ margin: 0 }}
          >
            <Input autoComplete="password" />
          </Form.Item>

          <Form.Item label="ໝາຍເຫດ" name="note" style={{ margin: 0 }}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateStaffAdmin;
