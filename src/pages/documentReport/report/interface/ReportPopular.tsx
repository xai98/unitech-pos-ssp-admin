import React, { useEffect, useState } from "react";
import {
  BoxContainer,
  TextHeader,
} from "../../../../components/stylesComponent/otherComponent";
import {
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  InputNumber,
  Row,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { REPORT_PRODUCT_POPULATION } from "../../../../services";
import { useLazyQuery } from "@apollo/client";
import { addOneDate } from "../../../../utils/helper";
import ReactApexChart from "react-apexcharts";

interface Props {
  selectBranch: string;
}

const ReportPopular: React.FC<Props> = ({ selectBranch }) => {
  const [filter, setFilter] = useState({
    from_date: "",
    to_date: "",
    limit: 7,
  });

  const [series, setSeries] = useState<any[]>([]);
  const [options, setOptions] = useState({});
  const [seriesTotal, setSeriesTotal] = useState<any[]>([]);
  const [optionsTotal, setOptionsTotal] = useState({});

  const [loadReport, { data: reportProuductPopulation, loading }] =
    useLazyQuery(REPORT_PRODUCT_POPULATION, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    const today = dayjs();
    setFilter({
      ...filter,
      from_date: today.startOf("month").format("YYYY-MM-DD"),
      to_date: today.endOf("month").format("YYYY-MM-DD"),
    });
  }, []);

  useEffect(() => {
    if (selectBranch !== "filter") {
      const variables = {
        where: {
          from_date: filter.from_date,
          to_date: addOneDate(filter.to_date),
          branchId: selectBranch,
        },
        limit: filter.limit,
      };
      loadReport({ variables });
    } else {
      const variables = {
        where: {
          branchId: undefined,
          from_date: filter.from_date,
          to_date: addOneDate(filter.to_date),
        },
        limit: filter.limit,
      };
      loadReport({ variables });
    }
  }, [selectBranch, filter, loadReport]);

  useEffect(() => {
    if (reportProuductPopulation) {
      const totalOrders =
        reportProuductPopulation?.reportProuductPopulation.map(
          (item: any) => item.totalQuantitySold
        ) || [];
      const productNames =
        reportProuductPopulation?.reportProuductPopulation.map(
          (item: any) => item.productName
        ) || [];

      const sortedMenuTotal = [
        ...reportProuductPopulation?.reportProuductPopulation,
      ].sort((a, b) => b.totalSale - a.totalSale);
      const total = sortedMenuTotal.map((item) => item.totalSale);

      setSeries([{ data: totalOrders, name: "ຈຳນວນ" }]);
      setOptions({
        chart: { type: "bar", height: 350 },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: any) => `${val.toLocaleString()} ອໍເດີ້`,
          offsetX: -6,
          style: { fontSize: "12px", colors: ["#fff"] },
        },
        xaxis: { categories: productNames },
      });

      setSeriesTotal([{ data: total, name: "ຈຳນວນ" }]);
      setOptionsTotal({
        chart: { type: "bar", height: 350 },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: any) => `${val.toLocaleString()} ກີບ`,
          offsetX: -6,
          style: { fontSize: "12px", colors: ["#fff"] },
        },
        xaxis: { categories: sortedMenuTotal.map((item) => item.productName) },
      });
    }
  }, [reportProuductPopulation]);

  const onChange: DatePickerProps["onChange"] = (_, dateString) => {
    if (typeof dateString === "string") {
      const selectedDate = dayjs(dateString);
      setFilter({
        ...filter,
        from_date: selectedDate.startOf("month").format("YYYY-MM-DD"),
        to_date: selectedDate.endOf("month").format("YYYY-MM-DD"),
      });
    } else {
      console.error("Invalid date format:", dateString);
    }
  };

  return (
    <div>
      <BoxContainer>
        <TextHeader>ສິນຄ້າຍອດຮິດ</TextHeader>

        <Row gutter={10}>
          <Col span={8}>
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              onChange={onChange}
              placeholder="ເລືອກເດືອນ"
              picker="month"
              value={filter.from_date ? dayjs(filter.from_date) : null}
            />
          </Col>
          <Col span={8}>
            <InputNumber
              size="large"
              placeholder="ປ້ອນຈຳນວນລາຍການທີ່ຕ້ອງການສະແດງ"
              autoComplete="off"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={(value) => {
                if (typeof value === "number") {
                  setFilter({
                    ...filter,
                    limit: value || 7,
                  });
                }
              }}
            />
          </Col>
        </Row>

        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <Row gutter={[10, 10]} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Flex justify="space-between" align="center">
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "blue",
                    fontSize: 20,
                  }}
                >
                  ເມນູທີ່ມີຈຳນວນອໍເດີ້ສູງສຸດ
                </div>
              </Flex>
              <div style={{ height: 10 }}></div>
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={800}
              />
            </Col>

            <Col span={12}>
              <Flex justify="space-between" align="center">
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "blue",
                    fontSize: 20,
                  }}
                >
                  ເມນູທີ່ມີຍອດລວມສູງສຸດ
                </div>
              </Flex>
              <div style={{ height: 10 }}></div>
              <ReactApexChart
                options={optionsTotal}
                series={seriesTotal}
                type="bar"
                height={800}
              />
            </Col>
          </Row>
        </Spin>
      </BoxContainer>
    </div>
  );
};

export default ReportPopular;
