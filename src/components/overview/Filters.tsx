import { Col, Row, Select, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { FilterCard } from "./styled";

const { RangePicker } = DatePicker;

interface FilterState {
  branchId: string;
  from_date: string;
  to_date: string;
}

interface FiltersProps {
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  branchOptions: { value: string; label: string }[];
}

export const Filters = ({ filter, setFilter, branchOptions }: FiltersProps) => {
  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setFilter({
      ...filter,
      from_date: dateStrings[0] || "",
      to_date: dateStrings[1] || "",
    });
  };

  return (
    <FilterCard>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24}>
          <h2>ຍອດຂາຍມື້ນີ້ {moment().format("DD-MM-YYYY HH:mm a")}</h2>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Select
            showSearch
            size="large"
            value={filter.branchId}
            placeholder="ເບິ່ງຕາມສາຂາ..."
            onChange={(value) => setFilter({ ...filter, branchId: value })}
            style={{ width: "100%" }}
            options={branchOptions}
            optionFilterProp="label"
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <RangePicker
            size="large"
            style={{ width: "100%" }}
            onChange={handleDateChange}
            placeholder={["ແຕ່ວັນທີ", "ຫາວັນທີ"]}
            format="YYYY-MM-DD"
            value={[
              filter.from_date ? dayjs(filter.from_date) : null,
              filter.to_date ? dayjs(filter.to_date) : null,
            ]}
          />
        </Col>
      </Row>
    </FilterCard>
  );
};
