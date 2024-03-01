import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Col, Row, Avatar, Spin } from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Agents = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/agents/"
        );

        setLoadedAgents(responseData.agents);
      } catch (err) {}
    };
    fetchAgents();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Row gutter={[40, 40]}>
          {!isLoading &&
            loadedAgents &&
            loadedAgents.map((agent) => (
              <Col
                span={6}
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                key={agent.id}
              >
                <Link to={`/agents/${agent.id}`}>
                  <Card
                    hoverable
                    style={{ width: "100%", minHeight: "200px" }}
                    cover={
                      <div style={{ textAlign: "center" }}>
                        <Avatar
                          size={64}
                          src={`http://localhost:5001/${agent.image}`}
                          alt={`${agent.name} ${agent.surname}`}
                          style={{ margin: 10 }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={`${agent.name} ${agent.surname}`}
                      description={
                        <Typography.Text copyable>
                          {agent.email}
                        </Typography.Text>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
        </Row>
      </div>
      {/* <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={loadedAgents}
        renderItem={(agent) => (
          <List.Item>
            <Link to={`/agents/${agent.id}`}>
              <Card
                hoverable
                style={{ width: "100%", minHeight: "200px" }}
                cover={
                  <div style={{ textAlign: "center" }}>
                    <Avatar
                      size={64}
                      src={`http://localhost:5001/${agent.image}`}
                      alt={`${agent.name} ${agent.surname}`}
                      style={{ margin: 10 }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={`${agent.name} ${agent.surname}`}
                  description={
                    <Typography.Text copyable>{agent.email}</Typography.Text>
                  }
                />
              </Card>
            </Link>
          </List.Item>
        )}
      /> */}
    </React.Fragment>
  );
};

export default Agents;
