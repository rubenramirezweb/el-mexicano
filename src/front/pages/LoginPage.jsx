import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { showError, showInfo, showSuccess } from "../utils/toastUtils";
import AOS from 'aos';
import 'aos/dist/aos.css';
import bookingShape from '../assets/img/booking-shape.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState("false");
  const { store, dispatch } = useGlobalReducer()

  // Inicializamos AOS al montar el componente
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const IniciarSesion = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        showInfo("¡Todos los campos deben ser llenados!");
        return;
      }

      const cuenta = { email, password };

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuenta),
      });

      const data = await response.json(); // leemos la respuesta
      console.log(data)

      if (response.ok) {
        showSuccess(data.msg || "¡Te has logeado con éxito!");

        // Guarda el token en sessionStorage
        sessionStorage.setItem("token", data.access_token);
        console.log("Token guardado en sessionStorage:", sessionStorage.getItem("token"));

        dispatch({
          type: "login",
          payload: {
            token: data.access_token,
            role: data.role,
          }
        })
        if (data.role === "CLIENTE") {
          navigate("/cliente/crear-orden")
        }
        else if (data.role === "COCINA") {
          navigate("/kitchen")
        }
        else if (data.role === "ADMIN") {
          navigate("/admin")
        }
        else {
          navigate("/")
        }

        // navigate("/dashboard"); // si quieres redirigir
      } else {
        showError(data.msg || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.log(error);
      showError("Hubo un error al procesar la solicitud.");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-center">
      <form className="row justify-content-center p-4 border rounded-4 shadow col-md-6" data-aos="fade-up" onSubmit={IniciarSesion} style={{ backgroundColor: "#00813d", color: "#fff", backgroundImage: `url(${bookingShape})` }}>
        <div className="col-md-8">
          <h1 className="text-center text-uppercase mb-5">Iniciar Sesión</h1>

          <div className="mb-5" data-aos="fade-up">
            <input
              type="email"
              className="form-control custom-input"
              placeholder="Email"
              id="inputEmail"
              style={{ borderRadius: "0", backgroundColor: "#00813d", color: "#fff" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-5 position-relative" data-aos="fade-up">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control custom-input"
            placeholder="Contraseña"
            id="inputPassword"
            style={{ borderRadius: "0", backgroundColor: "#00813d", color: "#fff" }}
            value={showPassword}
            onChange={(e) => setPassword(e.target.value)}
            onClick={togglePassword}
          />

          <span
            onClick={togglePassword}
            style={{
              position: "absolute",
              top: "50%",
              right: "15px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#fff"
            }}
          >
            {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
          </span>

        </div>

        <div className="text-center">
          <button type="submit" className="btn bg-yellow">
            Iniciar Sesión
          </button>
        </div>
    </div>
    </form >
      </div >
    </div >
  );
};