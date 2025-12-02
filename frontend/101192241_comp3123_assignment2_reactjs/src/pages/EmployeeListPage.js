import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchEmployees = async ({ queryKey }) => {
  const [_key, filters] = queryKey;
  const params = {};
  if (filters.department) params.department = filters.department;
  if (filters.position) params.position = filters.position;

  const endpoint = Object.keys(params).length ? '/employees/search' : '/employees';
  const response = await axiosClient.get(endpoint, { params });
  return response.data;
};

const EmployeeListPage = () => {
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const queryClient = useQueryClient();

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees', { department, position }],
    queryFn: fetchEmployees,
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setDepartment('');
    setPosition('');
    queryClient.invalidateQueries(['employees']);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    await axiosClient.delete(`/employees/${id}`);
    queryClient.invalidateQueries(['employees', { department, position }]);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>
        <Link to="/employees/new" className="btn btn-success">
          + Add Employee
        </Link>
      </div>

      <form className="row g-3 mb-3" onSubmit={handleSearch}>
        <div className="col-md-4">
          <label className="form-label">Department</label>
          <input
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end gap-2">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {isLoading && <p>Loading employees...</p>}
      {isError && (
        <div className="alert alert-danger">Failed to load employees.</div>
      )}

      {employees && employees.length === 0 && (
        <p>No employees found. Try adding one.</p>
      )}

      {employees && employees.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    {emp.profilePictureUrl ? (
                      <img
                        src={emp.profilePictureUrl}
                        alt={emp.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-info me-2"
                      to={`/employees/${emp._id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="btn btn-sm btn-warning me-2"
                      to={`/employees/${emp._id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;