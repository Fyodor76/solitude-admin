import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload, UploadProps } from 'antd'

interface ImageUploadButtonProps extends UploadProps {
  buttonText?: string
}

export const ImageUploadButton = ({
  buttonText = 'Загрузить',
  children,
  ...props
}: ImageUploadButtonProps) => {
  return (
    <Upload accept="image/*" maxCount={1} {...props}>
      {children || (
        <Button icon={<UploadOutlined />} className="ant-input">
          {buttonText}
        </Button>
      )}
    </Upload>
  )
}
