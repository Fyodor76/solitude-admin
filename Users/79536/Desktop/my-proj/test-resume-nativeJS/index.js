import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import ImageModule from 'docxtemplater-image-module-free';
import path from 'path';

// Чтение шаблона .docx
const content = fs.readFileSync('./resume.docx', 'binary');

// Функция для загрузки изображений
function loadImage(imagePath) {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
}

// Пример фотографии (замените 'placeholder.jpg' на путь к вашей фотографии)
const photoPath = path.resolve('./test-photo.jpg');
const photo = loadImage(photoPath);

// Настройки ImageModule
const imageOptions = {
  centered: false,
  getImage: function (tagValue, tagName) {
    return Buffer.from(tagValue, 'base64');
  },
  getSize: function (img, tagValue, tagName) {
    return [150, 150]; // Пример: размеры изображения 150x150 пикселей
  },
};

// Инициализация PizZip и Docxtemplater с модулем для работы с изображениями
const zip = new PizZip(content);
const imageModule = new ImageModule(imageOptions);
const doc = new Docxtemplater(zip, {
  modules: [imageModule],
});

// Пример данных для заполнения, включая фото
const data = {
  firstName: 'John',
  lastName: 'Doe',
  position: 'Software Engineer',
  email: 'john.doe@example.com',
  photo: photo, // Добавляем фото в данные
  experience: [
    {
      company: 'Example Corp',
      jobTitle: 'Frontend Developer',
      startDate: 'January 2020',
      endDate: 'December 2021',
      description: 'Developed and maintained web applications using React and Redux.',
    },
    {
      company: 'Another Company',
      jobTitle: 'Junior Developer',
      startDate: 'June 2018',
      endDate: 'December 2019',
      description: 'Assisted in developing web-based internal tools.',
    },
  ],
};

// Заполнение шаблона данными
doc.setData(data);

try {
  // Рендеринг документа
  doc.render();
} catch (error) {
  console.error('Error rendering document:', error);
}

// Генерация и сохранение нового файла
const buf = doc.getZip().generate({ type: 'nodebuffer' });
fs.writeFileSync('resume_output.docx', buf);

