import { useState } from "react";
import styles from "../../../styles/Component.module.css";
import { Flex } from "antd";
import { FaChartPie, FaHistory } from "react-icons/fa";
import OverviewRequestStock from "./OverviewRequestStock";
import HistoryRequestStock from "./HistoryRequestStock";

type MenuKey = "OVERVIEW" | "HISTORY";

const view: Record<MenuKey, () => JSX.Element> = {
  OVERVIEW: () => <OverviewRequestStock />,
  HISTORY: () => <HistoryRequestStock />, // ตัวอย่าง
};

function RequestStockPage() {
    const [selectMenu, setSelectMenu] = useState<MenuKey | "OVERVIEW">(
        "OVERVIEW"
      );
      const CurrectTabView = selectMenu ? view[selectMenu] : view["OVERVIEW"];
    
      const handleMenuClick = (key: MenuKey) => {
        setSelectMenu(key);
      };
  return (
    <div>
      {/* <BoxContainer> */}
        <h2 style={{ margin: 0 }}>ຈັດການສັ່ງເຄື່ອງ</h2>
        <div style={{ height: 10 }}></div>
        <div className={styles.menuTab}>
          <div
            className={`${styles.menuTabItem} ${
              selectMenu === "OVERVIEW" ? styles.menuTabItemActive : ""
            } `}
            onClick={() => handleMenuClick("OVERVIEW")}
          >
            <Flex gap={5} align="center">
              <FaChartPie />
              ພາບລວມທັງໝົດ
            </Flex>
          </div>
          <div
            className={`${styles.menuTabItem} ${
              selectMenu === "HISTORY" ? styles.menuTabItemActive : ""
            } `}
            onClick={() => handleMenuClick("HISTORY")}
          >
            <Flex gap={5} align="center">
              <FaHistory />
              ປະຫວັດການສັ່ງເຄື່ອງ
            </Flex>
          </div>
        </div>

        <div style={{ height: 10 }}></div>

        {CurrectTabView ? (
          <CurrectTabView />
        ) : (
          <div>ກະລຸນາເລືອກລາຍງານທີ່ຕ້ອງການເບິ່ງ</div>
        )}
      {/* </BoxContainer> */}
    </div>
  );
}

export default RequestStockPage;
