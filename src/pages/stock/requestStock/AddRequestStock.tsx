import styles from "../../../styles/User.module.css";
import { useEffect, useState } from "react";
import { formatNumber, getUserDataFromLCStorage } from "../../../utils/helper";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BRANCH_STOCK_BACK_LISTS, UPDATE_ADD_REQUEST_STOCK } from "../../../services";
import {
  Affix,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Spin,
  Table,
} from "antd";
import ButtonAction from "../../../components/ButtonAction";
import { consts } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import * as _ from "lodash";
import routes from "../../../utils/routes";
import ConfirmAddRequestStock from "./component/ConfirmAddRequestStock";

type SelectItems = {
  image: string;
  categoryId: string;
  productId: string;
  productName: string;
  branchId: string;
  price_sale: number;
  amount: string;
  amountRequest: number;
  note: string;
};

const AddRequestStock: React.FC = () => {
  const { requestId,branchId } = useParams();
  const navigate = useNavigate();
  const branchInfo = getUserDataFromLCStorage();
  const [selectedItems, setSelectedItems] = useState<SelectItems[]>([]);
  const [confirmRequest, setConfirmRequest] = useState(false);
  // Get stocks with useFetchData hook

  const { loading, data: stockData } = useQuery(GET_BRANCH_STOCK_BACK_LISTS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: branchId || undefined,
      },
    },
  });

  //mutation
  const [updateAddRequestStock, { loading: updateLoading }] = useMutation(
    UPDATE_ADD_REQUEST_STOCK,
    {
      onCompleted: () => {
        message.success(`ເພີ່ມສະຕ໋ອກສຳເລັດ`);
        setConfirmRequest(false);
        navigate(routes.REQUEST_STOCK_DETAIL + "/" + requestId);
      },
    }
  );

  useEffect(() => {
    if (stockData?.branchStocks?.data) {
      const allItems = stockData?.branchStocks?.data?.map((item: any) => ({
        image: item.productId.image,
        categoryId: item.categoryId?.id,
        productId: item.productId.id,
        productName: item.productName,
        branchId: item.branchId.id,
        price_sale: item.productId.price_sale,
        amount: item.amount,
        amountRequest: 0,
        note: "",
      }));

      setSelectedItems(allItems);
    }
  }, [stockData?.branchStocks?.data]);

  const columns = [
    {
      title: "ລຳດັບ",
      dataIndex: "index",
      key: "index",
      width: "100px",
    },
    {
      title: "ຮູບ",
      dataIndex: "image",
      key: "image",
      width: "100px",
      render: (image: string) => (
        <Image
          src={consts.URL_PHOTO_AW3 + image}
          alt="image"
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
      render: (productName: string, record: any) => (
        <div>
          <div>{productName}</div>
          <div style={{ color: "gray" }}>ລາຄາ:{record?.price_sale}</div>
        </div>
      ),
    },
    {
      title: "ຈຳນວນຍັງເຫຼືອ",
      dataIndex: "amount",
      key: "amount",
      width: "150px",
    },
    {
      title: "ຈຳນວນຕ້ອງການຂໍເພີ່ມສະຕ໋ອກ",
      dataIndex: "amountRequest",
      key: "amountRequest",
      render: (amountRequest: number, record: any) => (
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="ປ້ອນຈຳນວນຕ້ອງການຂໍເພີ່ມສະຕ໋ອກ"
          value={amountRequest || 0}
          onChange={(value) =>
            handleItemChange(record?.index, "amountRequest", value)
          }
        />
      ),
    },
    {
      title: "ລາຍລະອຽດຂໍເບີກ",
      dataIndex: "note",
      key: "note",
      render: (note: string, record: any) => (
        <Input
          value={note || ""}
          placeholder="ປ້ອນລາຍລະອຽດການຂໍເພີ່ມສະຕ໋ອກ"
          onChange={(value) =>
            handleItemChange(record?.index, "note", value?.target?.value)
          }
        />
      ),
    },
  ];

  const data =
    selectedItems &&
    selectedItems.map((item: any, index: number) => ({
      index: index,
      ...item,
      productName: item.productName,
      image: item.image,
      categoryName: item.categoryName,
      amount: formatNumber(item.amount),
      price_sale: formatNumber(item.price_sale),
      amountRequest: item.amountRequest,
      note: item.note,
    }));

  const handleItemChange = (
    index: number,
    key: keyof SelectItems,
    value: any
  ) => {
    // const i = index?.index;
    // อัปเดตสถานะของ cartItems
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], [key]: value };
      return updatedItems;
    });
    // setSelectedItems(updatedItems);
  };

  const handleConfirm = () => {
    if (updateLoading) return;

    const items = selectedItems
      ?.filter((qty: any) => qty.amountRequest)
      ?.map((item: any) => ({
        categoryId: item.categoryId,
        productId: item.productId,
        branchId: branchInfo?.branchId?.id,
        productName: item.productName,
        amount: item.amount,
        amountRequest: item.amountRequest,
        note: item.note,
      }));

    Modal.confirm({
      title: "ຢືນຢັນການຂໍເພີ່ມສະຕ໋ອກ",
      content: (
        <div>
          <div>ຖ້າທ່ານໝັ້ນໃຈແລ້ວ ກະລຸນາກົດຢືນຢັນຂໍ້ມູນ</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນການເພີ່ມ",
      cancelText: "ປິດອອກ",
      async onOk() {
        try {
          await updateAddRequestStock({
            variables: {
              data: {
                branchId: branchInfo?.branchId?.id,
                items: items,
              },
              where: {
                id: requestId,
              },
            },
          });
        } catch (error: any) {
          message.error("ການດຳເນີນການລົ້ມແຫລວ ກະລຸນາກວດຂໍ້ມູນສິນຄ້າຄືນ");
        }
      },
    });
  };

  const handleCancelRequestStock = () => {
    Modal.confirm({
      title: "ຢືນຢັນການຍົກເລິກຂໍເພີ່ມສະຕ໋ອກ",
      content: (
        <div>
          <div>ທ່ານຕ້ອງການຍົກເລິກການຂໍເພີ່ມສະຕ໋ອກ ແທ້ ຫຼື ບໍ່ ?</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ຢືນຢັນການ",
      cancelText: "ປິດອອກ",
      onOk() {
        navigate(routes.REQUEST_STOCK_DETAIL + '/' + requestId);
      },
    });
  };

  return (
    <div>
 <Affix offsetTop={50}>
      <div className={styles.headerTitle} style={{backgroundColor:"#fff", padding:10,borderRadius:8}}>
        <div>
          <div style={{ fontSize: 20 }}>ລາຍການສິນຄ້າ</div>
          <div style={{ color: "gray" }}>
            ກະລຸນາປ້ອນຈຳນວນ ແລະ ລາຍລະອຽດເພື່ອ ຂໍເພີ່ມສະຕ໋ອກ
          </div>
        </div>
        <Space>
          <ButtonAction
            label="ຢືນຢັນລາຍການ"
            onClick={() => setConfirmRequest(true)}
            htmlType="button"
            type="text"
            disabled={_.isEmpty(
              selectedItems?.filter((qty: any) => qty.amountRequest)
            )}
            style={{ backgroundColor: "#1976d2", color: "#fff" }}
          />
          <ButtonAction
            label="ຍົກເລິກການຂໍເພີ່ມສະຕ໋ອກ"
            onClick={handleCancelRequestStock}
            htmlType="button"
            type="text"
            color="gray"
            style={{ backgroundColor: "#eee" }}
          />
        </Space>
      </div>
      </Affix>

      <div style={{ height: 10 }}></div>

      {/* Show data */}
      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          sticky={{
            offsetHeader: 120,
          }}
        />
      </Spin>

      <ConfirmAddRequestStock
        open={confirmRequest}
        data={selectedItems}
        onClose={() => setConfirmRequest(false)}
        handleConfirm={handleConfirm}
      />
    </div>
  );
};

export default AddRequestStock;
