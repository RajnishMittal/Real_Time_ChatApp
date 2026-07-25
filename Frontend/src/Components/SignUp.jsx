import React from 'react'
import './css/login_page.css'
import { useNavigate } from 'react-router-dom'

function SignUp(props) {
    const [error, setError] = React.useState(null)
    const [showPass, setShowPass] = React.useState(false);

    const navigate = useNavigate()

    async function handleUserCred(e) {
        e.preventDefault()
        const formdata = new FormData(e.target)
        const data = Object.fromEntries(formdata)

        try {
            const response = await fetch("/api/signup", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json();

            e.target.reset()

            if (!response.ok) {
                setError(result.error);
                return;
            }
            navigate("/");
            setError(null);
        }
        catch (error) {
            console.error(error);
            setError("Unable to connect to the server.");
        }
    }

    return (
        <div>
            <div className="main_background">

                <div className="circle_wrapper">
                    <div className="circle"></div>
                </div>

                <div className="web_app">
                    <h1 style={{ fontSize: 50 }}>LinkSync</h1>
                    <h2 style={{ fontSize: 30 }}>GET CONNECTED</h2>

                    <div className="social_media">
                        <img src={null} alt="linkedin" />
                        <img src={null} alt="github" />
                        <img src={null} alt="instagram" />
                    </div>
                </div>

                <div className="sign_up_wrapper">
                    <div className="sign_in_box">
                        <h2 style={{ fontSize: 30 }}>Sign Up</h2>

                        <form onSubmit={handleUserCred}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" autoComplete='off' required />

                            <label htmlFor="email">Email Id</label>
                            <input type="email" id="email" name="email" autoComplete='off' required />

                            <label htmlFor="pass">Password</label>
                            <input
                                className="pass"
                                type={showPass ? "text" : "password"}
                                id="pass"
                                name="pass"
                                required
                                autoComplete="off"
                            />

                            <div className="show_pass">
                                <input
                                    type="checkbox"
                                    id="showPass"
                                    checked={showPass}
                                    onChange={(e) => setShowPass(e.target.checked)}
                                />
                                <label htmlFor="showPass">Show Password</label>
                            </div>

                            {error ? <div className="error">
                                <p style={{ color: "white" }} >
                                    {error}
                                </p>
                            </div> : null}

                            <button type="submit">Link</button>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default SignUp