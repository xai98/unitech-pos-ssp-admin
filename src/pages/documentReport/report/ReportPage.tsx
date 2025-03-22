import { useQuery } from '@apollo/client';
import { Card, Col, Flex, GetProp, Menu, MenuProps, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../../utils/routes';
import { BRANCHS } from '../../../services';

import { MdOutlineCalendarMonth } from "react-icons/md";
import { HiTrendingUp } from "react-icons/hi";
import ReportMonth from './interface/ReportMonth';
import ReportYear from './interface/ReportYear';
import ReportPopular from './interface/ReportPopular';

type MenuItem = GetProp<MenuProps, "items">[number];

// Define the type of valid menu keys
type MenuKey =
  | "REPORT_MONTH"
  | "YEAR_MONTH"
  | "POPULART"

interface ViewProps {
  selectBranch: string;
}
// Define the view mapping for each menu key
const view: Record<MenuKey, React.FC<ViewProps>> = {
    REPORT_MONTH: ReportMonth,
    YEAR_MONTH: ReportYear,
    POPULART: ReportPopular,
  };
  
  const items: MenuItem[] = [
    {
      key: "REPORT_MONTH",
      icon: <MdOutlineCalendarMonth />,
      label: "ລາຍການປະຈຳເດືອນ",
    },
    {
      key: "YEAR_MONTH",
      icon: <MdOutlineCalendarMonth />,
      label: "ລາຍງານປະຈຳປີ",
    },
    {
      key: "POPULART",
      icon: <HiTrendingUp />,
      label: "ສິນຄ້າຍອດນິຍົມ",
    },
  ];

function ReportPage() {
    const navigate = useNavigate();
    const { branchId } = useParams();
  
    const [selectBranch, setSelectBranch] = useState<string>("");
    const [selectMenu, setSelectMenu] = useState<MenuKey>("REPORT_MONTH");
    const CurrentTabView = view[selectMenu];
  
    const { data: branchData } = useQuery(BRANCHS, {
      fetchPolicy: "network-only",
    });
  
    useEffect(() => {
      if (branchId !== "filter") {
        setSelectBranch(branchId ?? "");
      } else {
        setSelectBranch("filter");
      }
    }, [branchId]);
  
    // Handle menu click
    const handleMenuClick = (e: { key: string }) => {
      setSelectMenu(e.key as MenuKey); // Type assertion
    };
  
    const optionsBranch = [
      {
        value: "filter",
        label: "ກະລຸນາເລືອກສາຂາ",
      },
      ...(branchData?.Branchs?.data?.map((branch: any) => ({
        value: branch.id.toString(),
        label: branch.branchName,
      })) || []),
    ];
  
    const handleFilterBranch = (id: string) => {
      navigate(routes.REPORT_DOCUMENT + "/" + id);
    };
  return (
    <div>
      
      <Row>
        <Col span={24}>
          <Card>
            <Flex gap={10}>
              <h2 style={{ margin: 0 }}>ສາຂາ:</h2>
              <Select
                showSearch
                size="large"
                value={selectBranch}
                placeholder="ເບິ່ງຕາມສາຂາ..."
                onChange={(value) => handleFilterBranch(value)}
                style={{ width: "30%" }}
                optionFilterProp="label"
                options={optionsBranch}
              />
            </Flex>
          </Card>
        </Col>

        <Col span={4}>
          <Menu
            defaultSelectedKeys={["REPORT_MONTH"]}
            items={items}
            onClick={handleMenuClick} // Add onClick handler
          />
        </Col>
        <Col span={20}>
          {CurrentTabView ? (
            <CurrentTabView selectBranch={selectBranch || "null"} />
          ) : (
            <div>ເລືອກເມນູທີ່ຕ້ອງການຕັ້ງຄ່າ</div>
          )}
        </Col>
      </Row>


    </div>
  )
}

export default ReportPage
