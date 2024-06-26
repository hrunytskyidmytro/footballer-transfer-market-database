import React from "react";
import { Button, Result } from "antd";

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" href="/admins">
          Back to Admin Home
        </Button>
      }
    />
  );
};
export default NotFoundPage;
