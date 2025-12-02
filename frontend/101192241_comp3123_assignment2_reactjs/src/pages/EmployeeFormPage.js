import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeFormPage = ({ mode }) => {
  const isEdit = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    date_of_joining: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const loadEmployee = async () => {
      if (isEdit && id) {
        try {
          const res = await axiosClient.get(`/emp/employees/${id}`)
          const emp = res.data
          setForm({
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            email: emp.email || '',
            department: emp.department || '',
            position: emp.position || '',
            salary: emp.salary != null ? String(emp.salary) : '',
            date_of_joining: emp.date_of_joining ? emp.date_of_joining.substring(0, 10) : '',
          })
        } catch (err) {
          setServerError('Failed to load employee for editing.')
        }
      }
    }
    loadEmployee()
  }, [isEdit, id])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.first_name) newErrors.first_name = 'First name is required'
    if (!form.last_name) newErrors.last_name = 'Last name is required'
    if (!form.email) newErrors.email = 'Email is required'
    if (!form.department) newErrors.department = 'Department is required'
    if (!form.position) newErrors.position = 'Position is required'
    if (!form.salary) newErrors.salary = 'Salary is required'
    if (!form.date_of_joining) newErrors.date_of_joining = 'Date of joining is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      department: form.department,
      position: form.position,
      salary: Number(form.salary),
      date_of_joining: form.date_of_joining,
    }

    try {
      if (isEdit) {
        await axiosClient.put(`/emp/employees/${id}`, payload)
      } else {
        await axiosClient.post('/emp/employees', payload)
      }
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
          setServerError('Failed to save employee. Please try again.')
        }
      } else {
        setServerError('Failed to save employee. Please try again.')
      }
    }
  }

  return (
    <div>
      <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate className="mt-3">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            name="first_name"
            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
            value={form.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            name="last_name"
            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
            value={form.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
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
          <label className="form-label">Department</label>
          <input
            name="department"
            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
            value={form.department}
            onChange={handleChange}
          />
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            name="position"
            className={`form-control ${errors.position ? 'is-invalid' : ''}`}
            value={form.position}
            onChange={handleChange}
          />
          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            name="salary"
            type="number"
            className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
            value={form.salary}
            onChange={handleChange}
          />
          {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Date Of Joining</label>
          <input
            name="date_of_joining"
            type="date"
            className={`form-control ${errors.date_of_joining ? 'is-invalid' : ''}`}
            value={form.date_of_joining}
            onChange={handleChange}
          />
          {errors.date_of_joining && (
            <div className="invalid-feedback">{errors.date_of_joining}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Save Changes' : 'Create Employee'}
        </button>
      </form>
    </div>
  )
}

export default EmployeeFormPage