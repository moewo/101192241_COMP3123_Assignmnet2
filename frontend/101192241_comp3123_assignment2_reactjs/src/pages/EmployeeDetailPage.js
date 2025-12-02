import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useQuery } from '@tanstack/react-query';

const fetchEmployee = async (id) => {
  const res = await axiosClient.get(`/employees/${id}`);
  return res.data;
};

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
  });

  if (isLoading) return <p>Loading employee...</p>;
  if (isError || !employee) return <p>Failed to load employee.</p>;

  return (
    <div>
      <h2>Employee Details</h2>
      <div className="card mt-3">
        <div className="card-body">
          {employee.profilePictureUrl && (
            <img
              src={employee.profilePictureUrl}
              alt={employee.name}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
              className="mb-3"
            />
          )}
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          {employee.salary && <p><strong>Salary:</strong> {employee.salary}</p>}
        </div>
      </div>
      <Link to="/employees" className="btn btn-secondary mt-3">
        Back to List
      </Link>
    </div>
  );
};

export default EmployeeDetailPage;