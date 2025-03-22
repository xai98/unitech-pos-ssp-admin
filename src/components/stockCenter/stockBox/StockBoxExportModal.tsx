import { Button, Descriptions, Form, message, Modal, Select } from "antd";
import React, { useMemo, useState } from "react";
import { StockBoxExportModalProps } from "../../../types/stockBoxTypes";
import { formatDate } from "../../../utils/helper";
import { TbPackageExport } from "react-icons/tb";
import { useMutation, useQuery } from "@apollo/client";
import { BRANCHS, EXPORT_STOCK_BOX } from "../../../services";

const { Option } = Select;

const StockBoxExportModal: React.FC<StockBoxExportModalProps> = ({
  stockCenter,
  selectStockBox,
  open,
  onCancel,
  refetchStockBox,
}) => {
  const [selectBranch, setSelectBranch] = useState("");

  const [exportStockBox, { loading }] = useMutation(EXPORT_STOCK_BOX, {
    onCompleted: () => {
      setSelectBranch("");
      message.success(`ນຳຖົງ ${selectStockBox?.boxNo || ""} ສຳເລັດ`);
      refetchStockBox();
      onCancel();
    },
  });

  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  const branchList = useMemo(() => {
    return branchData?.Branchs?.data || [];
  }, [branchData]);

  const handleSaveExport = async () => {
    if (loading) return;

    if (!selectBranch) {
      message.warning("ກະລຸນາເລືອກສາຂາກ່ອນ");
      return;
    }
    try {
      await exportStockBox({
        variables: {
          data: {
            stockCenterId: stockCenter?.id,
            status: "export",
          },
          where: {
            id: selectStockBox?.id,
          },
        },
      });
    } catch (error) {}
  };

  return (
    <>
      <Modal
        title={`ນຳຖົງ ${selectStockBox?.boxNo || ""} ລົງສາຂາ`}
        open={open}
        // onOk={handleOk}
        onCancel={onCancel}
        footer={null}
        confirmLoading={loading}
        loading={loading}
      >
        <Form.Item
          label="ເລືອກສາຂາ"
          name="branchId"
          rules={[{ required: true, message: "กรุณาเลือกสาขา" }]}
          style={{marginTop:20}}
        >
          <Select
            placeholder="ເລືອກສາຂາ"
            size="large"
            style={{ width: "100%" }}
            value={selectBranch}
            onChange={(value) => setSelectBranch(value)}
          >
            {/* Mock branches หรือดึงจาก API */}
            {branchList?.map((item: any) => (
              <Option value={item?.id} key={item?.item}>
                {item?.branchName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ຊື່ສິນຄ້າ">
            {stockCenter?.productName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="ປະເພດສິນຄ້າ">
            {stockCenter?.categoryId?.categoryName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="ລະຫັດຖົງ">
            {selectStockBox?.boxNo || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="ຈຳນວນເຄື່ອງໃນຖົງ">
            {selectStockBox?.amount
              ? selectStockBox?.amount.toLocaleString()
              : "0"}{" "}
            /{" "}
            {selectStockBox?.amountLimit
              ? selectStockBox?.amountLimit.toLocaleString()
              : "0"}
          </Descriptions.Item>

          <Descriptions.Item label="ລາຍລະອຽດ">
            {selectStockBox?.details || ""}
          </Descriptions.Item>

          <Descriptions.Item label="ວັນທີສ້າງ">
            {selectStockBox?.createdAt
              ? formatDate(selectStockBox?.createdAt)
              : ""}
          </Descriptions.Item>

          <Descriptions.Item label="ຜູ້ສ້າງ">
            {selectStockBox?.createdBy || ""}
          </Descriptions.Item>
        </Descriptions>

        <Button
          color="green"
          size="large"
          icon={<TbPackageExport />}
          onClick={handleSaveExport}
          block
          style={{ marginTop: 10 }}
          loading={loading}
        >
          ຢືນຢັນການນຳອອກ
        </Button>
      </Modal>
    </>
  );
};

export default StockBoxExportModal;
