import styles from "../../styles/User.module.css";
import { useState } from "react";
import TableStock from "./TableStock";
import FilterStock from "./FilterStock";
import { getUserDataFromLCStorage } from "../../utils/helper";
import { useQuery } from "@apollo/client";
import { GET_BRANCH_STOCKS } from "../../services";
import { Spin } from "antd";


interface  FilterProps{
    skip: number;
    limit: number;
    productName?: string;
}


const StockList: React.FC = () => {
  const branchInfo = getUserDataFromLCStorage();
  const [filter, setFilter] = useState<FilterProps>({ skip: 0, limit: 25 });

  // Get stocks with useFetchData hook


  const {
    loading,
    data: stockData,
    refetch,
  } = useQuery(GET_BRANCH_STOCKS, {
    fetchPolicy:"network-only",
    variables: {
      where: {
        branchId: branchInfo?.branchId?.id || undefined,
        productName: filter?.productName || undefined,
      },
      skip: filter?.skip,
      limit: filter?.limit,
    },
  });

  const reloadStock = () => {
     refetch();
  }


  return (
    <div>
      <div className={styles.headerTitle}>
        <h1>ລາຍການສິນຄ້າໃນສະຕ໋ອກ</h1>
      </div>
      <div style={{ height: 10 }}></div>


      {/* Filter */}
      <FilterStock filter={filter} setFilter={setFilter} />
      <div style={{ height: 10 }}></div>

      {/* Show data */}
      <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
         <TableStock
          dataList={stockData?.stocks?.data}
          userTotal={stockData?.stocks?.total}
          filter={filter}
          setFilter={setFilter}
          refetch={reloadStock}
          
        />  
      </Spin>
    </div>
  );
};

export default StockList;
