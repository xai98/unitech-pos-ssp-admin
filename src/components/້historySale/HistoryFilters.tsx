import { Col, Input, Row, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface FilterProps {
  from_date: string;
  to_date: string;
  limit: number;
  skip: number;
  order_no?: string;  
  status?: string;
  branchId?: string;
}



interface FiltersComponentProps {
  filter: FilterProps;
  onFilterChange: (newFilter: Partial<FilterProps>) => void;
  branchOptions: { value: string; label: string }[];
}

const HistoryFilters = ({ filter, onFilterChange, branchOptions }: FiltersComponentProps) => {
  return (
    <Row gutter={[10, 10]} style={{ marginTop: 16 }}>
      <Col xs={24} sm={12} md={6}>
        <Input
          size="large"
          placeholder="ຄົ້ນຫາຕາມເລກທີ່ບິນ...."
          value={filter.order_no || ""}
          onChange={(e) => onFilterChange({ order_no: e.target.value })}
          onPressEnter={() => onFilterChange({ order_no: filter.order_no })}
          prefix={<SearchOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Select
          showSearch
          size="large"
          placeholder="ເບິ່ງຕາມສາຂາ..."
          value={filter.branchId || ""}
          onChange={(value) => onFilterChange({ branchId: value })}
          style={{ width: "100%" }}
          optionFilterProp="label"
          options={branchOptions}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Input
          type="date"
          size="large"
          value={filter.from_date}
          onChange={(e) => onFilterChange({ from_date: e.target.value })}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Input
          type="date"
          size="large"
          value={filter.to_date}
          onChange={(e) => onFilterChange({ to_date: e.target.value })}
        />
      </Col>
    </Row>
  );
};

export default HistoryFilters;