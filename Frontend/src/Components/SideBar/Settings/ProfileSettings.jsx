import React from 'react'
import "../../css/Settings/ProfileSettings.css"
import { useNavigate } from 'react-router-dom'
import { Country, State } from "country-state-city";

function ProfileSettings({ loggedIn, setLoggedIn }) {

    const [isPrivate, setIsPrivate] = React.useState(false);

    const navigate = useNavigate();

    const [name, setName] = React.useState("");
    const [bio, setBio] = React.useState("");
    const [dob, setDob] = React.useState("");
    const [state, setState] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [profilePic, setProfilePic] = React.useState(null);
    const [preview, setPreview] = React.useState(null);

    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [saving, setSaving] = React.useState(false);

    const countries = Country.getAllCountries();
    const states = country ? State.getStatesOfCountry(country) : [];

    React.useEffect(() => {
        if (!loggedIn?._id) return;

        async function getPrivateStatus() {
            try {
                const response = await fetch(
                    `/api/connections/myPrivacy`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    setError(errBody.error || "Failed to fetch privacy status");
                    return;
                }

                const result = await response.json();

                setIsPrivate(result.data);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        getPrivateStatus();
    }, [loggedIn]);

    React.useEffect(() => {
        async function fetchMe() {
            try {
                const response = await fetch("/api/home/me", { credentials: "include" });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    setError("Failed to load profile");
                    return;
                }

                const result = await response.json();
                setLoggedIn(result);
                setName(result.name ?? "");
                setBio(result.bio ?? "");
                setDob(result.dob ? result.dob.slice(0, 10) : "");
                setState(result.state ?? "");
                setCountry(result.country ?? "");
            } catch (err) {
                console.error(err);
                setError("Unable to connect to the server.");
            }
        }

        fetchMe();
    }, [navigate]);


    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function handleCountryChange(e) {
        setCountry(e.target.value);
        setState(""); // reset state when country changes
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        formData.append("dob", dob);
        formData.append("state", state);
        formData.append("country", country);
        if (profilePic) formData.append("image", profilePic);

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Failed to update profile");
                setSaving(false);
                return;
            }

            setSuccess("Profile updated successfully");
            setLoggedIn(result.data ?? result);
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the server.");
        } finally {
            setSaving(false);
        }
    }

    async function handleLogout() {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                navigate("/");
            } else {
                setError("Failed to log out");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the server.");
        }
    }

    async function handlePrivate(value) {
        try {
            const response = await fetch("/api/connections/privateConnection", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    account_type: value
                })
            });

            const result = await response.json();

            console.log(result);

        } catch (err) {
            console.error(err);
        }
    }

    const avatarSrc = preview
    ? preview
    : loggedIn?.profilePic?.startsWith("http")
        ? loggedIn.profilePic
        : loggedIn?.profilePic
            ? `${import.meta.env.VITE_API_URL}/${loggedIn.profilePic}`
            : null;

    return (
        <>
            <div className="settings_cardd">
                {error && (
                    <div className="settings_alert settings_alert--error">
                        <svg className="settings_alert_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.5" />
                        </svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="settings_alert settings_alert--success">
                        <svg className="settings_alert_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {success}
                    </div>
                )}
                <div className="mainSettings">

                    <div className="settings_card_head">
                        <h2>Edit profile</h2>
                        <p className="settings_card_subtitle">This is how others see you across the app.</p>
                    </div>

                    <form onSubmit={handleSave} className="settings_form">

                        <div className="settings_avatar_wrap">
                            <div className="settings_avatar_ring">
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="Profile" className="settings_avatar" />
                                ) : (
                                    <div className="settings_avatar_placeholder">
                                        {name ? name.trim().charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}
                                <label htmlFor="profilePicInput" className="settings_avatar_overlay" aria-label="Change photo">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                </label>
                            </div>


                            <div className="settings_avatar_meta">
                                <span className="settings_avatar_name">{name || "Your name"}</span>
                                <label htmlFor="profilePicInput" className="settings_avatar_edit">
                                    Change photo
                                </label>

                                <div className="cont">
                                    <p>Private :</p>
                                    <div className="bauble_box">
                                        <input
                                            className="bauble_input"
                                            id="bauble_check"
                                            type="checkbox"
                                            checked={isPrivate}
                                            onChange={(e) => {
                                                const value = e.target.checked;
                                                setIsPrivate(value);
                                                handlePrivate(value);
                                            }}

                                        />

                                        <label
                                            className="bauble_label"
                                            htmlFor="bauble_check"
                                        >
                                            Toggle
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <input
                                id="profilePicInput"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </div>

                        <label className="settings_label">
                            Name
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="settings_label">
                            Bio
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={3}
                                placeholder="Tell others a bit about yourself"
                            />
                        </label>

                        <label className="settings_label">
                            Date of birth
                            <input
                                type="date"
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                            />
                        </label>

                        <div className="settings_row">
                            <label className="settings_label">
                                Country
                                <select
                                    value={country}
                                    onChange={handleCountryChange}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((c) => (
                                        <option key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="settings_label">
                                State
                                <select
                                    value={state}
                                    onChange={e => setState(e.target.value)}
                                    disabled={!country}
                                >
                                    <option value="">
                                        {country ? "Select State" : "Select country first"}
                                    </option>
                                    {states.map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="buttonsss">
                            <button type="submit" className="settings_save_btn" disabled={saving}>
                                {saving ? "Saving…" : "Save changes"}
                            </button>

                            <button type="button" className="settings_logout_btn" onClick={handleLogout}>
                                Log out
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProfileSettings