import { ConfigRegistrationsType } from '../types'

export const configRegistrations: ConfigRegistrationsType = {
  title: 'Admin Solitude',
  innerTitle: 'Register a new membership',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        {
          name: 'name',
          typeField: 'input',
          size: 'large',
          placeholder: 'Full name',
          type: 'name',
        },
        {
          name: 'email',
          typeField: 'input',
          size: 'large',
          placeholder: 'Login',
          type: 'email',
        },
        {
          name: 'password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Password',
          type: 'password',
        },
        {
          name: 'repeat_password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Retype password',
          type: 'password',
        },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        {
          typeField: 'checkbox',
          children: 'I agree to the terms',
        },
        {
          typeField: 'button',
          children: 'Register',
          type: 'primary',
          size: 'large',
        },
      ],
    },
    {
      className: 'links-container',
      fields: [
        {
          typeField: 'link',
          children: 'I already have a membership',
          link: '/login',
        },
      ],
    },
  ],
}
