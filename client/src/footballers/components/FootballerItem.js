import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./FootballerItem.css";

const FootballlerItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log("DELETING...");
  };

  return (
    <React.Fragment>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="footballer-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this footballler? Please note that
          it can't be undone thereafter.
        </p>
      </Modal>
      <li className="footballer-item">
        <Card className="footballer-item__content">
          <div className="footballer-item__image">
            <img src={props.image} alt={props.name} />
          </div>
          <div className="footballer-item__info">
            <h2>{props.name}</h2>
            <h2>{props.surname}</h2>
            <h3>{props.nationality}</h3>
            <h3>{props.birthDate}</h3>
            <h3>{props.position}</h3>
          </div>
          <div className="footballer-item__actions">
            <Button inverse>MORE INFORMATION</Button>
            {auth.isLoggedIn && (
              <Button to={`/footballers/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default FootballlerItem;
