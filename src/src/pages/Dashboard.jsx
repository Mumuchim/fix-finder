import React from "react";
// import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import ReportForm from "../components/ReportForm";
import Map from "../components/Map";
import PinSidebar from "../components/PinSidebar";
// import Test from "./Test"


function Dashboard() {
    // const navigate = useNavigate();



    return (
        <div>
            <Navbar />
            <PinSidebar />
            <Map />
            {/* <Test /> */}
        </div>
    );
}

export default Dashboard;
