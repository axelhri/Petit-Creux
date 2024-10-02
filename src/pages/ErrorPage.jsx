import { Link, useRouteError } from 'react-router-dom';
import NotFoundImage from '../assets/not-found.svg?react';

function ErrorPage() {
  const error = useRouteError();
  console.log(error);

  if (error.status === 404) {
    return (
      <main>
        <NotFoundImage className='img' />
        <h2>Ohh!</h2>
        <p>We can&apos;t seem to find page you are looking for</p>
        <Link to='/'>Back home</Link>
      </main>
    );
  }

  return (
    <main>
      <h2>Something went wrong</h2>
      <Link to='/'>Back home</Link>
    </main>
  );
}

export default ErrorPage;
