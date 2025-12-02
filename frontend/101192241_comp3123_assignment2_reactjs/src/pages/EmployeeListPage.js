import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const fetchEmployees = async () => {
  const response = await axiosClient.get('/emp/employees')
  return response.data
}

const EmployeeListPage = () => {
  const [department, setDepartment] = useState('')
  const [position, setPosition] = useState('')
  const queryClient = useQueryClient()

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  const handleSearch = (e) => {
    e.preventDefault()
  }

  const handleClear = () => {
    setDepartment('')
    setPosition('')
    queryClient.invalidateQueries(['employees'])
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    await axiosClient.delete('/emp/employees', { params: { eid: id } })
    queryClient.invalidateQueries(['employees'])
  }

  const filteredEmployees = (employees || []).filter((emp) => {
    const matchesDepartment = department
      ? (emp.department || '').toLowerCase().includes(department.toLowerCase())
      : true
    const matchesPosition = position
      ? (emp.position || '').toLowerCase().includes(position.toLowerCase())
      : true
    return matchesDepartment && matchesPosition
  })

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
      {isError && <div className="alert alert-danger">Failed to load employees.</div>}

      {filteredEmployees && filteredEmployees.length === 0 && !isLoading && (
        <p>No employees found.</p>
      )}

      {filteredEmployees && filteredEmployees.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Date Of Joining</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.employee_id}>
                  <td>
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.date_of_joining ? emp.date_of_joining.substring(0, 10) : ''}</td>
                  <td>{emp.salary}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-info me-2"
                      to={`/employees/${emp.employee_id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="btn btn-sm btn-warning me-2"
                      to={`/employees/${emp.employee_id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp.employee_id)}
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
  )
}

export default EmployeeListPage