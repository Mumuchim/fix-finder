import React from "react";
import { Link } from "react-router-dom";
import '../css/Landing.css';

function Landing() {
    return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to Your Team App</title>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
            />
            <link
                href="https://fonts.googleapis.com/css?family=Poppins"
                rel="stylesheet"
            />
            <link rel="stylesheet" href="styles.css" />
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="fas fa-school"> DYCI FIXFINDER</h1>
                    <p>
                        Maintaining our school is key to creating a safe, inspiring, and
                        efficient learning environment where students can thrive and succeed.
                    </p>
                    <p>
                        DYCI FixFinder project addresses these challenges by introducing an
                        innovative application for maintenance reporting. By integrating an
                        interactive map-based system, FixFinder allows students, faculty, and
                        maintenance staff to easily report and track issues.
                    </p>
                    <p>
                        Don't have an account? <Link to="/signup">Signup</Link> here.
                    </p>
                </div>
            </section>
        </>

    );
}

export default Landing;