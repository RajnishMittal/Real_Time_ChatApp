import React from "react";
import "../../css/Settings/ColorTheme.css";

const themes = [
    {
        id: "ember",
        name: "Ember",
        colors: ["#E8973A", "#35261D", "#F3EAD9"]
    },
    {
        id: "forest",
        name: "Forest",
        colors: ["#56C596", "#1B4332", "#E8F5E9"]
    },
    {
        id: "ocean",
        name: "Ocean",
        colors: ["#4EA8DE", "#14213D", "#F4FAFF"]
    },
    {
        id: "royal",
        name: "Royal",
        colors: ["#8B5CF6", "#2B1B45", "#F3EEFF"]
    },
    {
        id: "crimson",
        name: "Crimson",
        colors: ["#EF4444", "#331414", "#FFF4F4"]
    },
    {
        id: "midnight",
        name: "Midnight",
        colors: ["#94A3B8", "#0F172A", "#F8FAFC"]
    },
    {
        id: "sakura",
        name: "Sakura",
        colors: ["#F28BB6", "#2C2331", "#FFF4F7"]
    },
    {
        id: "eclipse",
        name: "Eclipse",
        colors: ["#F6C453", "#141414", "#F8F3E7"]
    },
    {
        id: "neon",
        name: "Neon",
        colors: ["#39FF88", "#08120D", "#E7FFF2"]
    }
];

function ColorTheme() {

    const [selected, setSelected] = React.useState(() => {
        return localStorage.getItem("theme") || "ember";
    });

    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", selected);
        localStorage.setItem("theme", selected);
    }, [selected]);

    return (
        <section className="settings_carddd color_theme_card">

            <div className="settings_card_head">
                <h2>Color Theme</h2>
                <p className="settings_card_subtitle">
                    Personalize the appearance of LinkSync.
                </p>
            </div>

            <div className="theme_grid">

                {themes.map(theme => (

                    <div
                        key={theme.id}
                        className={`theme_card ${selected === theme.id ? "active" : ""}`}
                        onClick={() => setSelected(theme.id)}
                    >

                        <div className="theme_preview">

                            {theme.colors.map(color => (
                                <span
                                    key={color}
                                    style={{ background: color }}
                                />
                            ))}

                        </div>

                        <h4>{theme.name}</h4>

                        {selected === theme.id && (
                            <div className="theme_selected">
                                Active
                            </div>
                        )}

                    </div>

                ))}

            </div>

        </section>
    );
}

export default ColorTheme;