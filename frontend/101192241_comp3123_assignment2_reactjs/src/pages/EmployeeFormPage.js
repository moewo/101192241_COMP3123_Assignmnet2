import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeFormPage = ({ mode }) => {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const loadEmployee = async () => {
      if (isEdit && id) {
        try {
          const res = await axiosClient.get(`/employees/${id}`);
          const emp = res.data;
          setForm({
            name: emp.name || '',
            email: emp.email || '',
            department: emp.department || '',
            position: emp.position || '',
            salary: emp.salary || '',
          });
        } catch (err) {
          console.error(err);
          setServerError('Failed to load employee for editing.');
        }
      }
    };
    loadEmployee();
  }, [isEdit, id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.position) newErrors.position = 'Position is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (file) {
        formData.append('profilePicture', file);
      }

      if (isEdit) {
        await axiosClient.put(`/employees/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosClient.post('/employees', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/employees');
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || 'Failed to save employee. Please try again.'
      );
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate className="mt-3">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
          {errors.department && (
            <div className="invalid-feedback">{errors.department}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            name="position"
            className={`form-control ${errors.position ? 'is-invalid' : ''}`}
            value={form.position}
            onChange={handleChange}
          />
          {errors.position && (
            <div className="invalid-feedback">{errors.position}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Salary (optional)</label>
          <input
            name="salary"
            type="number"
            className="form-control"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Picture (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Save Changes' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeFormPage;