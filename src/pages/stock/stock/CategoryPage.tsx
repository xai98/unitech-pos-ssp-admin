import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Breadcrumb, Button, Flex,Spin, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import routes from "../../../utils/routes";
import { CATEGORIES } from "../../../services";
import CreateCategory from "./interface/CreateCategory";
import { SearchFilter } from "../../../components/category/SearchFilter";
import CategoryTable from "../../../components/category/CategoryTable";

// Interface สำหรับข้อมูลหมวดหมู่
interface Category {
  id: string;
  categoryName: string;
  note?: string;
}

const CategoryPage = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    show: false,
    data: null as Category | null,
    editMode: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // GraphQL Query
  const { data, loading, refetch } = useQuery<{
    categorys: { data: Category[]; total: number };
  }>(CATEGORIES, {
    fetchPolicy: "network-only",
    variables: { where: { categoryName: searchTerm || undefined } },
  });

  // Memoized data
  const dataList = useMemo(() => {
    return (
      data?.categorys?.data.map((item, index) => ({
        key: item.id,
        index: index + 1,
        id: item.id,
        categoryName: item.categoryName,
        note: item.note || "",
      })) || []
    );
  }, [data?.categorys?.data]);

  // Handlers
  const handleCreate = useCallback(() => {
    setModalState({ show: true, data: null, editMode: false });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ show: false, data: null, editMode: false });
  }, []);

  const handleStockNavigation = useCallback(() => {
    navigate(routes.STOCK_PAGE);
  }, [navigate]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Breadcrumb
  const breadcrumbItems = useMemo(
    () => [
      { title: "ຈັດການສະຕ໋ອກ" },
      {
        title: (
          <a href="#" onClick={handleStockNavigation}>
            ຈັດການສິນຄ້າ
          </a>
        ),
      },
      { title: "ປະເພດສິນຄ້າ" },
    ],
    [handleStockNavigation]
  );

  return (
    <div style={{ padding: "0 24px" }}>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 10 }} />
      <BoxContainer>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 16 }}
        >
          <TextHeader>ຈັດການປະເພດສິນຄ້າ</TextHeader>

          <Button
            size="middle"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            ເພີ່ມປະເພດສິນຄ້າ
          </Button>
        </Flex>

        <SearchFilter onSearch={debouncedSearch} />
        <p style={{ marginBottom: 8 }}>{data?.categorys?.total || 0} ລາຍການ</p>

        <Spin spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <CategoryTable
            data={dataList}
            loading={loading}
            total={data?.categorys?.total || 0}
            onRowClick={(record) =>
              setModalState({ show: true, data: record, editMode: true })
            }
          />
        </Spin>
      </BoxContainer>

      <CreateCategory
        open={modalState.show}
        onClose={handleCloseModal}
        data={modalState.data}
        editMode={modalState.editMode}
        refetch={refetch}
      />
    </div>
  );
};

export default CategoryPage;
