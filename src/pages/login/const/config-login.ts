import { ConfigLoginType } from '../types'

export const configLogin: ConfigLoginType = {
  title: 'Admin Solitude',
  innerTitle: 'Авторизация',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        {
          name: 'email',
          typeField: 'input',
          size: 'large',
          placeholder: 'Логин',
          type: 'email',
        },
        {
          name: 'password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Пароль',
          type: 'password',
        },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        // {
        //   typeField: 'checkbox',
        //   children: 'Remember Me',
        // },
        {
          typeField: 'link',
          children: 'Зарегистрироваться',
          link: '/registration',
        },
        {
          typeField: 'button',
          children: 'Авторизоваться',
          type: 'primary',
          size: 'large',
        },
      ],
    },
    {
      className: 'links-container',
      fields: [
        // {
        //   typeField: 'link',
        //   children: 'I forgot my password',
        //   link: '/forgot',
        // },
      ],
    },
  ],
}
