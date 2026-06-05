import { ConfigRegistrationsType } from '../types'

export const configRegistrations: ConfigRegistrationsType = {
  title: 'Admin Solitude',
  innerTitle: 'Регистрация',
  subtitle: '',
  className: '',
  validate: formData => {
    if (!formData.login && !formData.password) {
      return false
    } else {
      return true
    }
  },
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
