// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Login({ setUser }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password, role }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const name = email.split('@')[0];
//         if (setUser) {
//           setUser({ name, email, role });
//         }
//         navigate('/home');
//       } else {
//         alert(data.message || 'Login failed');
//       }
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-12">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
//           <input
//             id="email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="you@example.com"
//           />
//         </div>

//         <div>
//           <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
//           <input
//             id="password"
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="••••••••"
//           />
//         </div>

//         <div>
//           <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Login as</label>
//           <select
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
//         >
//           Login
//         </button>
//       </form>

//       <p className="mt-4 text-center text-gray-600">
//         Don't have an account?{' '}
//         <Link to="/register" className="text-blue-600 hover:underline font-medium">
//           Register here
//         </Link>
//       </p>
//     </div>
//   );
// }






















import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Custom Modal Component
const Modal = ({ message, onClose }) => {
  if (!message) return null; // Don't render if no message

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

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role
      });

      const data = response.data;
      console.log('Login successful response:', data); // Debug log

      if (data) {
        const name = email.split('@')[0];
        const loggedInUser = { name, email, role };

        if (setUser) {
          setUser(loggedInUser);
        }

        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setModalMessage('Login successful!'); // Show success message
        setTimeout(() => {
          setModalMessage(''); // Clear modal after a short delay
          navigate('/home'); // Navigate after success
        }, 1500); // Navigate after 1.5 seconds
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debug log
      setModalMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl mt-12 font-sans">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Welcome Back!</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Login as</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-150 ease-in-out"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-lg font-semibold"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Register here
        </Link>
      </p>

      {/* Custom Modal */}
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
    </div>
  );
}
