import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TwoColumnLayout from './TwoColumnLayout';
import { Provider } from "react-redux";
import  InputDesign  from './components/InputDesign'
import  Instructions  from './components/instructions/Instructions'
import  EditInstructions  from './components/manage_instructions/EditInstructions'
import  ChangeLog  from './components/ChangeLog'
import  CreateAccount  from './CreateAccount'
import  UserProfile  from './components/userProfile/UserProfile'
import  Feedbacks  from './components/manage_feedback/ManageFeedback'
import  OfflineMode  from './components/offline/offline'
import { store } from "./redux/store";;

const App: React.FC = () => {
  return (
    <Router>
        <Provider store={store}>
        <Routes>
          <Route path="/" element={<TwoColumnLayout />} />
          <Route path="/create" element={<CreateAccount />} />
           <Route path="/lib" element={<InputDesign />} />
           <Route path="/user" element={<UserProfile />} />
           <Route path="/versions" element={<ChangeLog />} />
           <Route path="/feedbacks" element={<Feedbacks />} />
           <Route path="/instructions" element={<Instructions />} />
           <Route path="/edit-instructions" element={<EditInstructions />} />
           <Route path="/offline" element={<OfflineMode />} />
        </Routes>
        </Provider>
    </Router>
  );
};

export default App;