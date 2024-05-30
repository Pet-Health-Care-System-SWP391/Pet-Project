import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ColorModeContext, useMode } from "../../theme";

import "react-toastify/dist/ReactToastify.css";

import Topbar from "../../view/scenes/global/Topbar";
import Sidebar from "../../view/scenes/global/Sidebar";
import Dashboard from "../../view/scenes/dashboard/index";
import Team from "../../view/scenes/team/index";
import Invoices from "../../view/scenes/invoices/index";
import Contacts from "../../view/scenes/contacts/index";
import Bar from "../../view/scenes/bar/index";
import Form from "../../view/scenes/form/index";
import Line from "../../view/scenes/line/index";
import Pie from "../../view/scenes/pie/index";
import FAQ from "../../view/scenes/faq/index";
import Geography from "../../view/scenes/geography/index";
import Calendar from "../../view/scenes/calendar/calendar";

function Admin() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />

            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Admin;
