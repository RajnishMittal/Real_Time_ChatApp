import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileSettings({ loggedIn, setLoggedIn }) {

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

    const avatarSrc = preview
        ? preview
        : loggedIn?.profilePic?.startsWith("http")
            ? loggedIn.profilePic
            : loggedIn?.profilePic
                ? `http://localhost:8000/${loggedIn.profilePic}`
                : null;

    return (
        <>
            <section className="settings_card">
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
                            State
                            <input
                                type="text"
                                value={state}
                                onChange={e => setState(e.target.value)}
                            />
                        </label>

                        <label className="settings_label">
                            Country
                            <input
                                type="text"
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                            />
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
            </section>
        </>
    )
}

export default ProfileSettings