export const configRegistrations = {
  title: 'Admin Solitude',
  innerTitle: 'Register a new membership',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Full name',
        },
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Email',
        },
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Password',
        },
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Retype password',
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
