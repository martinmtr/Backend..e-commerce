const form = document.getElementById("loginForm");
const errorP = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const payload = {
    email: data.get("email"),
    password: data.get("password")
  };

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      errorP.innerText = "Login incorrecto";
      return;
    }

    
    localStorage.setItem("token", result.token);

   
    window.location.href = "/";
  } catch (error) {
    errorP.innerText = "Error al iniciar sesión";
  }
});
