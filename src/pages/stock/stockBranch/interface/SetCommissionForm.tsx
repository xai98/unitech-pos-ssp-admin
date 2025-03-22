import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Modal, InputNumber, message } from "antd";
import styled from "styled-components";
import { UPDATE_COMMISSION_BRANCH_STOCK } from "../../../../services";
import { consts } from "../../../../utils";

// Styled Components
const ModalContainer = styled.div`
  padding: 16px 0;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
`;

const InputWrapper = styled.div`
  margin-top: 16px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
  font-weight: 500;
`;

// Interfaces
interface Stock {
  id: string;
  productName: string;
  commission: number;
  productId: {
    image: string;
  };
}

interface Props {
  data: Stock | null;
  show: boolean;
  onClose: () => void;
  loadListStock: () => void;
}

const SetCommissionForm: React.FC<Props> = ({ data, show, onClose, loadListStock }) => {
  const [updateStock, { loading: updateLoading }] = useMutation(
    UPDATE_COMMISSION_BRANCH_STOCK,
    {
      onCompleted: () => {
        loadListStock();
        message.success("ແກ້ໄຂຄ່າຄອມສຳເລັດ");
        onClose();
      },
      onError: (error) => {
        if (error.message === "NOT_FOUND") {
          message.warning("ບໍ່ພົບສິນຄ້ານີ້ໃນສະຕ໋ອກ");
        } else {
          message.error(`ລອງໃໝ່ອີກຄັ້ງ: ${error.message}`);
        }
      },
    }
  );

  const [commission, setCommission] = useState<number>(0);

  useEffect(() => {
    if (show && data) {
      setCommission(data.commission || 0);
    }
  }, [show, data]);

  const handleSave = async () => {
    if (updateLoading) return;

    if (commission < 0 || commission === null) {
      message.warning("ກະລຸນາປ້ອນຄ່າຄອມມິດຊັ່ນທີ່ຖືກຕ້ອງ");
      return;
    }

    try {
      await updateStock({
        variables: {
          data: { commission },
          where: { id: data?.id },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 18, fontWeight: 600 }}>
          ກຳນົດຄ່າຄອມ: {data?.productName}
        </span>
      }
      open={show}
      onOk={handleSave}
      onCancel={onClose}
      okText="ຢືນຢັນ"
      cancelText="ຍົກເລີກ"
      confirmLoading={updateLoading}
      width={400}
      style={{ top: 20 }}
      bodyStyle={{ padding: "16px 24px" }}
    >
      <ModalContainer>
        <ProductImage
          src={data?.productId?.image ? `${consts.URL_PHOTO_AW3}${data.productId.image}` : "/logoMinipos.jpg"}
          alt={data?.productName || "product"}
        />
        
        <InputWrapper>
          <Label>ຄ່າຄອມມິດຊັ່ນ (ບາດ/ໜ່ວຍ)</Label>
          <InputNumber
            size="large"
            min={0}
            value={commission}
            onChange={(value) => setCommission(value || 0)}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            style={{ width: "100%", borderRadius: 6 }}
            placeholder="ປ້ອນຄ່າຄອມມິດຊັ່ນ"
            disabled={updateLoading}
          />
        </InputWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default SetCommissionForm;