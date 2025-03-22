import styles from "../../styles/User.module.css";
import { useState } from "react";
import {
  addOneDate,
  currentDate,
} from "../../utils/helper";
import { useQuery } from "@apollo/client";
import { BRANCHS, HISTORY_STOCKS } from "../../services";
import { Spin } from "antd";
import TableHistory from "./TableHistory";
import FilterHistory from "./FilterHistory";
import { BoxContainer, TextHeader } from "../../components/stylesComponent/otherComponent";

interface FilterProps {
  from_date?: string;
  to_date?: string;
  limit: number;
  skip: number;
  productName?: string;
  status?: string;
  branchId?: string;
}

const HistoryStockList: React.FC = () => {
  const [filter, setFilter] = useState<FilterProps>({
    from_date: currentDate().startDate,
    to_date: currentDate().endDate,
    skip: 0,
    limit: 25,
  });


  const { data: branchData } = useQuery(BRANCHS, {
    fetchPolicy: "network-only",
  });

  // Get stocks with useFetchData hook
  const { loading, data: historyStockData } = useQuery(HISTORY_STOCKS, {
    fetchPolicy: "network-only",
    variables: {
      where: {
        branchId: filter?.branchId || undefined,
        productName: filter?.productName || undefined,
        status: filter?.status || undefined,
        from_date: filter?.from_date || undefined,
        to_date: addOneDate(filter?.to_date) || undefined,
      },
      skip: filter?.skip,
      limit: filter?.limit,
    },
  });

  return (
    <div>
      <BoxContainer>
        <div className={styles.headerTitle}>
          <TextHeader>ປະຫວັດການເຄື່ອນໄຫວສະຕ໋ອກ</TextHeader>
        </div>
        <div style={{ height: 10 }}></div>

        {/* Filter */}
        <FilterHistory filter={filter} setFilter={setFilter}     branchData={branchData} />
        <div style={{ height: 10 }}></div>

        {/* Show data */}
        <Spin size="large" spinning={loading} tip="ກຳລັງໂຫລດຂໍ້ມູນ...">
          <TableHistory
            dataList={historyStockData?.historystocks?.data}
            dataTotal={historyStockData?.historystocks?.total}
            filter={filter}
            setFilter={setFilter}
        
          />
        </Spin>
      </BoxContainer>
    </div>
  );
};

export default HistoryStockList;
