import { Col, Input, Row, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface FilterReport {
  filter: any;
  setFilter: (filter: any) => void;
  branchData: any;
}

const FilterHistory: React.FC<FilterReport> = ({
  filter,
  setFilter,
  branchData,
}) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
    // Perform your search or filter logic here
    setFilter({
      ...filter,
      productName: search || "",
    });
  };

  const optionsBranch = [
    {
      value: "",
      label: "ສະແດງທຸກສາຂາ",
    },
    ...(branchData?.Branchs?.data?.map((branch: any) => ({
      value: branch.id.toString(),
      label: branch.branchName,
    })) || []),
  ];

  return (
    <div>
      <Row gutter={10}>
        <Col span="4">
          <Input
            size="large"
            placeholder="ຄົ້ນຫາຕາມເລກທີ່ບິນ...."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span="4">
          <Select
            showSearch
            size="large"
            placeholder="ເບິ່ງຕາມສາຂາ..."
            onChange={(value) => {
              setFilter({ ...filter, branchId: value });
            }}
            style={{ width: "100%" }}
            optionFilterProp="label"
            options={optionsBranch}
          />
        </Col>
        <Col span="4">
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            size="large"
            placeholder="ເບິ່ງຕາມສະຖານະ"
            onChange={(value) =>
              setFilter({
                ...filter,
                status: value || "",
              })
            }
            optionFilterProp="label"
            options={[
              {
                value: "",
                label: "ສະແດງທຸກສະຖານະ",
              },
              {
                value: "IMPORT_STOCK",
                label: "ນຳເຂົ້າ",
              },
              {
                value: "EXPORT_STOCK",
                label: "ນຳອອກ",
              },
              {
                value: "SALE_STOCK",
                label: "ຂາຍອອກ",
              },
            ]}
          />
        </Col>
        <Col span="4">
          <Input
            type="date"
            size="large"
            placeholder="ວັນທີ...."
            onChange={(e) => {
              setFilter({ ...filter, from_date: e.target.value || "" });
            }}
            value={filter?.from_date || ""}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span="4">
          <Input
            type="date"
            size="large"
            placeholder="ຫາວັນທີ...."
            onChange={(e) => {
              setFilter({ ...filter, to_date: e.target.value || "" });
            }}
            value={filter?.to_date || ""}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FilterHistory;
