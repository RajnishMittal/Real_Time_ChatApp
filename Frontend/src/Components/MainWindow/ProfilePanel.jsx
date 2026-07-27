import React from 'react'

function getAge(dob) {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthdayThisYear) age--;
    return age;
}

function ProfilePanel({ activeContact }) {
    return (
        <div className="profile">

            <div className="profile_avatar_wrap">
                <img src={activeContact?.profilePic} alt="" />
                <span className="profile_status_dot" />
            </div>

            <h1 className="profile_name">{activeContact?.name}</h1>
            <p className="profile_username">@{activeContact?.username}</p>

            <p className="profile_bio">
                {activeContact?.bio || "This user hasn't added a bio yet."}
            </p>

            <div className="profile_divider" />

            <div className="profile_details">

                <div className="profile_detail_row">
                    <span className="profile_detail_label">Date of Birth</span>
                    <span className="profile_detail_value">
                        {activeContact?.dob
                            ? new Date(activeContact.dob).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "Not specified"}
                    </span>
                </div>

                <div className="profile_detail_row">
                    <span className="profile_detail_label">Age</span>
                    <span className="profile_detail_value">
                        {activeContact?.dob ? `${getAge(activeContact.dob)} years` : "Not specified"}
                    </span>
                </div>

                <div className="profile_detail_row">
                    <span className="profile_detail_label">Location</span>
                    <span className="profile_detail_value">
                        {activeContact?.state || activeContact?.country
                            ? `${activeContact?.state ?? ""}${activeContact?.state && activeContact?.country ? ", " : ""}${activeContact?.country ?? ""}`
                            : "Not specified"}
                    </span>
                </div>

            </div>

        </div>
    )
}

export default ProfilePanel