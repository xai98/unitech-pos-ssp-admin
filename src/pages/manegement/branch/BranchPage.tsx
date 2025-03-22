import { Button, Divider, Flex, Space, Spin, Table } from "antd";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import ButtonAction from "../../../components/ButtonAction";
import { PlusOutlined } from "@ant-design/icons";
import CreateBranch from "./interface/CreateBranch";
import { useState } from "react";
import { BRANCHS } from "../../../services";
import { useQuery } from "@apollo/client";
import { TbPackageImport } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import routes from "../../../utils/routes";

function BranchPage() {
 
  const navigate = useNavigate();

  const [isCreated, setIsCreated] = useState<{
    show: boolean;
    data: any;
    editMode: boolean;
  }>({ show: false, data: null, editMode: false });

  const {
    data: branchData,
    loading,
    refetch,
  } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  //   function
  const handleCreate = () => {
    setIsCreated({ show: true, data: null, editMode: false });
  };

  // function for viewing detail
  const handleViewDetail = (record: any) => {
    setIsCreated({ show: true, data: record, editMode: true });
  };

  //   function

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "50px",
      render: (index: number) => (
        <div style={{ textAlign: "center" }}>{index}</div>
      ),
    },
    {
      title: "ຊື່ສາຂາ",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "ຕົວຫຍໍ້ລາວ",
      dataIndex: "code_la",
      key: "code_la",
      width: "100px",
    },
    {
      title: "ຕົວຫຍໍ້ອັງກິດ",
      dataIndex: "code",
      key: "code",
      width: "100px",
    },
    {
      title: "ໝາຍເຫດ",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "ຜູ້ສ້າງ",
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ];

  const dataList =
    branchData?.Branchs?.data &&
    branchData?.Branchs?.data?.map((item: any, index: number) => ({
      index: index + 1,
      id: item.id,
      ...item,
    }));


  const handleAddProduct = () => {
    navigate(routes.ADD_STOCK_BRANCH)
  }

  return (
    <BoxContainer>
      <Flex justify="space-between" align="center">
        <TextHeader>ຈັດການສາຂາ</TextHeader>
        <Space>
          <ButtonAction
            size="middle"
            label="ເພີ່ມສາຂາ"
            type="primary"
            onClick={handleCreate}
            htmlType="button"
            icon={<PlusOutlined />}
            style={{backgroundColor:"#eee"}}
            disabled
            color="gray"
          />

          <Button
            color="green"
            size="large"
            icon={<TbPackageImport />}
            onClick={handleAddProduct}
            block
          >
            ເພີ່ມສິນຄ້າເຂົ້າສາຂາ
          </Button>
        </Space>
      </Flex>

      <Divider />

      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Table
          size="small"
          columns={columns}
          dataSource={dataList}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record), // Trigger handleViewDetail when the row is clicked
          })}
        />
      </Spin>

      <CreateBranch
        open={isCreated.show}
        onClose={() =>
          setIsCreated({ show: false, data: null, editMode: false })
        }
        data={isCreated.data}
        editMode={isCreated.editMode}
        refetch={refetch}
      />
    </BoxContainer>
  );
}

export default BranchPage;
