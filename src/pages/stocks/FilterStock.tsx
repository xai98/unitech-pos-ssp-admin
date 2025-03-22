import { Col, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface FilterData {
  filter: any;
  setFilter: (filter: any) => void;
}

const FilterStock: React.FC<FilterData> = ({ filter, setFilter }) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
    // Perform your search or filter logic here
    setFilter({
      ...filter,
      productName: search || "",
    });
  };

  return (
    <div>
      <Row gutter={10}>
        <Col span="5">
          <Input
            size="large"
            placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ...."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
          />
        </Col>

        {/* <Col span="5">
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            size="large"
            placeholder="ເບິ່ງຕາມສິດນຳໃຊ້"
            onChange={(value) =>
              setFilter({
                ...filter,
                status: value || "",
              })
            }
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "",
                label: "ສະແດງທຸກສະຖານະ",
              },
              {
                value: "OPENED",
                label: "ເປີດໃຊ້ງານ",
              },
              {
                value: "CLOSED",
                label: "ປິດໃຊ້ງານ",
              },
            ]}
          />
        </Col> */}
      </Row>
    </div>
  );
};

export default FilterStock;
