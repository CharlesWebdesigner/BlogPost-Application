import {useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate =useNavigate();

  return (
    <div className="not-found">
      <h1 className="title">Page Not Found</h1>
      <p className="message">Sorry, the page you're looking for doesn't exist.</p>
      <p className="redirecting">Redirecting to last page...</p>
      <button className='button' onClick={()=>navigate(-1)}>Go back</button>
    </div>
  );
};

export default NotFound;