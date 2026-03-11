import { ConfigRegistrationsType } from '../types'

export const configRegistrations: ConfigRegistrationsType = {
  title: 'Admin Solitude',
  innerTitle: 'Регистрация',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        // {
        //   name: 'name',
        //   typeField: 'input',
        //   size: 'large',
        //   placeholder: 'Full name',
        //   type: 'name',
        // },
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
        // {
        //   name: 'repeat_password',
        //   typeField: 'input',
        //   size: 'large',
        //   placeholder: 'Retype password',
        //   type: 'password',
        // },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        // {
        //   typeField: 'checkbox',
        //   children: 'I agree to the terms',
        // },

        {
          typeField: 'link',
          children: 'У меня есть аккаунт',
          link: '/login',
        },
        {
          typeField: 'button',
          children: 'Зарегистрироваться',
          type: 'primary',
          size: 'large',
        },
      ],
    },
    {
      className: 'links-container',
      fields: [],
    },
  ],
}
