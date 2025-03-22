import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, Menu, Select, Button, Space } from "antd";
import styled from "styled-components";
import { BRANCHS } from "../../../services";
import routes from "../../../utils/routes";
import StockListPage from "./interface/StockListPage";
import AddAmountStockBranch from "./interface/AddAmountStockBranch";
import ExportAmountStockBranch from "./interface/ExportAmountStockBranch";
import HistoryStockBranch from "./interface/HistoryStockBranch";
import StockLowsBranch from "./interface/StockLowsBranch";
import BranchStockBackList from "./interface/BranchStockBackList";
import AddStockBranchBack from "./interface/AddBranchStockBack";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { MdPointOfSale } from "react-icons/md";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import HistoryBranchStockBack from "./interface/HistoryBranchStockBack";
import BranchStockBackLows from "./interface/BranchStockBackLows";

// Styled Components
const Container = styled(Layout)`
  min-height: 100vh;
  background: #f5f7fa;
`;

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  padding: 0 24px;
  height: 80px;
  line-height: 80px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  color: #1a1a1a;
  font-weight: 600;
`;

const SiderWrapper = styled(Layout.Sider)`
  background: #ffffff;
  border-right: 1px solid #e8ecef;
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const StyledMenu = styled(Menu)`
  border: none;
  padding: 16px 8px;
  .ant-menu-item {
    border-radius: 8px;
    margin: 4px 0;
    padding: 0 16px !important;
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    &:hover {
      background: #f0f5ff;
      color: #2f54eb;
    }
    &.ant-menu-item-selected {
      background: #2f54eb;
      color: white;
      .anticon, svg {
        color: white;
      }
    }
    .anticon, svg {
      font-size: 18px;
      margin-right: 12px;
    }
  }
`;

const ContentArea = styled(Layout.Content)`
  padding: 14px;
  transition: all 0.3s;
`;

const SelectWrapper = styled.div`
  width: 300px;
`;

// Interfaces
interface Branch {
  id: number;
  branchName: string;
}

interface BranchData {
  Branchs: { data: Branch[] };
}

type MenuKey =
  | "LIST_STOCK"
  | "ADD_STOCK"
  | "EDIT_STOCK"
  | "ADD_BRANCH_STOCK"
  | "BRANCH_STOCK_LIST"
  | "HISTORY_BRANCH_STOCK"
  | "HISTORY_STOCK"
  | "STOCK_LOWS"
  | "NOTIFICATION"
  | "BRANCH_STOCK_LOWS";

interface ViewProps {
  selectBranch: string;
}

const view: Record<MenuKey, React.FC<ViewProps>> = {
  LIST_STOCK: StockListPage,
  ADD_STOCK: AddAmountStockBranch,
  EDIT_STOCK: ExportAmountStockBranch,
  ADD_BRANCH_STOCK: AddStockBranchBack,
  BRANCH_STOCK_LIST: BranchStockBackList,
  HISTORY_BRANCH_STOCK: HistoryBranchStockBack,
  HISTORY_STOCK: HistoryStockBranch,
  STOCK_LOWS: StockLowsBranch,
  BRANCH_STOCK_LOWS: BranchStockBackLows,
  NOTIFICATION: () => (
    <div style={{ textAlign: "center", padding: 48, color: "#595959", fontSize: 16 }}>
      ກະລຸນາເລືອກສາຂາເພື່ອເບິ່ງຂໍ້ມູນ
    </div>
  ),
};

const menuItems = [
  { key: "LIST_STOCK", icon: <MdPointOfSale />, label: "ສິນຄ້າໜ້າຂາຍ" },
  { key: "BRANCH_STOCK_LIST", icon: <AiFillProduct />, label: "ສະຕ໋ອກຫຼັງບ້ານ" },
  { key: "ADD_BRANCH_STOCK", icon: <IoIosAddCircleOutline />, label: "ເພີ່ມສະຕ໋ອກຫຼັງ" },
  { key: "ADD_STOCK", icon: <IoIosAddCircleOutline />, label: "ເພີ່ມສະຕ໋ອກໜ້າ" },
  { key: "HISTORY_BRANCH_STOCK", icon: <FaHistory />, label: "ປະຫວັດສະຕ໋ອກຫຼັງບ້ານ" },
  { key: "HISTORY_STOCK", icon: <FaHistory />, label: "ປະຫວັດສະຕ໋ອກຂາຍໜ້າຮ້ານ" },
  { key: "STOCK_LOWS", icon: <AiOutlineProduct />, label: "ສິນຄ້າໜ້າຂາຍໃກ້ໝົດ" },
  { key: "BRANCH_STOCK_LOWS", icon: <AiOutlineProduct />, label: "ສິນຄ້າໜ້າສາຂາໃກ້ໝົດ" },
];

const StockBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();

  const [selectBranch, setSelectBranch] = useState<string>("filter");
  const [selectMenu, setSelectMenu] = useState<MenuKey>("NOTIFICATION");
  const [collapsed, setCollapsed] = useState(false);

  const { data: branchData, loading: branchLoading } = useQuery<BranchData>(BRANCHS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (branchId && branchId !== "filter") {
      setSelectBranch(branchId);
    } else {
      setSelectBranch("filter");
      setSelectMenu("NOTIFICATION");
    }
  }, [branchId]);

  const handleMenuClick = useCallback((e: { key: string }) => {
    setSelectMenu(e.key as MenuKey);
  }, []);

  const handleFilterBranch = useCallback((id: string) => {
    navigate(`${routes.STOCK_BRANCH}/${id}`);
    setSelectMenu("LIST_STOCK");
  }, [navigate]);

  const optionsBranch = useMemo(() => [
    { value: "filter", label: "ເລືອກສາຂາ" },
    ...(branchData?.Branchs?.data?.map(branch => ({
      value: branch.id.toString(),
      label: branch.branchName,
    })) || []),
  ], [branchData]);

  const CurrentTabView = useMemo(() => view[selectMenu], [selectMenu]);

  return (
    <Container>
      <StyledHeader>
        <Space size="middle">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: "#595959" }}
          />
          <HeaderTitle>ຈັດການສະຕ໋ອກສາຂາ</HeaderTitle>
        </Space>
        <SelectWrapper>
          <Select
            showSearch
            size="large"
            value={selectBranch}
            placeholder="ເລືອກສາຂາ..."
            onChange={handleFilterBranch}
            options={optionsBranch}
            loading={branchLoading}
            style={{ width: "100%", borderRadius: 8 }}
            optionFilterProp="label"
          />
        </SelectWrapper>
      </StyledHeader>

      <Layout>
        <SiderWrapper
          width={245}
          collapsedWidth={80}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          <StyledMenu
            selectedKeys={[selectMenu]}
            items={menuItems}
            onClick={handleMenuClick}
            mode="inline"
          />
        </SiderWrapper>
        <ContentArea style={{ marginLeft: collapsed ? 0 : 0 }}>
          {CurrentTabView && <CurrentTabView selectBranch={selectBranch} />}
        </ContentArea>
      </Layout>
    </Container>
  );
};

export default StockBranchPage;