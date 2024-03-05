import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { Column, Line, Pie } from "@ant-design/plots";
import moment from "moment";

import { useHttpClient } from "../../../shared/hooks/http-hook";

const Statistics = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState();
  const [loadedFootballers, setLoadedFootballers] = useState();

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/transfers/"
        );
        setLoadedTransfers(response.transfers);
      } catch (err) {}
    };
    fetchTransfers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/footballers/"
        );
        setLoadedFootballers(response.footballers);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  const columnData = loadedTransfers
    ? loadedTransfers.map((transfer) => ({
        footballer: `${transfer.footballer.name} ${transfer.footballer.surname}`,
        transferFee: transfer.transferFee,
        transferDate: `${moment(transfer.transferDate).format("MMMM Do YYYY")}`,
      }))
    : [];

  const lineData = loadedTransfers
    ? loadedTransfers.map((transfer) => ({
        transferDate: moment(transfer.transferDate).format("MMMM Do YYYY"),
        transferFee: transfer.transferFee,
      }))
    : [];

  const columnConfig = {
    data: columnData,
    isGroup: true,
    xField: "footballer",
    yField: "transferFee",
    seriesField: "transferDate",
    columnWidthRatio: 0.5,
    meta: {
      footballer: { alias: "Footballer" },
      transferFee: { alias: "Transfer Fee" },
      transferDate: { alias: "Transfer Date" },
    },
  };

  const lineConfig = {
    data: lineData,
    xField: "transferDate",
    yField: "transferFee",
    meta: {
      transferDate: { alias: "Transfer Date" },
      transferFee: { alias: "Transfer Fee" },
    },
  };

  return (
    <>
      {isLoading && <Spin size="large" />}
      {!isLoading && loadedTransfers && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1 }}>
            <h2>Column Chart</h2>
            <Column {...columnConfig} />
          </div>
          <div style={{ flex: 1 }}>
            <h2>Line Chart</h2>
            <Line {...lineConfig} />
          </div>
        </div>
      )}
    </>
  );
};

export default Statistics;
