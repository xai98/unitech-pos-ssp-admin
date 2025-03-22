import { Modal } from "antd";
import React from "react";
import {
  CellTd,
  CellTh,
} from "../../../components/stylesComponent/otherComponent";
import { formatNumber } from "../../../utils/helper";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any[];
  selectBranch: string;
  branchList: any[];
  handleSaveAddStock: () => void;
}

const ConfirmAddStock: React.FC<Props> = ({
  open,
  onClose,
  data,
  selectBranch,
  branchList,
  handleSaveAddStock
}) => {


  const branchname = branchList && branchList.find(branch => branch.id === selectBranch)?.branchName;



  return (
    <div>
      <Modal
        title={`ຂໍ້ມູນລາຍການສິນຄ້າເພີ່ມສະຕ໋ອກສາຂາ: ${branchname}`}
        open={open}
        onOk={handleSaveAddStock}
        onCancel={onClose}
        width={1000}
        cancelText={"ປິດອອກ"}
        okText={'ຢືນຢັນການເພີ່ມ'}
      >
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              <tr>
                <CellTh>#</CellTh>
                <CellTh style={{ textAlign: "left" }}>ລາຍການ</CellTh>
                <CellTh>ຈຳນວນ</CellTh>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.map((item, index) => (
                  <tr key={index}>
                    <CellTd>{index + 1}</CellTd>
                    <CellTd style={{ textAlign: "left" }}>
                      {item?.productName}
                    </CellTd>
                    <CellTd>{formatNumber(item?.amount || 0)}</CellTd>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmAddStock;
