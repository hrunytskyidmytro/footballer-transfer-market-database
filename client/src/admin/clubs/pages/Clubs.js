import React, { useEffect, useState } from "react";
import { Table, Space, Dropdown, Image } from "antd";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const Clubs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );

        setLoadedClubs(responseData.clubs);
      } catch (err) {}
    };
    fetchClubs();
  }, [sendRequest]);

  const items = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "Delete",
    },
  ];

  const onMenuClick = (e) => {
    console.log("click", e);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={100} src={`http://localhost:5001/${image}`} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Foundation year",
      dataIndex: "foundationYear",
      key: "foundationYear",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      key: "action",
      render: (_) => (
        <Space size="middle">
          <Dropdown.Button
            menu={{
              items,
              onClick: onMenuClick,
            }}
          >
            Actions
          </Dropdown.Button>
        </Space>
      ),
    },
  ];

  const data = loadedClubs
    ? loadedClubs.map((club) => ({
        key: club.id,
        image: club.image,
        name: club.name,
        country: club.country,
        cost: club.cost,
        foundationYear: club.foundationYear,
        description: club.description,
      }))
    : [];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedClubs && (
        <Table columns={columns} dataSource={data} pagination={true} />
      )}
    </React.Fragment>
  );
};

export default Clubs;
