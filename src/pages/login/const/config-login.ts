export const configLogin = {
  title: 'Admin Solitude',
  innerTitle: 'Sign in to start your session',
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
        {
          typeField: 'input',
          size: 'large',
          placeholder: 'Password',
        },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        {
          typeField: 'checkbox',
          children: 'Remember Me',
        },
        {
          typeField: 'button',
          children: 'Sign In',
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
          children: 'I forgot my password',
          link: '/forgot',
        },
        {
          typeField: 'link',
          children: ' Register a new membership',
          link: '/registration',
        },
      ],
    },
  ],
}
