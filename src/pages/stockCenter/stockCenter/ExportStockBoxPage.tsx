import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Input,
  Select,
  message,
  Spin,
  Breadcrumb,
  Row,
  Col,
  Checkbox,
  Form,
  Typography,
  InputRef,
} from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";
import { CardContainer } from "../../../styles/globalCss";
import { useMutation, useQuery } from "@apollo/client";
import { BRANCHS, EXPORT_STOCK_BOX } from "../../../services";
import { StockBox } from "../../../types/stockBoxTypes";
import { StockBoxExportPrint } from "../../../components/stockCenter/stockBox/StockBoxExportPrint";
import ReactToPrint from "react-to-print";

const { Option } = Select;
const { Title } = Typography;

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
`;

const StyledCard = styled(CardContainer)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  background: #fff;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExportStockBoxPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  // Print references
  const printComponentRef = useRef<any>(null);
  const reactToPrintContent = useRef<any>(null);

  // State
  const [selectBranch, setSelectBranch] = useState("");
  const [barcode, setBarcode] = useState<string>("");
  const [keepBranch, setKeepBranch] = useState<boolean>(false);
  const [stockBoxPrint, setStockPrint] = useState<StockBox | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Fetch branch data
  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  // Export stock box mutation
  const [exportStockBox, { loading }] = useMutation(EXPORT_STOCK_BOX, {
    onCompleted: (data) => {
      setStockPrint(data?.exportStockBox);
      message.success(`ຍິງເຄື່ອງອອກສຳເລັດ`);
      setBarcode("");
      
      if (!keepBranch) {
        setSelectBranch("");
        form.setFieldsValue({ branchId: "" });
      }
      
      // Use setTimeout to ensure state has updated before printing
      setTimeout(() => {
        handlePrint();
        // Focus back on input after printing
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, 100);
    },
    onError: (error) => {
      message.error(`ແຈ້ງເຕືອນ: ${error.message}`);
      inputRef.current?.focus();
    },
  });

  // Memoize branch list to prevent unnecessary re-renders
  const branchList = useMemo(() => {
    return branchData?.Branchs?.data || [];
  }, [branchData]);

  // Handle barcode scan
  const handleScan = async (value: string) => {
    if (!value) {
      message.warning("ກະລຸນາສະແກນບາໂຄ້ດ");
      inputRef.current?.focus();
      return;
    }

    if (!selectBranch) {
      message.warning("ກະລຸນາເລືອກສາຂາກ່ອນ");
      inputRef.current?.focus();
      return;
    }

    try {
      await exportStockBox({
        variables: {
          data: {
            status: "export",
            branchId: selectBranch,
          },
          where: {
            boxNo: value,
          },
        },
      });
    } catch (error) {
      message.error("ການສ້າງສະຕ໋ອກລົ້ມເຫຼວ");
      inputRef.current?.focus();
    }
  };

  // Handle manual form submission
  const handleSubmit = () => {
    handleScan(barcode);
  };

  // Barcode scanner effect - only run when input is focused
  useEffect(() => {
    let buffer = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only process if our input is focused
      if (document.activeElement !== inputRef.current?.input) {
        return;
      }
      
      if (!/[a-zA-Z0-9]/.test(e.key)) return;

      buffer += e.key;
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if ([12, 13].includes(buffer.length)) {
          // Set the barcode state and then scan
          setBarcode(buffer);
          handleScan(buffer);
        }
        buffer = "";
      }, 100);
    };

    window.addEventListener("keypress", handleKeyPress);
    
    // Focus the input on component mount
    inputRef.current?.focus();

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeout);
    };
  }, [selectBranch]); // Add selectBranch as dependency since handleScan uses it

  // Effect to focus input after loading completes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  // Navigation
  const onBack = () => {
    navigate(routes.STOCK_CENTER_PAGE);
  };

  // Handle print function
  const handlePrint = () => {
    if (reactToPrintContent.current && !isPrinting) {
      setIsPrinting(true);
      try {
        reactToPrintContent.current.handlePrint();
      } catch (error) {
        message.error("ການພິມລົ້ມເຫຼວ");
      } finally {
        setIsPrinting(false);
      }
    }
  };

  // Handle branch change
  const handleBranchChange = (value: string) => {
    setSelectBranch(value);
    form.setFieldsValue({ branchId: value });
    // Focus back to input after branch selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          {
            title: (
              <a href="#" onClick={onBack}>
                ສະຕ໋ອກສາງໃຫ່ຍ
              </a>
            ),
          },
          {
            title: "ຍິງເຄື່ອງອອກຈາກສະຕ໋ອກ",
          },
        ]}
        style={{ marginBottom: 16 }}
      />

      <StyledCard>
        <Title level={4} style={{ marginBottom: 24 }}>
          ຍິງເຄື່ອງອອກຈາກສະຕ໋ອກ
        </Title>

        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <FormSection>
                <Checkbox
                  checked={keepBranch}
                  onChange={(e) => setKeepBranch(e.target.checked)}
                >
                  ຄົງຄ່າສາຂາ
                </Checkbox>

                <Form 
                  form={form} 
                  layout="vertical"
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    label="ເລືອກສາຂາ"
                    name="branchId"
                    rules={[{ required: true, message: "ກະລຸນາເລືອກສາຂາ" }]}
                  >
                    <Select
                      placeholder="ເລືອກສາຂາ"
                      size="large"
                      style={{ width: "100%" }}
                      value={selectBranch}
                      onChange={handleBranchChange}
                    >
                      {branchList?.map((item: any) => (
                        <Option value={item?.id} key={item?.id}>
                          {item?.branchName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="ສະແກນ">
                    <Input
                      ref={inputRef}
                      placeholder="ສະແກນເຄື່ອງອອກ..."
                      size="large"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      onPressEnter={() => handleScan(barcode)}
                      disabled={loading || !selectBranch}
                      allowClear
                      autoFocus
                    />
                  </Form.Item>
                </Form>
              </FormSection>
            </Col>
          </Row>
        </Spin>
        
        {/* Hidden print component */}
        <div style={{ display: "none" }}>
          <ReactToPrint
            trigger={() => <></>}
            content={() => printComponentRef.current}
            ref={reactToPrintContent}
            onAfterPrint={() => {
              inputRef.current?.focus();
            }}
          />
          <div ref={printComponentRef}>
            {stockBoxPrint && <StockBoxExportPrint stockBox={stockBoxPrint} />}
          </div>
        </div>
      </StyledCard>
    </PageContainer>
  );
};

export default ExportStockBoxPage;