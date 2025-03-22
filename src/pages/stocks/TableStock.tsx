import { InputNumber, message, Modal, Table } from "antd";
import { formatNumber } from "../../utils/helper";
import { consts } from "../../utils";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_STOCK_SHOW } from "../../services";

interface ProductData {
  productName?: string; // productName อาจเป็น undefined
  id?: string; // product
}

interface RecordUpdate {
  data: ProductData | null;
  noShow: number;
}

interface StockData {
  dataList: any[];
  userTotal: number;
  filter: any;
  setFilter: (filter: any) => void;
  refetch: () => void;
}

const TableStock: React.FC<StockData> = ({
  dataList,
  userTotal,
  filter,
  setFilter,
  refetch,
}) => {
  const [updateStock] = useMutation(UPDATE_STOCK_SHOW);

  const [recordUpdate, setRecordUpdate] = useState<RecordUpdate>({
    data: null,
    noShow: 0,
  });

  const handleUpdateShow = () => {
    Modal.confirm({
      title: "ຢືນຢັນການແກ້ໄຂຂໍ້ມູນ",
      content: (
        <div>
          ທ່ານຕ້ອງການຈັດລຳດັບສະແດງ{" "}
          <span style={{ color: "red" }}>
            {recordUpdate?.data?.productName || "ກະລຸນາປ້ອນຂໍ້ມູນກ່ອນ"}
          </span>{" "}
          ນີ້ແທ້ ຫຼື ບໍ່?
        </div>
      ),
      okText: "ຢືນຢັນ",
      cancelText: "ປິດອອກ",
      okType: "primary",
      onOk() {
        updateShow();
      },
    });
  };

  const updateShow = async () => {
    try {
      await updateStock({
        variables: {
          data: {
            noShow: recordUpdate?.noShow,
          },
          where: {
            id: recordUpdate?.data?.id,
          },
        },
      });
      setRecordUpdate({
        noShow: 0,
        data: null,
      });
      message.success("ຈັດລຳດັບສະແດງສຳເລັດ");
      refetch(); // รีเฟรชข้อมูล
    } catch (error) {
      message.error("ການອັບເດດລຳດັບສະແດງລົ້ມເຫຼວ");
    }
  };

  const columns = [
    {
      title: "ລຳດັບ",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "ລຳດັບສະແດງ",
      dataIndex: "noShow",
      key: "noShow",
      render: (noShow: number, record: any) => (
        <InputNumber
          min={0}
          defaultValue={noShow}
          value={noShow}
          onChange={(value: number | null) =>
            setRecordUpdate({
              noShow: value || 0,
              data: record,
            })
          }
          onPressEnter={handleUpdateShow}
        />
      ),
    },
    {
      title: "ຮູບ",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={consts.URL_PHOTO_AW3 + image}
          alt="product"
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "ປະເພດ",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "ຈຳນວນ",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "ລາຄາຂາຍ",
      dataIndex: "price_sale",
      key: "price_sale",
    },
  ];

  const data =
    dataList &&
    dataList.map((item, index) => ({
      index: index,
      no: filter.skip + index + 1,
      id: item.id,
      noShow: item.noShow,
      productName: item.productName,
      image: item.productId.image,
      categoryName: item.categoryId.categoryName,
      amount: formatNumber(item.amount),
      price_sale: formatNumber(item.productId.price_sale),
    }));

  const handleNextPage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      skip: (page - 1) * (pageSize || filter.limit),
      limit: pageSize || filter.limit,
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>ລາຍການທັງໝົດ {userTotal} ລາຍການ</p>
      </div>

      <div><span style={{color:"#000", fontWeight:"bold"}}>ວິທີຈັດລຽງສະແດງ:</span> ໃຫ້ປ່ຽນເລກໃນບ໋ອກທີ່ສະແດງ ແລະ ກົດ Enter ເພື່ອຢືນຢັນ</div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: filter.skip / filter.limit + 1,
          total: userTotal,
          pageSize: filter.limit,
          onChange: handleNextPage,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} ລາຍການ`,
        }}
        sticky={{
          offsetHeader: 60,
        }}
      />
    </div>
  );
};

export default TableStock;
