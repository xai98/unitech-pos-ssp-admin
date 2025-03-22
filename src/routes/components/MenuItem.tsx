
import styles from "../../styles/Layout.module.css";
import {
  OrderedListOutlined,
  HistoryOutlined,
  PrinterOutlined,
  StockOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import routes from "../../utils/routes";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItems {
  key: string;
  icon: React.ReactNode;
  label: string;
  route?: string;
}

const items:MenuItems[] = [
  {
    key: "0",
    icon: <PrinterOutlined className={styles.textSideBar} />,
    label: "ສ້າງລາຍການຂາຍ",
    route: routes.POS_SALE,
  },
  // {
  //   key: "1",
  //   icon: <DashboardOutlined className={styles.textSideBar} />,
  //   label: "ໜ້າຫຼັກ",
  // },

  {
    key: "2",
    icon: <OrderedListOutlined className={styles.textSideBar} />,
    label: "ລາຍງານ",
    route: routes.REPORT_DASHBOARD

  },
  {
    key: "3",
    icon: <StockOutlined className={styles.textSideBar} />,
    label: "ກວດສອບສະຕ໋ອກສິນຄ້າ",
  },
  {
    key: "4",
    icon: <HistoryOutlined className={styles.textSideBar} />,
    label: "ປະຫວັດການເຄື່ອນໄຫວສະຕ໋ອກ",
    route: routes.HISTORY_STOCK_LIST
  },
  // {
  //   key: "5",
  //   icon: <ScheduleOutlined className={styles.textSideBar} />,
  //   label: "ຈັດການຮອບສ້າງ QR Code",
  // },
  // {
  //   key: "6",
  //   icon: <UserOutlined className={styles.textSideBar} />,
  //   label: "ຈັດການຜູ້ນຳໃຊ້",
  //   route: routes.USERS_LIST
  // },
];

interface Props {
  collapsed?: boolean;
}

const MenuItemList: React.FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation();

  const handleMenu = (route?: string) => {
    if(route){
      navigate(route, {replace:true}) 
    }
  }


  return (
    <div className={styles.containerMenuItem}>
      {items.map((item) => (
        <div
          key={item.key}
          className={`${styles.item} ${
            item.route === location?.pathname ? styles.itemMenuActive : ""
          } `}
          
          onClick={() => handleMenu(item.route)}
         
        >
          {collapsed ? (
            <>
              <Tooltip
                className={`${styles.itemMenuIcon} `}
                placement="rightTop"
                title={item.label}
                arrow={true}
              >
                {item.icon}
              </Tooltip>
            </>
          ) : (
            <>
              <div className={`${styles.itemMenu} `}>
                {item.icon}
                <span hidden={collapsed}>{item.label}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;
