import React from 'react';
import { useState } from 'react';
import "../Styles/Contact.css";

const Contact = () => {
  const [data, setData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };

  return (
      <div className='p-14 flex bg-[#e9ffdb]'>
        <div className='mt-16 text-center flex-1 flex-col'>
          <form1 method='post' onSubmit={handleSubmit} className="bg-green-300 rounded-xl">
            <h1 className='font-extrabold text-green-800 mb-2 text-xl'>Contact Us</h1>
            <input type='text' name='name' id='' onChange={handleChange} value={data.name} placeholder='Enter Name' />
            <input type='email' name='email' id='' onChange={handleChange} value={data.email} placeholder='Enter Email' />
            <input type='phone' name='phone' id='' onChange={handleChange} value={data.phone} placeholder='Enter Phone Number' />
            <textarea
              name='message'
              id=''
              cols='30'
              rows='10'
              onChange={handleChange}
              value={data.message}
              placeholder='Write your feedback...'
            />
            <button type='submit' className='btn btn-success text-white font-bold mt-4 w-24'>Submit</button>
          </form1>
        </div>
        <div id='map' className='flex-1'>
          <iframe
            title='Google Map'
            width='100%'
            height='400'
            frameBorder='0'
            scrolling='no'
            marginHeight='0'
            marginWidth='0'
            className='rounded-xl'
            src='https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=One%20Apple%20Park%20Way,%20Cupertino,%20CA%2095014+(Apple%20Park)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'
          ></iframe>
        </div>
      </div>
  );
};

export default Contact;

