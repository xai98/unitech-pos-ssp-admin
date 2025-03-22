import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Input, InputRef, message, Modal } from "antd";
import styled from "styled-components";
import { MdOutlineCancel } from "react-icons/md";
import { CiSaveDown1 } from "react-icons/ci";
import { StockBoxImportProps } from "../../../types/stockBoxTypes";
import { convertStatusStockBox } from "../../../utils/helper";
import { useMutation } from "@apollo/client";
import { UPDATE_STOCK_BOX } from "../../../services";

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #595959;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #1a1a1a;
  margin-top: 4px;
`;

const StyledInput = styled(Input)`
  border-radius: 6px;
  margin-bottom: 24px;
  padding: 8px 12px;
`;

const AmountCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: 600;
  height: 140px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  color: #1a1a1a;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${({ type }) =>
    type === "dashed" &&
    `
    border-color: #52c41a;
    color: #52c41a;
    &:hover, &:focus {
      border-color: #73d13d !important;
      color: #73d13d !important;
    }
  `}
  ${({ danger }) =>
    danger &&
    `
    background: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
    &:hover, &:focus {
      background: #ff7875 !important;
      border-color: #ff7875 !important;
    }
  `}
`;

const StockBoxImport: React.FC<StockBoxImportProps> = ({
  selectStockBox,
  stockCenter,
  setSelectStockBox,
  setIsImportStockBox,
  refetchStockBox,
}) => {
  const [barcode, setBarcode] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const [updateStockBox, { loading: updateLoading }] = useMutation(
    UPDATE_STOCK_BOX,
    {
      onCompleted: () => {
        if (selectStockBox?.boxNo)
          localStorage.removeItem(selectStockBox.boxNo);
        setCurrentAmount(0);
        setSelectStockBox(null);
        setIsImportStockBox(false);
        refetchStockBox();
        message.success("ເພີ່ມເຄື່ອງເຂົ້າຖົງສຳເລັດ");
      },
      onError: (error) => {
        message.error("ການສ້າງສະຕ໋ອກລົ້ມເຫຼວ");
        console.error("Update error:", error);
      },
    }
  );

  // Memoized formatNumber
  const formatNumber = useMemo(
    () => (num?: number) => num?.toLocaleString("th-TH") || "0",
    []
  );

  // Memoized display data
  const displayData = useMemo(
    () => ({
      boxNo: selectStockBox?.boxNo || "N/A",
      amount: formatNumber(selectStockBox?.amount),
      amountLimit: formatNumber(selectStockBox?.amountLimit),
      status: convertStatusStockBox(selectStockBox?.status || ""),
    }),
    [
      selectStockBox?.boxNo,
      selectStockBox?.amount,
      selectStockBox?.amountLimit,
      selectStockBox?.status,
      formatNumber,
    ]
  );

  const handleScan = useCallback(
    async (barcodeValue: string) => {
      if (![12, 13].includes(barcodeValue.length)) {
        message.error("Barcode ບໍ່ຖືກຮູບແບບ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
        return;
      }

      if (!selectStockBox) {
        message.error("ກະລຸນາເລືອກຖົງກ່ອນ");
        return;
      }

      if (selectStockBox.status !== "ready") {
        message.error("ຖົງຕ້ອງຢູ່ໃນສະຖານະ: ພ້ອມໃຊ້ງານ ເທົ່ານັ້ນ");
        return;
      }

      if (stockCenter?.productBarcode !== barcodeValue) {
        message.warning("ບາໂຄ້ດສິນຄ້າບໍ່ຕົງກັນ ກະລະນາກວດສອບຄືນ");
        return;
      }

      setIsLoading(true);
      const boxNo = selectStockBox.boxNo;
      const storedAmount = localStorage.getItem(boxNo);
      const newAmount =
        (storedAmount ? parseInt(storedAmount, 10) : currentAmount) + 1;

      if (newAmount > (selectStockBox.amountLimit || Infinity)) {
        message.warning("ຖົງບັນຈຸເຕັມແລ້ວ");
        setIsLoading(false);
        setBarcode("");
        inputRef.current?.focus();
        return;
      }

      setCurrentAmount(newAmount);
      localStorage.setItem(boxNo, newAmount.toString());
      message.success(`ເພີ່ມສິນຄ້າເຂົ້າຖົງ: ${boxNo}`);
      setIsLoading(false);
      setBarcode("");
      inputRef.current?.focus();
    },
    [selectStockBox, stockCenter?.productBarcode, currentAmount]
  );

  // Load initial amount from selectStockBox
  useEffect(() => {
    if (selectStockBox?.boxNo) {
      const storedAmount = localStorage.getItem(selectStockBox.boxNo);
      setCurrentAmount(
        storedAmount ? parseInt(storedAmount, 10) : selectStockBox.amount || 0
      );
      inputRef.current?.focus();
    }
  }, [selectStockBox]);

  // Barcode scanner effect
  useEffect(() => {
    let buffer = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!/[a-zA-Z0-9]/.test(e.key)) return;
      buffer += e.key;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if ([12, 13].includes(buffer.length)) handleScan(buffer);
        buffer = "";
      }, 100);
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeout);
    };
  }, [handleScan]);

  const handleSave = useCallback(() => {
    if (!selectStockBox) {
      message.error("ກະລຸນາເລືອກຖົງກ່ອນ");
      return;
    }

    Modal.confirm({
      title: "ຢືນຢັນເຄື່ອງເຂົ້າຖົງ",
      content: `ທ່ານຕ້ອງການຢືນຢັນເຄື່ອງເຂົ້າຖົງ ${selectStockBox.boxNo} ແທ້ ຫຼື ບໍ່?`,
      okText: "ຢືນຢັນ",
      cancelText: "ປິດອອກ",
      onOk: () =>
        updateStockBox({
          variables: {
            data: { stockCenterId: stockCenter?.id, amount: currentAmount },
            where: { id: selectStockBox.id },
          },
        }),
    });
  }, [selectStockBox, stockCenter?.id, currentAmount, updateStockBox]);

  const resetStorage = useCallback(() => {
    if (!selectStockBox) return;
    Modal.confirm({
      title: "ຢືນຢັນຍົກເລິກ",
      content: `ຕ້ອງການຍົກເລິກເຄື່ອງເຂົ້າຖົງ ${selectStockBox.boxNo} ແທ້ບໍ່?`,
      okText: "ຢືນຢັນ",
      cancelText: "ປິດອອກ",
      onOk: () => {
        localStorage.removeItem(selectStockBox.boxNo);
        setCurrentAmount(0);
        setSelectStockBox(null);
        setIsImportStockBox(false);
        message.success("ຍົກເລິກສຳເລັດ");
      },
    });
  }, [selectStockBox, setSelectStockBox, setIsImportStockBox]);

  return (
    <Container>
      <Header>
        <Title>ນຳເຄື່ອງເຂົ້າຖົງ</Title>
        <ActionButton
          // danger
          disabled={isLoading}
          onClick={resetStorage}
          icon={<MdOutlineCancel />}
        >
          ຍົກເລິກ
        </ActionButton>
      </Header>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>ລະຫັດຖົງ</InfoLabel>
          <InfoValue>{displayData.boxNo}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>ຈຳນວນມີໃນຖົງ</InfoLabel>
          <InfoValue>{displayData.amount}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>ຈຳນວນທີ່ບັນຈຸໄດ້</InfoLabel>
          <InfoValue>{displayData.amountLimit}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>ສະຖານະ</InfoLabel>
          <InfoValue>{displayData.status}</InfoValue>
        </InfoItem>
      </InfoGrid>

      <StyledInput
        ref={inputRef}
        placeholder="ສະແກນເຄື່ອງເຂົ້າຖົງ..."
        size="large"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onPressEnter={() => handleScan(barcode)}
        disabled={isLoading}
        allowClear
      />

      <AmountCard>
        {formatNumber(currentAmount)} / {displayData.amountLimit}
      </AmountCard>

      <ActionButton
        type="dashed"
        size="large"
        block
        disabled={updateLoading || currentAmount === 0}
        onClick={handleSave}
        icon={<CiSaveDown1 />}
      >
        ບັນທຶກ
      </ActionButton>
    </Container>
  );
};

export default React.memo(StockBoxImport);
