import axios from 'axios';
import { Form, redirect, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';

const newsletterUrl =
  'https://www.course-api.com/cocktails-newsletter';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const formJson = Object.fromEntries(formData);

  try {
    const { data } = await axios.post(newsletterUrl, formJson);
    toast.success(data.msg);
    return redirect('/');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

function Newsletter() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form method='POST'>
      <h1>Our Newsletter</h1>
      {/* name */}
      <div>
        <label htmlFor='name'>name</label>
        <input type='text' name='name' id='name' required />
      </div>
      {/* lastName */}
      <div>
        <label htmlFor='lastName'>lastName</label>
        <input type='text' name='lastName' id='lastName' required />
      </div>
      {/* email */}
      <div>
        <label htmlFor='email'>email</label>
        <input
          type='email'
          name='email'
          id='email'
          defaultValue='test@test.com'
          required
        />
      </div>
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  );
}
export default Newsletter;
