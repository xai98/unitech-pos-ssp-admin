import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Col, Row, Spin, Tabs } from "antd";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import {
  BRANCHS,
  GET_REPORT_GROUP_BRANCH,
  GET_REPORT_ORDERS,
  GET_REPORT_STOCK_CENTER,
  REPORT_ORDER_CHANGE,
  REPORT_PRODUCT_POPULATION,
  RETPORT_CHANGE_ORDER_GROUP_BRANCH,
  SUMMARY_STOCK_LOW,
} from "../../../services";
import { addOneDate } from "../../../utils/helper";
import { Filters } from "../../../components/overview/Filters";
import { StatsCards } from "../../../components/overview/StatsCards";
import { MoneyReportTable } from "../../../components/overview/MoneyReportTable";
import { CirculationTable } from "../../../components/overview/CirculationTable";
import { BranchReportTable } from "../../../components/overview/BranchReportTable";
import { ChangeBranchReportTable } from "../../../components/overview/ChangeBranchReportTable";
import { Container } from "../../../components/overview/styled";
import { RiDashboardHorizontalLine } from "react-icons/ri";

import PopularChart from "../../../components/overview/PopularChart";
import { FaChartLine } from "react-icons/fa";

dayjs.extend(localeData);

interface FilterState {
  branchId: string;
  from_date: string;
  to_date: string;
}

const OverviewPage = () => {
  const [filter, setFilter] = useState<FilterState>({
    branchId: "",
    from_date: dayjs().format("YYYY-MM-DD"),
    to_date: dayjs().format("YYYY-MM-DD"),
  });

  const getFilterVariables = () => ({
    branchId: filter.branchId || undefined,
    from_date: filter.from_date || undefined,
    to_date: addOneDate(filter.to_date) || undefined,
  });

  const filterVariables = useMemo(() => getFilterVariables(), [filter]);

  // Queries
  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });
  const { data: summaryStockLow, loading: summaryStockLowLoading } = useQuery(
    SUMMARY_STOCK_LOW,
    {
      fetchPolicy: "network-only",
    }
  );
  const { data: reportData, loading: reportLoading } = useQuery(
    GET_REPORT_ORDERS,
    {
      variables: { where: filterVariables },
      fetchPolicy: "network-only",
    }
  );
  const { data: reportChangeOrderData, loading: changeOrderLoading } = useQuery(
    REPORT_ORDER_CHANGE,
    {
      variables: { where: filterVariables },
      fetchPolicy: "network-only",
    }
  );
  const { data: reportGroupBranchData, loading: branchLoading } = useQuery(
    GET_REPORT_GROUP_BRANCH,
    {
      variables: { where: filterVariables },
      fetchPolicy: "network-only",
    }
  );
  const { data: reportChangeGroupBranchData, loading: changeBranchLoading } =
    useQuery(RETPORT_CHANGE_ORDER_GROUP_BRANCH, {
      variables: { where: filterVariables },
      fetchPolicy: "network-only",
    });

  const { data: reportPopular, loading: popularLoading } = useQuery(
    REPORT_PRODUCT_POPULATION,
    {
      variables: { where: filterVariables, limit: 10 },
      fetchPolicy: "network-only",
    }
  );

  const { data: reportStockCenter } = useQuery(GET_REPORT_STOCK_CENTER, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Memoized data
  const reportOrder = useMemo(() => reportData?.reportOrders, [reportData]);
  const reportChange = useMemo(
    () => reportChangeOrderData?.reportChangeOrder,
    [reportChangeOrderData]
  );
  const reportBranch = useMemo(
    () => reportGroupBranchData?.reportGroupBranch,
    [reportGroupBranchData]
  );
  const reportChangeBranch = useMemo(
    () => reportChangeGroupBranchData?.reportChangeOrderGroupBrach,
    [reportChangeGroupBranchData]
  );
  const totalStockLow = useMemo(
    () => summaryStockLow?.summaryStockLow?.totalStockLow,
    [summaryStockLow]
  );

  const reportPopularList = useMemo(
    () => reportPopular?.reportProuductPopulation,
    [reportPopular]
  );

    const summaryStockCenterData = useMemo(
      () => ({
        totalStockLows:
          reportStockCenter?.reportStockCenterSummary?.totalStockLows,
        totalOverStock:
          reportStockCenter?.reportStockCenterSummary?.totalOverStock,
        totalStockNearLows:
          reportStockCenter?.reportStockCenterSummary?.totalStockNearLows,
        totalItems: reportStockCenter?.reportStockCenterSummary?.totalItems,
      }),
      [reportStockCenter]
    );

  const totalChangeOrder =
    reportChangeBranch?.reduce(
      (acc: number, item: any) => acc + (item.totalOrders || 0),
      0
    ) || 0;

  const branchOptions = useMemo(
    () => [
      { value: "", label: "ສະແດງທຸກສາຂາ" },
      ...(branchData?.Branchs?.data?.map((branch: any) => ({
        value: branch.id.toString(),
        label: branch.branchName,
      })) || []),
    ],
    [branchData]
  );

  const isLoading =
    reportLoading ||
    branchLoading ||
    changeOrderLoading ||
    changeBranchLoading ||
    summaryStockLowLoading ||
    popularLoading;

  return (
    <Container>
      <Spin spinning={isLoading} size="large" tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Filters
          filter={filter}
          setFilter={setFilter}
          branchOptions={branchOptions}
        />

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: `ລາຍງານລວມ`,
              children: (
                <>
                  <StatsCards
                    reportOrder={reportOrder}
                    reportChange={reportChange}
                    totalStockLow={totalStockLow}
                    totalChangeOrder={totalChangeOrder}
                    summaryStockCenterData={summaryStockCenterData}
                  />

                  <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <MoneyReportTable
                        reportOrder={reportOrder}
                        reportChange={reportChange}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <CirculationTable reportOrder={reportOrder} />
                    </Col>
                  </Row>

                  <BranchReportTable reportBranch={reportBranch} />
                  <ChangeBranchReportTable
                    reportChangeBranch={reportChangeBranch}
                  />
                </>
              ),
              icon: <RiDashboardHorizontalLine />,
            },
            {
              key: "2",
              label: `ລາຍງານສິນຄ້າຂາຍດີ`,
              children: <PopularChart reportPopularList={reportPopularList} />,
              icon: <FaChartLine />,
            },
          ]}
        />
      </Spin>
    </Container>
  );
};

export default OverviewPage;
