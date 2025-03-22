import type { FormProps } from "antd";
import { Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import ButtonAction from "../../../components/ButtonAction";
import { useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";
import { consts } from "../../../utils";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../../services";

type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
};

const FormLogin: React.FC = () => {
  const navigate = useNavigate();
  const [userLogin, { loading: isLoading }] = useMutation(LOGIN);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const response = await userLogin({
        variables: {
          data: {
            username: values.username,
            password: values.password,
          },
        },
      });

      if (response?.data?.login?.accessToken && response?.data?.login?.data) {
        localStorage.setItem(
          consts.USER_KEY,
          JSON.stringify(response?.data?.login?.data)
        );
        localStorage.setItem(
          consts.USER_TOKEN,
          response?.data?.login?.accessToken
        );
        message.success("ເຂົ້າລະບົບສຳເລັດ");

        if (response?.data?.login?.data?.role === "ACCOUNTING") {
          navigate(routes.STOCK_BRANCH + "/filter");
        } else {
          navigate(routes.REPORT_DASHBOARD);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("ຊື່ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      size="large"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ເຂົ້າລະບົບ" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="ຊື່ເຂົ້າລະບົບ"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "ກະລຸນາປ້ອນລະຫັດຜ່ານ" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="ລະຫັດຜ່ານ"
        />
      </Form.Item>
      <div style={{ height: 10 }}></div>

      <Form.Item>
        <ButtonAction
          size="large"
          label="ເຂົ້າສູ່ລະບົບ"
          onClick={() => console.log("Clicked")}
          htmlType="submit"
          type="primary"
          style={{ backgroundColor: "#1976d2" }}
          loading={isLoading}
        />
      </Form.Item>
      <div style={{ height: 10 }}></div>

      <span style={{ color: "lightgray" }}>version 0.0.1</span>
    </Form>
  );
};

export default FormLogin;
