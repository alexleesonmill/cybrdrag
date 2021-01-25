import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types'


const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const { username, email, password, password2 } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = async e => {
    e.preventDefault();
    if(password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      console.log('Success');
      }
    }

  return (
    <div className='container'>
      <h1 className='authstate'>REGISTER</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div>
          <i className='far fa-user'></i>
          <input
            type='text'
            name='username'
            id='username'
            className='formInput'
            placeholder='Username'
            value={username}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div>
          <i className='far fa-envelope'></i>
          <input
            type='text'
            name='email'
            id='email'
            placeholder='Email'
            className='formInput'
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div>
          <i className='fas fa-key'></i>
          <input
            type='password'
            name='password'
            id='password'
            className='formInput'
            placeholder='Password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div>
          <i className='fas fa-key'></i>
          <input
            type='password'
            name='password2'
            id='password2'
            className='formInput'
            placeholder='Confirm Password'
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>

        <input type='submit' value='submit' className='purpleButton' />
      </form>
    </div>
  );
};

Register.prototype = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Register);
