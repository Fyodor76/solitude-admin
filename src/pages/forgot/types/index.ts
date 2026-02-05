export type ConfigForgotType = {
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
      ]
    },
    {
      className: string
      fields: [
        {
          typeField: 'button'
          children: string
          type: 'primary'
          size: 'middle'
          block: boolean
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
          typeField: 'link'
          children: string
          link: string
        },
      ]
    },
  ]
}
