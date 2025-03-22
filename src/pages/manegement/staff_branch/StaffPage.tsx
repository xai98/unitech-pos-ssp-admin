import {
  Col,
  Divider,
  Flex,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import {
  BoxContainer,
  TextHeader,
} from "../../../components/stylesComponent/otherComponent";
import ButtonAction from "../../../components/ButtonAction";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { BRANCHS, EMPLOYEES } from "../../../services";
import { useQuery } from "@apollo/client";
import CreateStaff from "./interface/CreateStaff";
import { converGender, converRoleAdmin } from "../../../utils/helper";
import { consts } from "../../../utils";
const { Option } = Select;

function StaffPage() {
  const [filter, setFilter] = useState({
    search: "",
    skip: 0,
    limit: 25,
    branchId:"",
  });
  const [search, setSearch] = useState<string>("");

  const [isCreated, setIsCreated] = useState<{
    show: boolean;
    data: any;
    editMode: boolean;
  }>({ show: false, data: null, editMode: false });

  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  const {
    data: userData,
    loading,
    refetch,
  } = useQuery(EMPLOYEES, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: filter?.branchId || undefined,
        OR: [
          { firstName: filter?.search || undefined },
          { phone: filter?.search || undefined },
          { username: filter?.search || undefined },
        ],
      },
    },
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
      title: "ຮູບໂປຟາຍ",
      dataIndex: "imageProfile",
      key: "imageProfile",
      width: "100px",
      render: (imageProfile: string) => {
        return (
          <center>
            <Image
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              src={
                imageProfile
                  ? consts.URL_PHOTO_AW3 + imageProfile
                  : "/logoMinipos.jpg"
              }
            />
          </center>
        ); // Ensure you return the role
      },
      onClick: (info: any) => {
        info.domEvent.stopPropagation();
      },
    },

    {
      title: "ຊື່ພະນັກງານ",
      dataIndex: "record",
      key: "record",
      render: (_: any, record: any) => (
        <div>
          {converGender(record?.gender)} {record?.firstName} {record?.lastName}
        </div>
      ),
    },
    {
      title: "ສາຂາ",
      dataIndex: "branchId",
      key: "branchId",
      width: "200px",
      render: (_: any, record: any) => (
        <div>{record?.branchId?.branchName}</div>
      ),
    },

    {
      title: "ເບີໂທ",
      dataIndex: "phone",
      key: "phone",
      width: "100px",
    },
    {
      title: "ຊື່ເຂົ້າລະບົບ",
      dataIndex: "username",
      key: "username",
      width: "200px",
    },
    {
      title: "ສິດນຳໃຊ້",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        return <span>{converRoleAdmin(role)}</span>; // Ensure you return the role
      },
    },
    {
      title: "ຜູ້ສ້າງ",
      dataIndex: "createdBy",
      key: "createdBy",
      width: "200px",
    },
  ];

  const dataList =
    userData?.employees?.data &&
    userData?.employees?.data?.map((item: any, index: number) => ({
      index: index + 1,
      id: item.id,
      ...item,
    }));

  const handleSearch = () => {
    setFilter({
      ...filter,
      search: search || "",
    });
  };

  return (
    <BoxContainer>
      <Flex justify="space-between" align="center">
        <TextHeader>ຈັດການພະນັກງານສາຂາ</TextHeader>

        <div>
        <ButtonAction
          size="middle"
          label="ເພີ່ມພະນັກງານ"
          type="primary"
          onClick={handleCreate}
          htmlType="button"
          icon={<PlusOutlined />}
        />
        </div>
      </Flex>

      <Divider />

      <Row gutter={10}>
        <Col span="8">
          <Input
            size="large"
            placeholder="ຄົ້ນຫາຕາມຊື່ | ເບີໂທ | ຊື່ເຂົ້າລະບົບ.... ແລ້ວກົດ enter"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span="5">
          <Select
            placeholder="ເບີ່ງຕາມສາຂາ"
            size="large"
            style={{ width: "100%" }}
            onChange={(value: string) =>
              setFilter({
                ...filter,
                branchId: value || "",
              })
            }
          >
            <Option value="">ສະແດງທັງໝົດທຸກສາຂາ</Option>
            {branchData?.Branchs?.data?.map((item: any) => (
              <Option key={item?.id} value={item?.id}>
                {item?.branchName}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <p>{userData?.employees?.total} ລາຍການ</p>

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

      <CreateStaff
        open={isCreated.show}
        onClose={() =>
          setIsCreated({ show: false, data: null, editMode: false })
        }
        data={isCreated.data}
        editMode={isCreated.editMode}
        refetch={refetch}
        branchData={branchData}
      />
    </BoxContainer>
  );
}

export default StaffPage;
