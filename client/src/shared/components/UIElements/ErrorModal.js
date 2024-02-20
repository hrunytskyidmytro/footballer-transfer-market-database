import { Modal } from "antd";
import { Button } from "antd";

// import Modal from './Modal';
// import Button from '../FormElements/Button';

const ErrorModal = (props) => {
  return (
    <Modal
      title="An Error Occurred!"
      open={!!props.error}
      onCancel={props.onClear}
      footer={[
        <Button key="ok" type="primary" onClick={props.onClear}>
          OK
        </Button>,
      ]}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

// const ErrorModal = (props) => {
//   if (!!props.error) {
//     Modal.error({
//       title: "An Error Occurred!",
//       content: props.error,
//       onOk: props.onClear,
//     });
//   }

//   return null;
// };

export default ErrorModal;
