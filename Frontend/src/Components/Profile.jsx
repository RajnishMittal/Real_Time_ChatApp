import React, { useState } from "react";
import "./css/ProfileMaker.css";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const initialProfile = {
        image: null,
        imagePreview: null,
        username: "",
        dob: "",
        country: "",
        state: "",
    };

    const [profile, setProfile] = useState(initialProfile);
    const [loggedIn, setLoggedIn] = useState(null);
    const [error, setError] = useState(null)
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfile((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    React.useEffect(() => {

        async function getLoggedIn() {
            try {
                const response = await fetch("/api/home/me", {
                    credentials: "include"
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    return;
                }

                const result = await response.json();
                setLoggedIn(result);
                console.log(result)

            } catch (err) {
                console.error(err);
            }
        }

        getLoggedIn();

    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !profile.username ||
            !profile.dob ||
            !profile.country ||
            !profile.state
        ) {
            setError("Please fill all fields");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("image", profile.image);
            formData.append("username", profile.username);
            formData.append("dob", profile.dob);
            formData.append("country", profile.country);
            formData.append("state", profile.state);

            const response = await fetch(`/api/profile/${loggedIn._id}`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message);
            } else {
                setError(null);
                navigate("/linksync");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        }
    };

    const handleReset = (e) => {
        e.target.reset()
    }


    return (
        <div className="profile_maker_container">
            <div className="profile_maker">
                <h1 className="profile_title">Create Profile</h1>

                <form onSubmit={handleSave}>
                    <div className="image_section">
                        <div className="image_preview_wrapper">
                            {profile.imagePreview ? (
                                <img
                                    src={profile.imagePreview}
                                    alt="Profile"
                                    className="image_preview"
                                />
                            ) : (
                                <div className="image_placeholder">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                        </div>

                        <label className="upload_btn">
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImage}
                            />
                            Upload Photo
                        </label>
                    </div>

                    <div className="input_field">

                        <div className="form_group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username (min. 8 characters)"
                                maxLength={30}
                                value={profile.username}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form_group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={profile.dob}
                                onChange={handleChange}
                                autoComplete="off"
                            />

                        </div>

                        <div className="form_group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Enter your country"
                                value={profile.country}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form_group">
                            <label>State / Province</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="Enter your state"
                                value={profile.state}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }} >
                        {error ? <div className="error">
                            <p style={{ color: "white" }} >
                                {error}
                            </p>
                        </div> : null}
                    </div>

                    <div className="button_group">
                        <button className="save_btn" type="submit">
                            Save Profile
                        </button>

                        <button
                            className="reset_btn"
                            type="button"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {saved && (
                    <div className="success_message">
                        ✓ Profile saved successfully!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;