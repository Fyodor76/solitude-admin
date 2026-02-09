export type ConfigRegistrationsType = {
  title: string
  innerTitle: string
  subtitle: string
  className: string
  sections: [
    {
      className: string
      fields: [
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
        },
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
        },
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
        },
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
        },
      ]
    },
    {
      className: string
      fields: [
        {
          typeField: 'checkbox'
          children: string
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
      fields: [
        {
          typeField: 'link'
          children: string
          link: string
        },
      ]
    },
  ]
}
