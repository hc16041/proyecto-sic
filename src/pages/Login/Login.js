import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/login.css';
import axios from 'axios';

function App() {
  const baseUrl = 'http://localhost:5000';
  const [usuarios, setusuarios] = useState([]);

  const getUsuarios = async () => {
    try {
      await axios.get(`${baseUrl}/usuarios`).then((respuesta) => {
        setusuarios(respuesta.data);
        console.log(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    async function usuarios() {
      await getUsuarios();
    }
    usuarios();
  }, []);

  const [formData, setFormData] = useState(defaultValueForm());

  const onChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const onSubmit = () => {
    console.log(formData);
  };

  return (
    <div>
      <section class='login-block'>
        <div class='container'>
          <div class='row '>
            <div class='col login-sec'>
              <h2 class='text-center'>Software Contable</h2>
              <form class='login-form' onSubmit={onSubmit}>
                <div class='form-group'>
                  <label class='text-light'>Usuario:</label>
                  <input
                    type='text'
                    name='usuario'
                    class='form-control'
                    onChange={onChange}
                  />
                </div>
                <div class='form-group'>
                  <label class='text-light'>Contraseña:</label>
                  <input
                    type='password'
                    name='contra'
                    class='form-control'
                    onChange={onChange}
                  />
                </div>
                <br />
                <button type='submit' class='btn btn-black'>
                  Entrar
                </button>
                <button type='submit' class='btn btn-secondary'>
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function defaultValueForm() {
  return {
    usuario: '',
    contra: '',
  };
}
export default App;
