import { Col, Form, InputNumber, message, Row, Spin } from "antd";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EXCHANGE, UPDATE_EXCHANGE } from "../../../services";
import ButtonAction from "../../../components/ButtonAction";
import { CiSaveDown2 } from "react-icons/ci";
import { useEffect } from "react";
import { formatDate } from "../../../utils/helper";

function ExchangePage() {
  const [form] = Form.useForm();

  const [updateExchange, { loading: updateLoading }] =
    useMutation(UPDATE_EXCHANGE);

  const {
    data: exchangeData,
    loading,
    refetch,
  } = useQuery(GET_EXCHANGE, {
    fetchPolicy: "cache-and-network",
    variables: {
      where: { id: "65b2942c5e78b15103dee837" },
    },
  });

  useEffect(() => {
    if (exchangeData?.exchangeRate) {
      form.setFieldsValue({
        bath: exchangeData?.exchangeRate?.bath,
        cny: exchangeData?.exchangeRate?.cny,
        usd: exchangeData?.exchangeRate?.usd,
      });
    }
  }, [exchangeData?.exchangeRate]);

  const _handleSave = async (value: any) => {
    try {
      if (updateLoading) return;

      const result = await updateExchange({
        variables: {
          data: value,
          where: {
            id: "65b2942c5e78b15103dee837",
          },
        },
      });

      if (result?.data?.createExchangeRate) {
        message.success("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
        refetch();
      }
    } catch (error) {
      console.log("error--->", error);
      message.error("ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
    }
  };

  return (
    <div>
      <TextHeader>ຕັ້ງຄ່າອັດຕາແລກປ່ຽນ</TextHeader>
      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Row>
          <Col span={10}>
            <BoxContainer>
              <Form
                form={form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                onFinish={_handleSave}
                autoComplete="off"
              >
                <Form.Item
                  name="bath"
                  label="ເງິນບາດ"
                  rules={[
                    { required: true, message: "ກະລຸນາປ້ອນເງິນບາດ!" },
                    { type: "number", message: "ກະລຸນາປ້ອນເລກເທົ່ານັ້ນ!" },
                  ]}
                >
                  <InputNumber
                    autoComplete="off"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="cny"
                  label="ເງິນຢວນ"
                  rules={[
                    { required: true, message: "ກະລຸນາປ້ອນເງິນຢວນ!" },
                    { type: "number", message: "ກະລຸນາປ້ອນເລກເທົ່ານັ້ນ!" },
                  ]}
                >
                  <InputNumber
                    autoComplete="off"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="usd"
                  label="ເງິນໂດລາ"
                  rules={[
                    { required: true, message: "ກະລຸນາປ້ອນເງິນໂດລາ!" },
                    { type: "number", message: "ກະລຸນາປ້ອນເລກເທົ່ານັ້ນ!" },
                  ]}
                >
                  <InputNumber
                    autoComplete="off"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <div style={{ height: 20 }}></div>
                <ButtonAction
                  size="large"
                  label="ບັນທຶກ"
                  type="primary"
                  htmlType="submit"
                  icon={<CiSaveDown2 />}
                  loading={updateLoading}
                />
              </Form>
              <div style={{ height: 20 }}></div>
              <div>
                ຊື່ຜູ້ແກ້ໄຂລ່າສຸດ: {exchangeData?.exchangeRate?.updatedBy}
              </div>
              <div>
                ວັນທີອັບເດດລ່າສຸດ:{" "}
                {formatDate(exchangeData?.exchangeRate?.updatedAt)}
              </div>
            </BoxContainer>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default ExchangePage;
