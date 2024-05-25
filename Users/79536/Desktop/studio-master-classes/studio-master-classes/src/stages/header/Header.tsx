import logo from "../../assets/logo.png";
import drawingGirl from "../../assets/drawingGirl.png";
import { Button } from "../../ui/Button/Button";

const menu = ["Услуги", "О нас", "Скидки", "Контакты"];

export const Header = () => {
  return (
    <div className="header">
      <div className="logo-container">
        <div>
          <img src={logo} />
        </div>
        <div className="button-container">
          <Button color="dark" size="small" background="secondary">
            Заказать звонок
          </Button>
        </div>
      </div>
      <div className="menu">
        <div className="menu-container">
          {menu.map((item) => (
            <div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="image">
        <img src={drawingGirl} />
      </div>
      <div className="info">
        <div className="info-container">
          <div>
            <h1>Студия творчества для детей и взрослых</h1>
          </div>
          <div>
            <span>
              У нас много направлений и интересных мастер-классов для детей и
              взрослых. Присоединяйтесь! Будет интересно и познавательно
            </span>
          </div>
          <div>
            <Button size="large" background="base" color="basic">
              Записаться
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};