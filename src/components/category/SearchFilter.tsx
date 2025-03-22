import { Col, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFilterProps {
  onSearch: (value: string) => void;
}

export const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  return (
    <Row gutter={10} style={{ marginBottom: 16 }}>
      <Col xs={24} sm={12} md={8}>
        <Input
          size="large"
          placeholder="ຄົ້ນຫາຕາມຊື່..."
          onChange={(e) => onSearch(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </Col>
    </Row>
  );
};