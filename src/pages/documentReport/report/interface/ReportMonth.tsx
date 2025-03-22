import React, { useEffect, useState } from "react";
import {
  BoxContainer,
  TextHeader,
} from "../../../../components/stylesComponent/otherComponent";
import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";
import { GET_REPORT_GROUP_DATE } from "../../../../services";
import { useLazyQuery } from "@apollo/client";
import { addOneDate, formatNumber } from "../../../../utils/helper";
import ReactApexChart from "react-apexcharts";

interface Props {
  selectBranch: string;
}

const ReportMonth: React.FC<Props> = ({ selectBranch }) => {
  const [filter, setFilter] = useState({
    from_date: "",
    to_date: "",
  });

  const [chartState, setChartState] = useState<any>(null);
  const [chartStateTotal, setChartStateTotal] = useState<any>(null);

  const [loadReport, { data: reportGroupByDate }] = useLazyQuery(
    GET_REPORT_GROUP_DATE,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    const today = dayjs();
    setFilter({
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
      };
      loadReport({ variables });
    } else {
      const variables = {
        where: {
            branchId: undefined,
          from_date: filter.from_date,
          to_date: addOneDate(filter.to_date),
        },
      };
      loadReport({ variables });
    }
  }, [selectBranch, filter, loadReport]);

  useEffect(() => {
    if (reportGroupByDate) {
      const monthList =
        reportGroupByDate?.reportGroupDate.map(
          (item: any) => item.dateReport
        ) || [];
      const totalOrders =
        reportGroupByDate?.reportGroupDate.map(
          (item: any) => item.totalOrders
        ) || [];
      const totalSale =
        reportGroupByDate?.reportGroupDate.map(
          (item: any) => item.totalPrice
        ) || [];
      setChartState({
        series: [
          {
            name: "ຍອດອໍເດີ້",
            data: totalOrders,
          },
        ],
        options: {
          chart: {
            type: "bar" as const,
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              // แปลงตัวเลขให้มีคอมม่าคั่นหลักพันและเพิ่ม "ກີບ"
              return formatNumber(val) + " ອໍເດີ້";
            },
            offsetX: -6,
            style: {
              fontSize: "12px",
              colors: ["#fff"],
            },
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: monthList,
          },
          yaxis: {
            title: {
              text: "ຍອດອໍເດີ້ທັງໝົດ",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                // ใช้ formatNumber แปลงตัวเลขใน tooltip
                return `${formatNumber(val)} ອໍເດີ້`;
              },
            },
          },
        },
      });

      setChartStateTotal({
        series: [
          {
            name: "ຍອດຂາຍ",
            data: totalSale,
          },
        ],
        options: {
          chart: {
            type: "bar" as const,
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              // แปลงตัวเลขให้มีคอมม่าคั่นหลักพันและเพิ่ม "ກີບ"
              return formatNumber(val) + " ກິບ";
            },
            offsetX: -6,
            style: {
              fontSize: "12px",
              colors: ["#fff"],
            },
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: monthList,
          },
          yaxis: {
            title: {
              text: "ຍອດຂາຍທັງໝົດ",
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                // ใช้ formatNumber แปลงตัวเลขใน tooltip
                return `${formatNumber(val)} ກິບ`;
              },
            },
          },
        },
      });
    }
  }, [reportGroupByDate]);

  const onChange: DatePickerProps["onChange"] = (_, dateString) => {
    if (typeof dateString === "string") {
      const selectedDate = dayjs(dateString);
      setFilter({
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
        <TextHeader>ລາຍງານປະຈຳເດືອນ</TextHeader>
        <DatePicker
          size="large"
          style={{ width: "30%" }}
          onChange={onChange}
          placeholder="ເລືອກເດືອນ"
          picker="month"
          value={filter.from_date ? dayjs(filter.from_date) : null}
        />

        {chartState && (
          <div>
            <div>ລາຍງານຍອດອໍເດີ້ທັງໝົດ</div>

            <div id="chart">
              <ReactApexChart
                options={chartState?.options}
                series={chartState?.series}
                type="bar"
                height={350}
              />
            </div>
            <div id="html-dist"></div>
          </div>
        )}
        <div style={{ height: 20 }}></div>
        {chartStateTotal && (
          <div>
            <div>ລາຍງານຍອດຂາຍທັງໝົດ</div>
            <div id="chart">
              <ReactApexChart
                options={chartStateTotal?.options}
                series={chartStateTotal?.series}
                type="bar"
                height={350}
              />
            </div>
            <div id="html-dist"></div>
          </div>
        )}
      </BoxContainer>
    </div>
  );
};

export default ReportMonth;
