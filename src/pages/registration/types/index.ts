export type ConfigRegistrationsType = {
  title: string
  innerTitle: string
  subtitle: string
  className: string
  validate: (formData: RegistrationType) => boolean
  sections: [
    {
      className: string
      fields: [
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
          type: string
        },
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
          type: string
        },
      ]
    },
    {
      className: string
      fields: [
        {
          typeField: 'link'
          children: string
          link: string
        },
        {
          typeField: 'button'
          children: string
          type: 'primary'
          size: 'large'
        },
      ]
    },
    {
      className: string
      fields: []
    },
  ]
}

export type RegistrationType = {
  login: string
  password: string
}
