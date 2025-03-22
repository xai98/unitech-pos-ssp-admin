import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import styles from "../styles/Layout.module.css";

import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  ProductOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme, message, MenuProps, Menu } from "antd";
import ButtonAction from "../components/ButtonAction";

import { getUserDataFromLCStorage, parseJwt, useAuth } from "../utils/helper";
import { consts } from "../utils";
import routes from "../utils/routes";

const { Header, Sider, Content } = Layout;

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useAuth();

  const user = getUserDataFromLCStorage();

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(consts.USER_TOKEN);

    if (token) {
      const decodedToken = parseJwt(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        message.warning("ລະຫັດຂອງທ່ານໝົດອາຍຸການໃຊ້ງານ ກະລຸນາອອກເຂົ້າໃໝ່");
        localStorage.removeItem(consts.USER_KEY);
        localStorage.removeItem(consts.USER_TOKEN);
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(consts.USER_TOKEN);
    localStorage.removeItem(consts.USER_KEY);
    navigate("/login");
  };

  const handleMenu = (route?: string) => {
    console.log("object", route);

    if (route) {
      navigate(route, { replace: true });
    }
  };

  // if user is login
  if (isAuthenticated) {


    const items = [
      {
        icon: <DashboardOutlined className={styles.textSideBar} />,
        label: <a onClick={() => handleMenu(routes.REPORT_DASHBOARD)}>ໜ້າຫຼັກ</a>,
      },

      {
        icon: <OrderedListOutlined className={styles.textSideBar} />,
        label: "ລາຍງານ",
        subMenu: [
          {
            label: (
              <a onClick={() => handleMenu(routes.REPORT_DOCUMENT + "/filter")}>
                ລາຍງານ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.HISTORY_SALE)}>
                ປະຫວັດການຂາຍ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.HISTORY_CHANGE_PRODUCT)}>
                ປະຫວັດການປ່ຽນເຄື່ອງ
              </a>
            ),
          },
        ],
      },
      {
        icon: <ProductOutlined className={styles.textSideBar} />,
        label: "ຈັດການສະຕ໋ອກ",
        subMenu: [
          {
            label: (
              <a onClick={() => handleMenu(routes.STOCK_PAGE)}>ຈັດການສິນຄ້າ</a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.STOCK_BRANCH + "/filter")}>
                ກວດສິນຄ້າໃນສາຂາ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.REQUEST_STOCK_PAGE)}>
                ສາຂາສັ່ງເຄື່ອງ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.STOCK_CENTER_PAGE)}>ສະຕ໋ອກສາງໃຫ່ຍ</a>
            ),
          },
         
          // {
          //   label: (
          //     <a onClick={() => handleMenu(routes.ADD_STOCK_BRANCH)}>
          //       ເພີ່ມເຄື່ອງລົງສາຂາ
          //     </a>
          //   ),
          // },

          // {
          //   label: (
          //     <a onClick={() => handleMenu(routes.CHECK_STOCK_BRANCH)}>
          //       ກວດສອບສະຕ໋ອກສາຂາ
          //     </a>
          //   ),
          // },
          // {
          //   label: (
          //     <a onClick={() => handleMenu(routes.HISTORY_STOCK_LIST)}>
          //       ປະຫວັດການເຄື່ອນໄຫວສະຕ໋ອກ
          //     </a>
          //   ),
          // },
        ],
      },
      {
        icon: <UsergroupAddOutlined className={styles.textSideBar} />,
        label: "ບໍລິຫານຮ້ານ",
        subMenu: [
          {
            label: <a onClick={() => handleMenu(routes.BRANCH)}>ຈັດການສາຂາ</a>,
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.STAFF_ADMIN)}>ຈັດການແອັດມິນ</a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.STAFF_BRANCH)}>ຈັດການພະນັກງານສາຂາ</a>
            ),
          },
        ],
      },
      {
        icon: <SettingOutlined className={styles.textSideBar} />,
        label: "ຕັ້ງຄ່າ",
        subMenu: [
          {
            label: (
              <a onClick={() => handleMenu(routes.SETTING_EXCHANGE)}>
                ຕັ້ງຄ່າອັດຕາແລກປ່ຽນ
              </a>
            ),
          },
        ],
      },
    ];

    const itemsAccounting = [
      {
        icon: <ProductOutlined className={styles.textSideBar} />,
        label: "ຈັດການສະຕ໋ອກ",
        subMenu: [
          {
            label: (
              <a onClick={() => handleMenu(routes.STOCK_PAGE)}>ຈັດການສິນຄ້າ</a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.STOCK_BRANCH + "/filter")}>
                ກວດສິນຄ້າໃນສາຂາ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.ADD_STOCK_BRANCH)}>
                ເພີ່ມເຄື່ອງລົງສາຂາ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.REQUEST_STOCK_PAGE)}>
                ຈັດການສັ່ງເຄື່ອງ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.CHECK_STOCK_BRANCH)}>
                ກວດສອບສະຕ໋ອກສາຂາ
              </a>
            ),
          },
          {
            label: (
              <a onClick={() => handleMenu(routes.HISTORY_STOCK_LIST)}>
                ປະຫວັດການເຄື່ອນໄຫວສະຕ໋ອກ
              </a>
            ),
          },
        ],
      },
    ]


    const items2: MenuProps["items"] = items.map((menu, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: menu.icon,
        label: menu.label,
        children: menu?.subMenu?.map((sub, j) => {
          const subKey = index * items.length + j + 1;
          return {
            key: subKey,
            label: sub.label,
          };
        }),
      };
    });


    const menuAccount: MenuProps["items"] = itemsAccounting.map((menu, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: menu.icon,
        label: menu.label,
        children: menu?.subMenu?.map((sub, j) => {
          const subKey = index * items.length + j + 1;
          return {
            key: subKey,
            label: sub.label,
          };
        }),
      };
    });

    return (
      <Layout style={{ minHeight: "100vh" }} hasSider>
        <Sider
          trigger={null}
          width={250}
          collapsible
          collapsed={collapsed}
          // className={`${styles.bgColor}`}
          collapsedWidth={80}
          reverseArrow={true}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            // backgroundColor: "#1976d2",
          }}
        >
          <div className={styles.logoText}>
            <img
              alt="logo"
              src="/logoMinipos.jpg"
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            />
            <p hidden={collapsed}>ຮ້ານມິນິມາກ ສວນເສືອປ່າ</p>
          </div>
          <div hidden={!collapsed} style={{ height: 35 }}></div>
          <Menu
            mode="inline"
            theme="dark"
            selectable
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            items={user?.role === "ACCOUNTING" ? menuAccount : items2}
          />

          {/* <MenuItemList collapsed={collapsed} /> */}
        </Sider>
        <Layout
          style={{
            marginLeft: !collapsed ? 250 : 80,
            transition: "0.35s ease-out",
          }}
        >
          <Header
            style={{
              padding: "0px",
              background: colorBgContainer,
              width: "100%",
              overflow: "auto",
              height: "6vh",
              position: "fixed",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2)",
              zIndex: 100,
            }}
          >
            <div>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />


            </div>

            <div style={{ marginRight: !collapsed ? 260 : 90 }}>
              <ButtonAction
                 size='middle'
                label="ອອກຈາກລະບົບ"
                onClick={handleLogout}
                htmlType="button"
                type="text"
                style={{ backgroundColor: "pink" }}
              />
            </div>
          </Header>
          <Content
            style={{
              margin: "65px 10px 10px 10px",
              // padding: 24,
              minHeight: 280,
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
