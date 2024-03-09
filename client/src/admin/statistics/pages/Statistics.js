import React, { useState, useEffect } from "react";
import { Select, Empty, Spin } from "antd";
import { Line, Column, Pie } from "@ant-design/plots";

import { useHttpClient } from "../../../shared/hooks/http-hook";

const { Option } = Select;

const Statistics = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const [statistics, setStatistics] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/statistics/"
        );
        setStatistics(response.statistics);
        setSelectedData(response.statistics.transferData);
      } catch (err) {}
    };
    fetchStatistics();
  }, [sendRequest]);

  const handleDataChange = (value) => {
    if (value === "transfers") {
      setSelectedData(statistics.transferData);
    } else if (value === "transferCountsByMonth") {
      setSelectedData(statistics.transferCountsByMonth);
    } else if (value === "transferCountByType") {
      setSelectedData(statistics.transferCountByType);
    }
  };

  return (
    <>
      {isLoading && <Spin size="large" />}
      {!isLoading && statistics && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "20px" }}>
            <Select defaultValue="transfers" onChange={handleDataChange}>
              <Option value="transfers">Transfers Data</Option>
              <Option value="transferCountsByMonth">
                Transfer Counts by Month
              </Option>
              <Option value="transferCountByType">
                Transfer Count by Type
              </Option>
            </Select>
          </div>
          <div style={{ flex: 1 }}>
            {selectedData && selectedData.length > 0 ? (
              <>
                {selectedData[0].transferDate ? (
                  <h2>Line Diagram of Transfer Data Transfer</h2>
                ) : (
                  <>
                    {selectedData[0].month ? (
                      <h2>Column Chart of Transfer Counts by Month</h2>
                    ) : (
                      <h2>Pie Chart of Transfer Count by Type</h2>
                    )}
                  </>
                )}
                {selectedData[0].transferDate ? (
                  <Line
                    data={selectedData}
                    xField="transferDate"
                    yField="transferFee"
                    meta={{
                      transferDate: { alias: "Transfer Date" },
                      transferFee: { alias: "Transfer Fee" },
                    }}
                  />
                ) : selectedData[0].month ? (
                  <Column
                    data={selectedData}
                    xField="month"
                    yField="count"
                    meta={{
                      month: { alias: "Month" },
                      count: { alias: "Transfer Count" },
                    }}
                  />
                ) : (
                  <Pie
                    data={selectedData}
                    angleField="count"
                    colorField="transferType"
                    legend={{
                      layout: "horizontal",
                      position: "bottom",
                    }}
                  />
                )}
              </>
            ) : (
              <Empty description="No data available" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Statistics;
