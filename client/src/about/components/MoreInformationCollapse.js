import React from "react";
import { Collapse } from "antd";

const MoreInformationCollapse = () => (
  <Collapse
    items={[
      {
        key: "1",
        label: "Privacy Policy",
        children: (
          <p>
            This project respects user privacy and adheres to strict data
            protection regulations.
          </p>
        ),
      },
      {
        key: "2",
        label: "Terms of Service",
        children: (
          <p>
            By using this platform, you agree to abide by our terms and
            conditions.
          </p>
        ),
      },
    ]}
  />
);

export default MoreInformationCollapse;
