export type ConfigLoginType = {
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
          type: string
          status: 'error' | 'warning' | string
        },
        {
          name: string
          typeField: 'input'
          size: 'large'
          placeholder: string
          type: string
          status: 'error' | 'warning' | string
        },
      ]
    },
    {
      className: string
      fields: [
        // {
        //   typeField: 'checkbox'
        //   children: string
        // },
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
      fields: [
        // {
        //   typeField: 'link'
        //   children: string
        //   link: string
        // },
      ]
    },
  ]
}
