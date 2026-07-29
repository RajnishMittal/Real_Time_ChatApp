import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './css/login_page.css'
import insta_image from "../assets/icons/instagram.png"
import github_image from "../assets/icons/github.png"
import linkdin_image from "../assets/icons/linkedin.png"

const TYPED_WORDS = ["GET CONNECTED", "CHAT INSTANTLY", "STAY IN TOUCH", "MESSAGE ANYONE"]

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function LoginPage() {
  const [error, setError] = React.useState(null)
  const [showPass, setShowPass] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [wordIdx, setWordIdx] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [phase, setPhase] = React.useState("typing");

  const navigate = useNavigate()

  React.useEffect(() => {
    const word = TYPED_WORDS[wordIdx % TYPED_WORDS.length];
    let timeout;

    if (phase === "typing") {
      if (typed.length < word.length) {
        const shouldTypo = Math.random() < 0.08 && typed.length < word.length - 1;

        timeout = setTimeout(() => {
          if (shouldTypo) {
            const wrongChar = String.fromCharCode(65 + rand(0, 25));
            setTyped(typed + wrongChar);
            setPhase("typo");
          } else {
            setTyped(word.slice(0, typed.length + 1));
          }
        }, rand(60, 140));
      } else {
        // word fully typed — hold it visible before deleting starts
        timeout = setTimeout(() => setPhase("deleting"), 1800);
      }
    }

    else if (phase === "typo") {
      timeout = setTimeout(() => setPhase("correcting"), rand(200, 400));
    }

    else if (phase === "correcting") {
      timeout = setTimeout(() => {
        setTyped(typed.slice(0, -1));
        setPhase("typing");
      }, rand(80, 150));
    }

    else if (phase === "deleting") {
      if (typed.length > 0) {
        timeout = setTimeout(() => {
          setTyped(word.slice(0, typed.length - 1));
        }, rand(30, 60));
      } else {
        timeout = setTimeout(() => {
          setWordIdx((wordIdx + 1) % TYPED_WORDS.length);
          setPhase("typing");
        }, 400);
      }
    }

    return () => clearTimeout(timeout);
  }, [typed, phase, wordIdx]);

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
      else {

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
        <h2 style={{ fontSize: 30 }}>
          <span className="typed">{typed}</span>
        </h2>

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

            <Link to="/signup" className="switch_auth" >Don't have an account? Sign Up</Link>

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