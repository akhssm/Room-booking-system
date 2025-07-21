// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if(password !== confirmPassword){
//       alert("Passwords do not match");
//       return;
//     }

//     // TODO: Call backend API to register new user with email, password, and role
//     console.log({ email, password, role });

//     alert('Registration successful! Please login.');

//     navigate('/login');
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-semibold">Email</label>
//           <input
//             type="email"
//             required
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Password</label>
//           <input
//             type="password"
//             required
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Confirm Password</label>
//           <input
//             type="password"
//             required
//             value={confirmPassword}
//             onChange={e => setConfirmPassword(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Role</label>
//           <select
//             value={role}
//             onChange={e => setRole(e.target.value)}
//             className="w-full border p-2 rounded"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
//         >
//           Register
//         </button>
//       </form>
//       <p className="mt-4 text-center">
//         Already have an account?{' '}
//         <Link to="/login" className="text-blue-600 hover:underline">
//           Login here
//         </Link>
//       </p>
//     </div>
//   );
// }









import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Custom Modal Component (reused from Login.js)
const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage('');

    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        role: 'user' // Fixed role
      });

      const data = response.data;
      console.log('Registration successful response:', data);

      setModalMessage('Registration successful! Please login.');
      setTimeout(() => {
        setModalMessage('');
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setModalMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl mt-12 font-sans">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Register Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
            placeholder="••••••••"
          />
        </div>

        {/* Hidden input to pass "user" role */}
        <input type="hidden" value="user" />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out text-lg font-semibold"
        >
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login here
        </Link>
      </p>

      {/* Custom Modal */}
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
    </div>
  );
}
