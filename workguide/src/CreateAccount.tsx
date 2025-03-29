import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor } from "@fortawesome/free-solid-svg-icons";
import { faSass } from "@fortawesome/free-brands-svg-icons";
import logo from "./components/images/logo.png";
import  { CreateAccountForm } from './components/accountControl/CreateAccount'
import './TwoColumnLayout.css';

const CreateAccount: React.FC = () => {
  return (
    <div className="d-md-flex h-md-100 align-items-center">
      {/* First Half */}
      <div className="col-md-6 p-0 bg-image h-md-100">
        <div className="text-black d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
          <div className="logoarea pt-5 pb-5">
            <p>
              <img src={logo} alt="Logo" width="362" height="89" style={{ marginTop: "-200px" }} />
            </p>
            <h1 className="mb-0 mt-3 text-[24px] font-poppins font-bold pb-3">Welcome to AirPhoton WorkGuide</h1>
            <h5 className="mb-4 font-weight-light mt-3">
              AirPhoton WorkGuide is a smart content management system
               designed to streamline work instructions, enhance documentation
              accuracy, and improve efficiency
            </h5>
          </div>
        </div>
      </div>
        <CreateAccountForm />
    </div>
  );
};

export default CreateAccount;
