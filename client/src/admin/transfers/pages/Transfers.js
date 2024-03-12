import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Space,
  Table,
  Image,
  Flex,
  Button,
  Input,
  Select,
  Tooltip,
  Modal,
  Spin,
  Tag,
  Divider,
  Slider,
  Pagination,
  message,
} from "antd";
import {
  EuroCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
  FilterOutlined,
  FilterFilled,
} from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Transfers = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState();
  const [typesList, setTypesList] = useState();
  const [seasonsList, setSeasonsList] = useState();

  const [sortCriteria, setSortCriteria] = useState("transferDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [feeFrom, setFeeFrom] = useState("");
  const [feeTo, setFeeTo] = useState("");
  const [compAmountFrom, setCompAmountFrom] = useState("");
  const [compAmountTo, setCompAmountTo] = useState("");
  const [transferType, setTransferType] = useState("");
  const [season, setSeason] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedTransferId, setDeletedTransferId] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [feeError, setFeeError] = useState("");
  const [compensationAmountError, setCompensationAmountError] = useState("");

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/transfers?sortBy=${sortCriteria}&sortDir=${sortDirection}&transferType=${transferType}&season=${season}&feeFrom=${feeFrom}&feeTo=${feeTo}&compAmountFrom=${compAmountFrom}&compAmountTo=${compAmountTo}&page=${currentPage}&pageSize=${pageSize}`
        );
        setLoadedTransfers(responseData.transfers);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchTransfers();
  }, [
    sortCriteria,
    sortDirection,
    transferType,
    season,
    feeFrom,
    feeTo,
    compAmountFrom,
    compAmountTo,
    currentPage,
    pageSize,
    sendRequest,
  ]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/transfers/${deletedTransferId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedTransferId(null);
      setLoadedTransfers((prevTransfers) =>
        prevTransfers.filter((transfer) => transfer.id !== deletedTransferId)
      );
      message.success("Transfer successfully deleted!");
    } catch (err) {}
  };

  useEffect(() => {
    const fetchTransfersTypes = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/transfers/"
        );
        const types = response.transfers.map(
          (transfer) => transfer.transferType
        );
        const uniqueTypes = [...new Set(types)];
        setTypesList(uniqueTypes);
      } catch (err) {}
    };
    fetchTransfersTypes();
  }, [sendRequest]);

  useEffect(() => {
    const fetchTransfersTypes = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/transfers/"
        );
        const types = response.transfers.map(
          (transfer) => transfer.transferType
        );
        const uniqueTypes = [...new Set(types)];
        setTypesList(uniqueTypes);
      } catch (err) {}
    };
    fetchTransfersTypes();
  }, [sendRequest]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/transfers/"
        );
        const seasons = response.transfers.map((transfer) => transfer.season);
        const uniqueSeasons = [...new Set(seasons)];
        setSeasonsList(uniqueSeasons);
      } catch (err) {}
    };
    fetchSeasons();
  }, [sendRequest]);

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedTransferId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSortCriteriaChange = (value) => {
    setSortCriteria(value);
  };

  const handleSortDirectionChange = (value) => {
    setSortDirection(value);
  };

  const handleTransferTypeChange = (value) => {
    setTransferType(value);
    setIsFiltering(true);
  };

  const handleSeasonChange = (value) => {
    setSeason(value);
    setIsFiltering(true);
  };

  const handleFeeFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 50000000) {
      setFeeError("Fee must be between 0 and 50,000,000.");
    } else {
      setFeeError("");
      setFeeFrom(value);
      setIsFiltering(true);
    }
  };

  const handleFeeToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 50000000) {
      setFeeError("Fee must be between 0 and 50,000,000.");
    } else {
      setFeeError("");
      setFeeTo(value);
      setIsFiltering(true);
    }
  };

  const handleCostSliderChange = (value) => {
    setFeeFrom(value[0]);
    setFeeTo(value[1]);
    setIsFiltering(true);
  };

  const handleCompAmountFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 5000000) {
      setCompensationAmountError(
        "Compensation amount must be between 0 and 50,000,000."
      );
    } else {
      setCompensationAmountError("");
      setCompAmountFrom(value);
      setIsFiltering(true);
    }
  };

  const handleCompAmountToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 5000000) {
      setCompensationAmountError(
        "Compensation amount must be between 0 and 50,000,000."
      );
    } else {
      setCompensationAmountError("");
      setCompAmountTo(value);
      setIsFiltering(true);
    }
  };

  const handleCompAmountSliderChange = (value) => {
    setCompAmountFrom(value[0]);
    setCompAmountTo(value[1]);
    setIsFiltering(true);
  };

  const toggleFilterFormVisibility = () => {
    setIsFilterFormVisible(!isFilterFormVisible);
  };

  const handleClearFilters = () => {
    setTransferType("");
    setSeason("");
    setFeeFrom("");
    setFeeTo("");
    setCompAmountFrom("");
    setCompAmountTo("");
    setIsFiltering(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(current);
  };

  const columns = [
    {
      title: "Footballer image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={100} src={`http://localhost:5001/${image}`} />
      ),
    },
    {
      title: "Footballer name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Footballer surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "From club",
      dataIndex: "fromClub",
      key: "fromClub",
    },
    {
      title: "To club",
      dataIndex: "toClub",
      key: "toClub",
    },
    {
      title: "Transfer's fee",
      dataIndex: "transferFee",
      key: "transferFee",
      render: (transferFee) => {
        const formattedTransferFee = transferFee
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedTransferFee} €`;
      },
    },
    {
      title: "Transfer's date",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Contact transfer until",
      dataIndex: "contractTransferUntil",
      key: "contractTransferUntil",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Transfer's type",
      dataIndex: "transferType",
      key: "transferType",
      render: (type) => {
        let tagColor = "";
        switch (type) {
          case "free":
            tagColor = "blue";
            break;
          case "rent":
            tagColor = "green";
            break;
          case "full_contract":
            tagColor = "orange";
            break;
          default:
            tagColor = "blue";
        }
        return <Tag color={tagColor}>{type}</Tag>;
      },
    },
    {
      title: "Season",
      dataIndex: "season",
      key: "season",
    },
    {
      title: "Compensation amount",
      dataIndex: "compensationAmount",
      key: "compensationAmount",
      render: (compensationAmount) => {
        const formattedCompAmount = compensationAmount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedCompAmount} €`;
      },
    },
    {
      key: "action",
      render: (transfer) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/transfers/${transfer.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(transfer.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedTransfers
    ? loadedTransfers.map((transfer) => ({
        key: transfer.id,
        image: transfer.footballer ? transfer.footballer.image : "Not found",
        name: transfer.footballer ? transfer.footballer.name : "Not found",
        surname: transfer.footballer
          ? transfer.footballer.surname
          : "Not found",
        fromClub: transfer.fromClub ? transfer.fromClub.name : "Not found",
        toClub: transfer.toClub ? transfer.toClub.name : "Not found",
        transferFee: transfer.transferFee,
        transferDate: transfer.transferDate,
        transferType: transfer.transferType,
        season: transfer.season,
        compensationAmount: transfer.compensationAmount,
        contractTransferUntil: transfer.contractTransferUntil,
      }))
    : [];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <div className="center">
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/admins/transfers/new">
            <Button type="primary">Add Transfer</Button>
          </Link>
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <Tooltip title="Select sorting criteria" placement="top">
            <Select
              defaultValue="transferDate"
              onChange={handleSortCriteriaChange}
              style={{ width: 140, marginBottom: "1rem", marginRight: "1rem" }}
            >
              <Select.Option value="transferDate">
                Transfer's date
              </Select.Option>
              <Select.Option value="transferFee">Transfer's fee</Select.Option>
            </Select>
          </Tooltip>
          <Tooltip title="Select sorting direction" placement="top">
            <Select
              defaultValue="asc"
              onChange={handleSortDirectionChange}
              style={{ width: 120, marginBottom: "1rem" }}
            >
              <Select.Option value="asc">Asc</Select.Option>
              <Select.Option value="desc">Desc</Select.Option>
            </Select>
          </Tooltip>
        </div>
        <Tooltip title="Set the filters" placement="top">
          <Button onClick={toggleFilterFormVisibility}>
            {isFilterFormVisible ? (
              <>
                <FilterOutlined /> Hide filters
              </>
            ) : (
              <>
                <FilterFilled /> Show filters
              </>
            )}
          </Button>
        </Tooltip>
      </div>
      <br />
      {isFilterFormVisible && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Divider orientation="left">Type</Divider>
          <Tooltip title="Select the transfer's type" placement="top">
            <Select
              placeholder="Select type"
              onChange={handleTransferTypeChange}
              value={transferType}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Transfer's types</Select.Option>
              {typesList &&
                typesList.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
          <br />
          <br />
          <Divider orientation="left">Season</Divider>
          <Tooltip title="Select the season" placement="top">
            <Select
              placeholder="Select season"
              onChange={handleSeasonChange}
              value={season}
              style={{ width: 200 }}
            >
              <Select.Option value="">All seasons</Select.Option>
              {seasonsList &&
                seasonsList.map((season) => (
                  <Select.Option key={season} value={season}>
                    {season}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
          <br />
          <br />
          <Divider orientation="left">Fee</Divider>
          {feeError && <p style={{ color: "red" }}>{feeError}</p>}
          <Tooltip title="Select the minimum transfer's fee" placement="top">
            <Input
              type="number"
              placeholder="Fee from"
              value={feeFrom}
              min={0}
              max={50000000}
              onChange={handleFeeFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <Tooltip title="Select the maximum transfer's fee" placement="top">
            <Input
              type="number"
              placeholder="Fee to"
              value={feeTo}
              min={0}
              max={50000000}
              onChange={handleFeeToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Slider
              range
              min={0}
              max={50000000}
              step={1}
              value={[feeFrom, feeTo]}
              defaultValue={[0, 100]}
              onChange={handleCostSliderChange}
              style={{ width: 400 }}
            />
          </div>
          <br />
          <br />
          <Divider orientation="left">Compensation Amount</Divider>
          {compensationAmountError && (
            <p style={{ color: "red" }}>{compensationAmountError}</p>
          )}
          <Tooltip
            title="Select the minimum transfer's compensation amount"
            placement="top"
          >
            <Input
              type="number"
              placeholder="Fee from"
              value={compAmountFrom}
              min={0}
              max={5000000}
              onChange={handleCompAmountFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <Tooltip
            title="Select the maximum transfer's compensation amount"
            placement="top"
          >
            <Input
              type="number"
              placeholder="Fee to"
              value={compAmountTo}
              min={0}
              max={5000000}
              onChange={handleCompAmountToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Slider
              range
              min={0}
              max={5000000}
              step={1}
              value={[compAmountFrom, compAmountTo]}
              defaultValue={[0, 100]}
              onChange={handleCompAmountSliderChange}
              style={{ width: 400 }}
            />
          </div>
          <br />
          <Button onClick={handleClearFilters} disabled={!isFiltering}>
            Clear Filters
          </Button>
        </div>
      )}
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={confirmDeleteHandler}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        Do you want to proceed and delete this transfer? Please note that it
        can't be undone thereafter.
      </Modal>
      {!isLoading && (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={[2, 4, 10, 20]}
          responsive={true}
          showTotal={(total) => `All ${total}`}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </React.Fragment>
  );
};

export default Transfers;
