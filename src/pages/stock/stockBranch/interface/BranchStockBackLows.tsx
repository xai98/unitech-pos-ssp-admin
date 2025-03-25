import { Col, Image, Input, Row, Select, Spin, Table, Typography } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CATEGORIES, GET_BRANCH_STOCK_LOWS } from "../../../../services";
import { formatNumber } from "../../../../utils/helper";
import { consts } from "../../../../utils";

const { Title } = Typography;

interface StockItem {
  id: string;
  productId?: { image?: string };
  branchId?: { branchName: string };
  categoryId?: { categoryName: string };
  productName: string;
  amount: number;
  note?: string;
}

interface Props {
  selectBranch: string;
}

const BranchStockBackLows: React.FC<Props> = ({ selectBranch }) => {
  const [filter, setFilter] = useState({
    productName: "",
    categoryId: "",
    skip: 0,
    limit: 20, // กำหนดค่าเริ่มต้นชัดเจน
  });

  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [loadStockLows, { data: stockList, loading }] = useLazyQuery(GET_BRANCH_STOCK_LOWS, {
    fetchPolicy: "network-only",
  });

  const fetchStockData = useCallback(() => {
    const variables = {
      where: {
        branchId: selectBranch !== "filter" ? selectBranch : undefined,
        productName: filter.productName || undefined,
        categoryId: filter.categoryId || undefined,
      },
      skip: filter.skip,
      limit: filter.limit,
    };
    loadStockLows({ variables });
  }, [selectBranch, filter, loadStockLows]);

  React.useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        width: 50,
        align: "center" as const,
        render: (index: number) => index,
      },
      { title: "ສາຂາ", dataIndex: "branchName", key: "branchName" },
      {
        title: "ຮູບສິນຄ້າ",
        dataIndex: "image",
        key: "image",
        width: 80,
        align: "center" as const,
        render: (image: string) => (
          <Image
            width={40}
            height={40}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            src={image ? `${consts.URL_PHOTO_AW3}${image}` : "/logoMinipos.jpg"}
            preview={false}
          />
        ),
      },
      { title: "ປະເພດສິນຄ້າ", dataIndex: "categoryName", key: "categoryName" },
      { title: "ຊື່ສິນຄ້າ", dataIndex: "productName", key: "productName" },
      {
        title: "ຈຳນວນຍັງເຫຼືອ",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => formatNumber(amount || 0),
      },
      { title: "ໝາຍເຫດ", dataIndex: "note", key: "note" },
    ],
    []
  );

  const dataSource = useMemo(() => {
    return stockList?.branchStockLows?.data?.map((item: StockItem, index: number) => ({
      key: item.id,
      index: filter.skip + index + 1,
      image: item.productId?.image,
      branchName: item.branchId?.branchName,
      categoryName: item.categoryId?.categoryName,
      ...item,
    })) || [];
  }, [stockList, filter.skip]);

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "ສະແດງທຸກປະເພດ" },
      ...(categoryData?.categorys?.data?.map((category: any) => ({
        value: category.id,
        label: category.categoryName,
      })) || []),
    ],
    [categoryData]
  );

  const handleSearch = (value: string) => {
    setFilter((prev) => ({ ...prev, productName: value, skip: 0 }));
  };

  // แก้ไข handleTableChange ให้จัดการ pagination ได้ถูกต้อง
  const handleTableChange = useCallback(
    (pagination: { current: number; pageSize: number }) => {
      const newSkip = (pagination.current - 1) * pagination.pageSize;
      const newLimit = pagination.pageSize;

      setFilter((prev) => ({
        ...prev,
        skip: newSkip,
        limit: newLimit,
      }));
    },
    []
  );

  return (
    <div style={{
      backgroundColor: "#fff",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}>
      <Title level={4} style={{ color: "#2E93fA", margin:0 }}>
      ສະຕ໋ອກຫຼັງບ້ານໃກ້ໝົດ
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24,margin:10 }}>
        <Col xs={24} md={12} lg={8}>
          <Input.Search
            placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
            onSearch={handleSearch}
            enterButton
            size="large"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Select
            showSearch
            size="large"
            placeholder="ປະເພດສິນຄ້າ..."
            onChange={(value) => setFilter((prev) => ({ ...prev, categoryId: value, skip: 0 }))}
            style={{ width: "100%" }}
            options={categoryOptions}
            optionFilterProp="label"
          />
        </Col>
      </Row>

      <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>
            {stockList?.branchStockLows?.total || 0} ລາຍການ
          </Typography.Text>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: Math.floor(filter.skip / filter.limit) + 1,
            total: stockList?.branchStockLows?.total || 0,
            pageSize: filter.limit,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} ລາຍການ`,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }), // ส่ง object ที่มี current และ pageSize
          }}
          scroll={{ x: "max-content" }}
          size="middle"
          bordered
        />
      </Spin>
    </div>
  );
};

export default BranchStockBackLows;