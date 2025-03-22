import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Image,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Steps,
  Table,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DELETE_ITEM_REQUEST_STOCK,
  GET_REQUEST_STOCK,
  UPDATE_STATUS_REQUEST_STOCK,
  // UPDATE_STOCK_MANY_FROM_REQUEST,
} from "../../../services";
import {
  convertStatus,
  convertStatusItemRequest,
  convertStatusRequestStock,
  convertTypeItemRequest,
  formatDate,
} from "../../../utils/helper";
import { consts } from "../../../utils";
import { FiPrinter, FiSend } from "react-icons/fi";
import { MdCancelScheduleSend } from "react-icons/md";
import { FaRegTrashAlt, FaCheckCircle } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import routes from "../../../utils/routes";
import { PrintRequestStock } from "../../../components/PrintRequestStock";
import ReactToPrint from "react-to-print";
import { ColumnsType } from "antd/es/table";

// กำหนด interface สำหรับข้อมูลในตาราง
interface ItemDataType {
  id?: string;
  index: number;
  no: number;
  image?: string;
  productName?: string;
  productId?: {
    price_sale?: number;
    image?: string;
  };
  amountRequest?: number;
  amountApproved?: number;
  status?: string;
  typeAmount?: string;
  amountChecked?: number;
  note?: string;
  edit?: boolean;
}

function RequestStockDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [itemList, setItemList] = useState<any[]>([]);
  //print bill
  const printComponentRef = useRef<any>(null);
  const reactToPrintContent = useRef<any>(null); // Ensure the ref type is correct

  // const [updateStockFromRequest, { loading: updateStockFromRequestLoading }] =
  //   useMutation(UPDATE_STOCK_MANY_FROM_REQUEST, {
  //     onCompleted: () => {
  //       message.success("ອັບເດດຈຳນວນຈັດສົ່ງຕົວຈິງເຂົ້າສະຕ໋ອກແລ້ວ");
  //       loadRequestStock({
  //         fetchPolicy: "network-only",
  //         variables: {
  //           where: {
  //             id: requestId,
  //           },
  //         },
  //       });
  //     },
  //   });

  const [deleteData, { loading: deleteLoading }] = useMutation(
    DELETE_ITEM_REQUEST_STOCK
  );

  const [updateStatusRequestStock, { loading: updateStatusLoading }] =
    useMutation(UPDATE_STATUS_REQUEST_STOCK, {
      onCompleted: () => {
        message.success("ການສ້າງຂໍ້ມູນສຳເລັດ");
        loadRequestStock({
          fetchPolicy: "network-only",
          variables: {
            where: {
              id: requestId,
            },
          },
        });
      },
    });

  // GET_REQUEST_STOCK
  const [loadRequestStock, { data: dataRequestStock, loading }] =
    useLazyQuery(GET_REQUEST_STOCK);

  useEffect(() => {
    if (requestId) {
      loadRequestStock({
        fetchPolicy: "network-only",
        variables: {
          where: {
            id: requestId,
          },
        },
      });
    }
  }, [requestId]);

  useEffect(() => {
    if (dataRequestStock?.requestStock) {
      const items = dataRequestStock?.requestStock?.items?.map((item: any) => ({
        ...item,
        amountApproved:
          detailInfo?.status === "APPROVED"
            ? item?.amountRequest
            : detailInfo?.status === "UPDATE_STOCK_SUCCESS" ||
              detailInfo?.status === "SUCCESS"
            ? item?.amountApproved
            : 0,
      }));
      setItemList(items);
    }
  }, [dataRequestStock?.requestStock]);

  const detailInfo = dataRequestStock && dataRequestStock?.requestStock;

  // กำหนด columns ด้วย type
  const columns: ColumnsType<ItemDataType> = [
    {
      title: "ລຳດັບ",
      dataIndex: "no",
      key: "no",
      width: "65px",
    },
    {
      title: "ຮູບ",
      dataIndex: "image",
      key: "image",
      width: "100px",
      render: (image?: string) => (
        <Image
          src={consts.URL_PHOTO_AW3 + (image || "")}
          alt="image"
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "ຊື່ສິນຄ້າ",
      dataIndex: "productName",
      key: "productName",
      render: (productName?: string, record?: ItemDataType) => (
        <div>
          <div>{productName}</div>
          <div style={{ color: "gray" }}>
            ລາຄາ: {record?.productId?.price_sale ?? "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "ຈ/ນຂໍເພີ່ມ",
      dataIndex: "amountRequest", // ปรับ dataIndex ให้ชัดเจน
      key: "amountRequest",
      render: (_: any, record: ItemDataType) => (
        <>
          {record.edit ? (
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="ປ້ອນຈຳນວນຕ້ອງການຂໍເພີ່ມສະຕ໋ອກ"
              value={record.amountRequest || 0}
              onChange={(value) =>
                handleItemChange(record.index, "amountRequest", value)
              }
            />
          ) : (
            record.amountRequest ?? 0
          )}
        </>
      ),
    },
    {
      title: "ຈ/ນຈັດສົ່ງຕົວຈິງ",
      dataIndex: "amountApproved",
      key: "amountApproved",
      render: (_: any, record: ItemDataType) => (
        <>
          {detailInfo?.status === "APPROVED" && (
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="ປ້ອນຈຳນວນອະນຸມັດຕົວຈິງ"
              value={record.amountApproved}
              onChange={(value) =>
                handleItemChange(record.index, "amountApproved", value)
              }
            />
          )}
          {detailInfo?.status !== "APPROVED" && (record.amountApproved ?? 0)}
        </>
      ),
    },
    {
      title: "ສະຖານະກວດເຄື່ອງ",
      dataIndex: "status",
      key: "status2", // เปลี่ยน key ให้ไม่ซ้ำ
      render: (_: any, record: ItemDataType) => (
        <div>
          <div>ສະຖານະ: {convertStatusItemRequest(record?.status ?? '')}</div>
          <div>ປະເພດຈ/ນ: {convertTypeItemRequest(record?.typeAmount ?? '')}</div>
          <div>
            ຈຳນວນ:{" "}
            {record.typeAmount === "NOT_ENOUGH" ? (
              <span style={{ color: "red" }}>-{record.amountChecked ?? 0}</span>
            ) : record.typeAmount === "OVERDUE" ? (
              <span style={{ color: "green" }}>
                +{record.amountChecked ?? 0}
              </span>
            ) : record.amountChecked ?? 0}
          </div>
        </div>
      ),
    },
    {
      title: "ໝາຍເຫດ",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "ຈັດການ",
      dataIndex: "record",
      key: "action",
      fixed: "right",
      render: (_: any, record: ItemDataType, index: number) => (
        <div>
          {detailInfo?.status !== "SUCCESS" &&
            detailInfo?.status !== "UPDATE_STOCK_SUCCESS" && (
              <Button
                onClick={() => deleteItem(record, index)}
                icon={<FaRegTrashAlt />}
                danger
                ghost
              />
            )}
        </div>
      ),
    },
  ];

  // กำหนด data
  const data: ItemDataType[] =
    itemList?.map((item: any, index: number) => ({
      index,
      no: index + 1,
      ...item,
      image: item?.productId?.image,
    })) || [];

  const handleItemChange = (index: number, key: keyof any, value: any) => {
    // const i = index?.index;
    // อัปเดตสถานะของ cartItems
    setItemList((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], [key]: value || 0 };
      return updatedItems;
    });
    // setSelectedItems(updatedItems);
  };

  const deleteItem = (record: any, index: number) => {
    Modal.confirm({
      title: "ຢືນຢັນການລຶບຂໍ້ມູນ",
      content: (
        <div>
          <div>
            ທ່ານຕ້ອງການລືບຂໍ້ມູນ{" "}
            <span style={{ color: "red" }}>{record?.productName}</span> ນີ້ແທ້
            ຫຼື ບໍ່?
          </div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ລືບ",
      cancelText: "ປິດອອກ",
      okType: "danger",
      async onOk() {
        if (deleteLoading) return;

        const response = await deleteData({
          variables: {
            where: {
              id: record.id,
            },
          },
        });

        if (response?.data?.deleteItemRequestStock?.id) {
          const newCartItem = itemList.filter((_, i) => i !== index); // ลบรายการออกจาก array โดยใช้ index
          setItemList(newCartItem);
          message.success("ລຶບລາຍການສຳລັດ");
        }
      },
    });
  };

  const handleActionRequest = (status: string) => {
    Modal.confirm({
      title: `ຢືນຢັນ ${convertStatusRequestStock(status)}`,
      content: (
        <div>
          <div>ທ່ານຕ້ອງການຢືນຢັນການສົ່ງຂໍ້ມູນນີ້ ແທ້ ຫຼື ບໍ່ ?</div>

          <div style={{ height: 30 }}></div>
        </div>
      ),
      okText: "ກົດເພື່ອຢືນຢັນ",
      cancelText: "ປິດອອກ",
      async onOk() {
        if (updateStatusLoading) return;

        await updateStatusRequestStock({
          variables: {
            data: {
              status: status,
            },
            where: {
              id: detailInfo.id,
            },
          },
        });
      },
    });
  };

  const onBack = () => {
    navigate(routes.REQUEST_STOCK_PAGE);
  };
  const addRequestStock = () => {
    navigate(
      routes.ADD_REQUEST_STOCK +
        "/" +
        detailInfo.id +
        "/" +
        detailInfo?.branchId?.id
    );
  };

  // const handleSaveAddStock = async () => {
  //   if (updateStockFromRequestLoading) return;

  //   if (!itemList || itemList.length <= 0)
  //     return message.warning("ກະລຸນາເພີ່ມລາຍການສິນຄ້າ");

  //   const items = itemList?.map((item: any) => ({
  //     itemId: item.id,
  //     branchId: item?.branchId?.id,
  //     categoryId: item?.categoryId?.id,
  //     productId: item?.productId?.id,
  //     productName: item?.productName,
  //     amountApproved: item?.amountApproved || 0,
  //   }));

  //   Modal.confirm({
  //     title: "ຢືນຢັນການເພີ່ມສະຕ໋ອກ",
  //     content: (
  //       <div>
  //         <div>ຖ້າທ່ານໝັ້ນໃຈ ແລ້ວກະລຸນາກົດຢືນຢັນຂໍ້ມູນ</div>

  //         <div style={{ height: 30 }}></div>
  //       </div>
  //     ),
  //     okText: "ຢືນຢັນການເພີ່ມ",
  //     cancelText: "ປິດອອກ",
  //     async onOk() {
  //       try {
  //         await updateStockFromRequest({
  //           variables: {
  //             data: {
  //               branchId: dataRequestStock?.requestStock?.branchId?.id,
  //               requestStockId: requestId,
  //               orderItems: items,
  //             },
  //           },
  //         });

  //         // setSelectedItems([]);          }
  //       } catch (error: any) {
  //         message.error("ການດຳເນີນການລົ້ມແຫລວ ກະລຸນາກວດຂໍ້ມູນສິນຄ້າຄືນ");
  //       }
  //     },
  //   });
  // };

  const handlePrintBill = () => {
    if (reactToPrintContent.current) {
      reactToPrintContent.current.handlePrint();
    } // Trigger print after saving order
  };

  return (
    <div>
      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
        <Flex justify="space-between" align="center">
          <Breadcrumb
            items={[
              {
                title: (
                  <a href="#" onClick={onBack}>
                    ປະຫວັດການເບີກສະຕ໋ອກ
                  </a>
                ),
              },
              {
                title: "ລາຍລະອຽດການຮ້ອງຂໍສະຕ໋ອກ",
              },
            ]}
          />
          <Space>
            {detailInfo?.status === "SEND_REQUESTING" && (
              <Button
                icon={<FiSend />}
                type="primary"
                onClick={() => handleActionRequest("APPROVED")}
              >
                ຮັບຮູ້ການສັ່ງເຄື່ອງ
              </Button>
            )}

            {detailInfo?.status === "UPDATE_STOCK_SUCCESS" && (
              <Button
                icon={<FaCheckCircle />}
                type="primary"
                onClick={() => handleActionRequest("SUCCESS")}
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                ຢືນຢັນສັ່ງເຄື່ອງສຳເລັດ
              </Button>
            )}
            {(detailInfo?.status === "REQUESTING_CANCEL" ||
              detailInfo?.status === "APPROVED") && (
              <Button
                icon={<MdCancelScheduleSend />}
                danger
                ghost
                onClick={() => handleActionRequest("REJECTED")}
              >
                ປະຕິເສດການສັ່ງເຄື່ອງ
              </Button>
            )}
          </Space>
        </Flex>

        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={6}>
            <Card>
              <div style={{ fontSize: 18 }}>ລາຍລະອຽດ</div>
              <div style={{ height: 20 }}></div>
              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ຊື່ສາຂາ</div>
                <div>{detailInfo?.branchId?.branchName}</div>
              </Flex>

              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ວັນທີແຈ້ງຂໍ</div>
                <div>{formatDate(detailInfo?.createdAt)}</div>
              </Flex>
              <div style={{ height: 10 }}></div>
              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ຊື່ຜູ້ແຈ້ງ</div>
                <div>{detailInfo?.requestBy}</div>
              </Flex>
              <div style={{ height: 10 }}></div>
              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ຜູ້ອະນຸມັດ</div>
                <div>{detailInfo?.approvedBy || "-"}</div>
              </Flex>
              <div style={{ height: 10 }}></div>
              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ວັນທີອະນຸມັດ</div>
                <div>
                  {detailInfo?.dateApproved
                    ? formatDate(detailInfo?.dateApproved)
                    : "-"}
                </div>
              </Flex>

              <div style={{ height: 10 }}></div>
              <Flex justify="space-between" align="center">
                <div style={{ color: "gray" }}>ສະຖານະ</div>
                <div>
                  {detailInfo?.status ? convertStatus(detailInfo?.status) : "-"}
                </div>
              </Flex>
            </Card>
            <div style={{ height: 10 }}></div>

            <Card>
              <div style={{ fontSize: 18 }}>ປະຫວັດການເຄື່ອນໄຫວ</div>
              <div style={{ height: 20 }}></div>
              <Steps
                progressDot
                current={detailInfo?.historyUpdate?.length - 1}
                direction="vertical"
                items={
                  detailInfo?.historyUpdate?.map((item: any) => ({
                    title: convertStatus(item.status),
                    description: `${item.updatedBy} | ${formatDate(
                      item.updatedAt
                    )}`,
                  })) || [] // เพิ่ม fallback เป็น array เปล่าในกรณีที่ historyUpdate เป็น undefined
                }
              />
            </Card>
          </Col>
          <Col span={18}>
            <Card>
              <Flex justify="space-between" align="center">
                <div style={{ fontSize: 18 }}>ລາຍການສິນຄ້າຂໍເພີ່ມສະຕ໋ອກ</div>

                <Space>
                  {/* {detailInfo?.status === "APPROVED" && (
                    <Button
                      icon={<IoMdAdd />}
                      type="primary"
                      ghost
                      style={{ color: "green", borderColor: "green" }}
                      onClick={handleSaveAddStock}
                    >
                      ອັບເດດເຄື່ອງເຂົ້າສະຕ໋ອກ
                    </Button>
                  )} */}

                  <Button
                    icon={<FiPrinter />}
                    type="primary"
                    ghost
                    style={{ color: "#ff9403", borderColor: "#ff9403" }}
                    onClick={handlePrintBill}
                  >
                    ພິມ
                  </Button>
                  {detailInfo?.status !== "SUCCESS" &&
                    detailInfo?.status !== "UPDATE_STOCK_SUCCESS" && (
                      <Button
                        icon={<IoMdAdd />}
                        type="primary"
                        ghost
                        onClick={addRequestStock}
                      >
                        ເພີ່ມລາຍການ
                      </Button>
                    )}
                </Space>
              </Flex>
              <div style={{ height: 10 }}></div>
              {/* <Table
                className={styles.customTable}
                columns={columns}
                dataSource={data}
                rowKey={"no"}
                pagination={false}
                // sticky={{
                //   offsetHeader: 60,
                // }}
                scroll={{ x: "max-content" }}
              /> */}
              <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: "max-content" }}
              />
              
              <div style={{ display: "none" }}>
                <ReactToPrint
                  trigger={() => <></>}
                  content={() => printComponentRef.current}
                  ref={reactToPrintContent}
                />

                <div ref={printComponentRef}>
                  <PrintRequestStock data={detailInfo || null} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default RequestStockDetail;
