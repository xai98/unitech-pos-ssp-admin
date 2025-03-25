import { Form, InputNumber, Modal, Typography, Button, Radio, Flex } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";

// import { formatNumber, textLength } from "../../../../utils/helper";
import { PrinterOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
}

const PrintBarcode: React.FC<Props> = ({ open, onClose, data }) => {
  const [form] = Form.useForm();
  const printComponentRef = useRef<HTMLDivElement>(null);
  // Track form values in state to ensure they're up to date
  const [formValues, setFormValues] = useState({ qtyPrint: 1, columns: 3 });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      const initialValues = { qtyPrint: 1, columns: 3 };
      form.setFieldsValue(initialValues);
      setFormValues(initialValues);
    }
  }, [open, form]);

  // Handle close
  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  // Create a single barcode preview
  const singleBarcodePreview = useMemo(
    () => (
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Text strong>{data?.productName || "-"}</Text>
        <div style={{ margin: "4px 0" }}>
          <Text>{formatNumber(data?.price_sale || 0)} ກີບ</Text>
        </div>
        <Barcode
          value={data?.barcode || "0000000000000"}
          width={2}
          height={80}
          displayValue={true}
          format="EAN13"
          fontSize={14}
        />
      </div>
    ),
    [data]
  );

  // Update formValues whenever form values change
  const handleValuesChange = (_: any, allValues: any) => {
    setFormValues(allValues);
  };

  // Function to handle print - ensures we have latest values
  const handlePrint = () => {
    // Get the latest form values before printing
    const latestValues = form.getFieldsValue();
    // Update state with latest values
    setFormValues(latestValues);
  };

  return (
    <Modal
      title={<Title level={4}>{data?.productName || "ພິມບາໂຄດ"}</Title>}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
    >
      {singleBarcodePreview}

      <Form
        form={form}
        layout="vertical"
        initialValues={{ qtyPrint: 1, columns: 3 }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="qtyPrint"
          label="ຈຳນວນທີ່ຕ້ອງການພິມ"
          rules={[
            { required: true, message: "ກະລຸນາປ້ອນຈຳນວນ" },
            { type: "number", min: 1, message: "ຕ້ອງຫຼາຍກວ່າ 0" },
          ]}
        >
          <InputNumber
            size="large"
            placeholder="ປ້ອນຈຳນວນ"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => (value ? Number(value.replace(/\D/g, "")) : 0)}
          />
        </Form.Item>

        <Form.Item
          name="columns"
          label="ຈຳນວນຖັນ"
          rules={[{ required: true, message: "ກະລຸນາເລືອກຈຳນວນຖັນ" }]}
        >
          <Radio.Group buttonStyle="solid" size="large">
            <Radio.Button value={1}>1 ຖັນ</Radio.Button>
            <Radio.Button value={2}>2 ຖັນ</Radio.Button>
            <Radio.Button value={3}>3 ຖັນ</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <ReactToPrint
          trigger={() => (
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              size="large"
              block
              onClick={handlePrint}
            >
              ພິມບາໂຄດ
            </Button>
          )}
          content={() => printComponentRef.current}
          onBeforeGetContent={() => {
            // Additional safeguard - update formValues right before printing
            const currentValues = form.getFieldsValue();
            setFormValues(currentValues);
            return Promise.resolve();
          }}
        />
      </Form>

      <div style={{ display: "none" }}>
        <div ref={printComponentRef}>
          <PrintContent
            data={data}
            qtyPrint={formValues.qtyPrint}
            columns={formValues.columns}
          />
        </div>
      </div>
    </Modal>
  );
};

// Utility function to truncate text based on columns
const textLength = (text: string, maxLength: number) => {
  return text && text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

// Utility function to format number with thousand separators
const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};

interface PrintContentProps {
  data: {
    id?: string;
    productName?: string;
    price_sale?: number;
    barcode?: string;
  };
  qtyPrint: number;
  columns: number;
}

const PrintContent: React.FC<PrintContentProps> = ({
  data,
  qtyPrint,
  // columns,
}) => {


  return (
    <div>
     {Array(qtyPrint)
          .fill(null)
          .map((_, index) => (
            <Flex
              style={{
                margin: "0mm 2mm",
                width: "100mm",
              }}
              key={index}
            >
              <div
                key={data?.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  lineHeight: "15px",
                  width: "30mm",
                  height: "20mm",
                  marginTop: "2mm",
                  marginBottom: "2mm",
                  marginRight: "2mm",
                  paddingTop: "10px",
                }}
              >
                <span style={{ fontSize: 11 }}>
                  {data?.productName
                    ? textLength(data?.productName, 25)
                    : ""}
                </span>
                <span style={{ fontSize: 11 }}>
                  {formatNumber(data?.price_sale || 0)} ກີບ
                </span>
                <img
                  alt="Barcode Generator TEC-IT"
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${data?.barcode}&code=EAN13`}
                  style={{ width: "100px", height: "40px" }}
                />
              </div>

              <div
                key={data?.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  lineHeight: "15px",
                  width: "30mm",
                  height: "20mm",
                  marginTop: "2mm",
                  marginLeft: "2mm",
                  marginRight: "2mm",
                  marginBottom: "2mm",
                  paddingTop: "10px",
                }}
              >
                <span style={{ fontSize: 11 }}>
                  {data?.productName
                    ? textLength(data?.productName, 25)
                    : ""}
                </span>
                <span style={{ fontSize: 11 }}>
                  {formatNumber(data?.price_sale || 0)} ກີບ
                </span>
                <img
                  alt="Barcode Generator TEC-IT"
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${data?.barcode}&code=EAN13`}
                  style={{ width: "100px", height: "40px" }}
                />
              </div>

              <div
                key={data?.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  lineHeight: "15px",
                  width: "30mm",
                  height: "20mm",
                  marginTop: "2mm",
                  marginBottom: "2mm",
                  marginLeft: "2mm",
                  paddingTop: "10px",
                }}
              >
                <span style={{ fontSize: 11 }}>
                  {data?.productName
                    ? textLength(data?.productName, 25)
                    : ""}
                </span>
                <span style={{ fontSize: 11 }}>
                  {formatNumber(data?.price_sale || 0)} ກີບ
                </span>
                <img
                  alt="Barcode Generator TEC-IT"
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${data?.barcode}&code=EAN13`}
                  style={{ width: "100px", height: "40px" }}
                />
              </div>
            </Flex>
          ))}
      </div>
  );
};

export default PrintBarcode;
