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
          name: 'login',
          typeField: 'input',
          size: 'large',
          placeholder: 'Логин',
          type: 'email',
          status: '',
        },
        {
          name: 'password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Пароль',
          type: 'password',
          status: '',
        },
        {
          name: 'house.name',
          typeField: 'input',
          size: 'large',
          placeholder: 'Название дома',
          type: 'text',
          status: '',
        },
        {
          name: 'people.user.name',
          typeField: 'input',
          size: 'large',
          placeholder: 'Название people',
          type: 'text',
          status: '',
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
