import React, { useEffect, useState } from 'react';

import {notifySuccess, notifyError } from '../utils/toastify';

import { useParams } from 'react-router-dom';
import Loader from "../tools/loader";
import BackButton from '../tools/BackButton';

export default function PostJob() {
      const [loading, setLoading] = useState(true);
      useEffect(()=>{
            window.scrollTo(0, 0);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 300);
        return () => clearTimeout(timer); // cleanup
      },
      []);
   
const {id} = useParams();

  const api = import.meta.env.VITE_API_URL;

  const [data , setdata] = useState({})



  useEffect(() => {
    const fetchJobById = async () => {
        try {   
            const res = await fetch(`${api}jobs/${id}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const jobData = await res.json();
            setdata(jobData);
            console.log("Fetched job data:", jobData);
        } catch (error) {
            console.error('Error fetching job by ID:', error);
            notifyError('Error fetching job details:', error.message);
            setdata({});
        }
    };
    if (id) {
        fetchJobById();
    }
}, [api, id]);
console.log("Job data state:", data);
const handleChange = (e) => {
  const { name, value } = e.target; // fixed destructuring
  setdata((prev) => ({
    ...prev,
    [name]: value
  }));
}
const handleSubmit = async (e) => {
  e.preventDefault();
const res = await fetch(`${api}jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json();
    notifyError('Error updated job:', errorData);
    console.error('Error updated job:', errorData);
    return;

  }

  const result = await res.json();
  // Optionally, you can redirect or show a success message here
  notifySuccess('Job Updated successfully!',result);
  // Reset the form fields  

}
   if(loading){
        return(
      <div className="flex items-center justify-center min-h-screen"> 
          <Loader />
          </div>
        )
      }

  return (
<div className="containerzz">
       
  
    <div className=" flex items-center justify-center max-h-screen  px-4">
     
<div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
       <BackButton />
        <h2 className="text-3xl font-bold text-black text-center mb-6">Update Post Job</h2>

        <form onSubmit={handleSubmit} className=" w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            name='title'
            value={data.title || ''}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="text"
            name='company'
            placeholder="Company"
            value={data.company || ''}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="number"
                       
            name='experience'
            placeholder="Experience"
            value={data.experience || ''}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="text"
            name='location'
            value={data.location || ''}
            onChange={handleChange}
            placeholder="Location"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="number"

            name='salary'
            value={data.salary || ''}
            onChange={handleChange}
            placeholder="Salary"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="text"
            name='type'
            value={data.type || ''}
            onChange={handleChange}
            placeholder="Job Type (Full-Time, Part-Time, Contract, Internship)"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <input
            type="text"
            placeholder="Apply Link"
            value={data.applylink || ''}
            name='applylink'
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            required
            />
          <textarea
            placeholder="description"
            name='description'
            value={data.description || ''}
            rows={4}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black resize-none  "
            required
          ></textarea>
         

          <button
            type="submit"
            className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 active:bg-orange-700 transition duration-200"
          >
            Submit Job
          </button>
        </form>
      </div>
    </div>
</div>

  );
}
