import React, { useContext, useState } from 'react'
import axiosClient from '../api/axiosClient'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const LoginPage = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.username && !form.email) {
      newErrors.username = 'Username or email is required'
      newErrors.email = 'Username or email is required'
    }
    if (!form.password) newErrors.password = 'Password is required'
    if (form.password && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    try {
      const res = await axiosClient.post('/user/login', form)
      const data = res.data || {}
      const token = data.jwt_token

      if (!token) {
        setServerError('Login succeeded but no token was returned.')
        return
      }

      const user = {
        username: form.username || null,
        email: form.email || null,
      }

      login(token, user)
      navigate('/employees')
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data
        if (data.errors && Array.isArray(data.errors)) {
          const msg = data.errors.map((e) => e.msg).join(', ')
          setServerError(msg)
        } else if (data.message) {
          setServerError(data.message)
        } else {
          setServerError('Login failed. Please check your credentials.')
        }
      } else {
        setServerError('Login failed. Please check your credentials.')
      }
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Login</h2>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Username (or Email)</label>
            <input
              name="username"
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email (optional)</label>
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>

          <p className="mt-3">
            Don&apos;t have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage