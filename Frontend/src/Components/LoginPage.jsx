import React from 'react'
import { useNavigate } from 'react-router-dom'
import './css/login_page.css'
import insta_image from "../assets/icons/instagram.png"
import github_image from "../assets/icons/github.png"
import linkdin_image from "../assets/icons/linkedin.png"

function LoginPage() {
  const [error, setError] = React.useState(null)
  const [showPass, setShowPass] = React.useState(false);

  const navigate = useNavigate()

  async function handleUserCred(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      e.target.reset()

      if (!response.ok) {
        setError(result.message);
        return;
      }
      else{
        
        setError(null);
        navigate(result.needsProfile ? "/profile" : "/linksync");
      }
      
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    }
  }

  return (
    <div className="main_background">

      <div className="circle_wrapper">
        <div className="circle"></div>
      </div>

      <div className="web_app">
        <h1 style={{ fontSize: 50 }}>LinkSync</h1>
        <h2 style={{ fontSize: 30 }}>GET CONNECTED</h2>

        <div className="social_media">
          <img style={{ width: "40px", height: "40px" }} src={linkdin_image} alt="linkedin" />
          <img style={{ width: "40px", height: "40px" }} src={github_image} alt="github" />
          <img style={{ width: "40px", height: "40px" }} src={insta_image} alt="instagram" />
        </div>
      </div>

      <div className="sign_up_wrapper">
        <div className="sign_in_box">
          <h2 style={{ fontSize: 30, marginBottom: "30px" }}>Sign In</h2>

          <form onSubmit={handleUserCred}>

            <label htmlFor="email">Email Id</label>
            <input type="email" id="email" name="email" required autoComplete='off' />

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
  )
}

export default LoginPage