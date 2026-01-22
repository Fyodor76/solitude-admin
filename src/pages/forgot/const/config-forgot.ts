export const configForgot = {
  title: 'Admin Solitude',
  innerTitle: 'You forgot your password? Here you can easily retrieve a new password.',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Email',
        },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        {
          typeField: 'button',
          children: 'Request new password',
          type: 'primary',
          size: 'middle',
          block: 'true',
        },
      ],
    },
    {
      className: 'links-container',
      fields: [
        {
          typeField: 'link',
          children: 'Login',
          link: '/login',
        },
        {
          typeField: 'link',
          children: 'Register a new membership',
          link: '/registration',
        },
      ],
    },
  ],
}
