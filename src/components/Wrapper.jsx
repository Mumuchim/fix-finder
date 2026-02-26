import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Navigate } from "react-router-dom";
import bgmap from "../assets/bgmap.png";

function Wrapper({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setAuthenticated(!!session);
            setLoading(false);
        };

        getSession();
    }, []);

    // Ensure the authenticated app screens use the map background.
    useEffect(() => {
        if (!authenticated) return;

        const prev = {
            backgroundImage: document.body.style.backgroundImage,
            backgroundSize: document.body.style.backgroundSize,
            backgroundPosition: document.body.style.backgroundPosition,
            backgroundRepeat: document.body.style.backgroundRepeat,
            backgroundAttachment: document.body.style.backgroundAttachment,
        };

        document.body.style.backgroundImage = `url(${bgmap})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';

        return () => {
            document.body.style.backgroundImage = prev.backgroundImage;
            document.body.style.backgroundSize = prev.backgroundSize;
            document.body.style.backgroundPosition = prev.backgroundPosition;
            document.body.style.backgroundRepeat = prev.backgroundRepeat;
            document.body.style.backgroundAttachment = prev.backgroundAttachment;
        };
    }, [authenticated]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        if (authenticated) {
            return <>{children}</>;
        }
        return <Navigate to="/" />;
    }
}

export default Wrapper;