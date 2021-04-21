CREATE DATABASE `data_warehouse`;
USE `data_warehouse`;
-- TABLA USUARIOS CORRECTA PARA DATA WAREHOUSE
CREATE TABLE `users`(
    `user_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` varchar(30) NOT NULL,
    `surname` varchar(30) NOT NULL,
    `mail` varchar(200) NOT NULL UNIQUE,
    `pass` varchar(18) NOT NULL,
    `admin` tinyint(1) NOT NULL,
    `phone` int NOT NULL,
    `active`   tinyint(1) NOT NULL

)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `regions`(
    `region_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `region_name` varchar(30) NOT NULL,
    `active`   tinyint(1) NOT NULL
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `countries`(
    `country_id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `country_name` varchar(30) NOT NULL,
    `region_id` int NOT NULL,
    `active`   tinyint(1) NOT NULL,
    FOREIGN KEY (region_id)  REFERENCES regions(region_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cities`(
    `city_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `city_name` varchar(30) NOT NULL,
    `country_id` INT NOT NULL,
    `active`   tinyint(1) NOT NULL,
    FOREIGN KEY (country_id)  REFERENCES countries(country_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `companies`(
    `company_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `company_name` varchar(30) NOT NULL,
    `company_address` varchar(50) NOT NULL,
    `mail` varchar(30) NOT NULL,
    `phone` int NOT NULL,
    `city_id` int NOT NULL,
    `active`   tinyint(1) NOT NULL,
    FOREIGN KEY (city_id)  REFERENCES cities(city_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `contacts`(
    `contact_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` varchar(30) NOT NULL,
    `surname` varchar(30) NOT NULL,
    `position` varchar(50) NOT NULL,
    `mail` varchar(50) NOT NULL,
    `interest` varchar(100) NOT NULL,
    `company_id` int NOT NULL,
    `city_id` int NOT NULL,
    `user_id` int NOT NULL,
    `active`   tinyint(1) NOT NULL,
    FOREIGN KEY (company_id)  REFERENCES companies(company_id),
    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO users (name, surname, mail, admin, phone, active, pass) VALUES ('admin', 'admin', 'admin@admin.com', 1, 1165478821, 1, 'admin');
INSERT INTO users (name, surname, mail, admin, phone, active, pass) VALUES ('user', 'noAdmin', 'user@live.com', 1, 123123123, 1, 123456);
INSERT INTO regions (region_name,active) VALUES ('Am. del norte',1);
INSERT INTO regions (region_name,active) VALUES ('Am. del sur',1);
INSERT INTO regions (region_name,active) VALUES ('CentroAmerica',1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Argentina',2,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Brasil',2,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Chile',2,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Mexico',1,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Canada',1,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Panama',3,1);
INSERT INTO countries (country_name,region_id,active) VALUES ('Costa Rica',3,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Bs. As.',1,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Cordoba',1,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Sao Paulo',2,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Santiago',3,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Mexico D.F',4,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Alberta',5,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('Panama City',6,1);
INSERT INTO cities (city_name,country_id,active) VALUES ('San Jose',7,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Plus Cargo','Av. Siempre viva 123','plus@cargo.com',1122334455,5,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Del Beagle','De los nires 3038','del@beagle.com',5544336677,1,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Frodas','thames 477','frodas@frodito.com',5544336677,3,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Chandon','chababuco 2637','alcohol@chandon.com',5544336677,5,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('El purgatorio bar','salvador 238','secresSociety@purgatorio.com',5544336677,6,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Aerolab','cramer 278','aero@lab.com',5544336677,2,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('AWE Systems','balbastro1729','AWE@systems.com',5544336677,7,1);
INSERT INTO companies (company_name,company_address,mail,phone,city_id,active) VALUES ('Los Yamanas','el cano 123','reservas@yamanas.com',5544336677,3,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Lucas', 'Barria', 'CEO','lucas.barria@live.com','None',1,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Alberto', 'Rodriguez Saa', 'CEO','jrm@live.com','None',1,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Juan', 'Vazquez', 'Vendedor','vazqjuan@live.com','None',2,1,1,1);


INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Alejo','Del mastro','vendedor','AlejoDel mastro@live.com','telegram',7,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Francisco','Marscarenhas','Abogado','FranciscoMarscarenhas@live.com','telegram',1,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Oliver','Allen','Gerente New verticals','OliverAllen@live.com','whatsapp',7,4,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Federico','Diaz Silvera', 'KAM New verticals','FedericoDiaz Silvera@live.com','whatsapp',4,4,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Francisco','Rampone','Jefe ventas','FranciscoRampone@live.com','whatsapp',1,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Luciano','Seppacuercia','Vendedor','LucianoSeppacuercia@live.com','mail',6,6,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Gonzalo','Arregui','Jefe logistico','GonzaloArregui@live.com','mail',6,4,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Santiago','Gelves','Jefe Administrativo','SantiagoGelves@live.com','whatsapp',6,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Mariela','barrios','vendedora','Marielabarrios@live.com','whatsapp',6,3,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Gonzalo','Vega','Owner','GonzaloVega' 'gonzalovega7@gmail.com','whatsapp',8,2,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Marina','Preto','Profesora','MarinaPreto@live.com','whatsapp',1,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Susana','Dawson','Ceramista','SusanaDawson@live.com','whatsapp',5,3,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Mariana ','Preto','Psicologa','Mariana Preto@live.com','whatsapp',1,2,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Mariano','Preto','Contador','MarianoPreto@live.com','whatsapp',3,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Steffano','grosso','Cobrador','Steffanogrosso@live.com','whatsapp',1,2,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Ricardo ','Martinoglio','Piloto','Ricardo Martinoglio@live.com','whatsapp',4,1,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Agustin','Mallman','Chef','AgustinMallman@live.com','telegram',2,6,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Michael','Jackson','Cantante','MichaelJackson@live.com','telegram',4,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Juan Pedro','Manaos','Director','Juan PedroManaos@live.com','whatsapp',6,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Agustin','Beccar Varela','CEO','AgustinBeccar Varela@live.com','whatsapp',6,2,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Marcos','Maqueda','Periodista','MarcosMaqueda@live.com','whatsapp',5,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Matias','Martin','Periodista','MatiasMartin@live.com','telegram',5,5,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('George','Michael','Cantante','GeorgeMichael@live.com','whatsapp',3,6,1,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Jonas','Gutierrez','Futbolista','JonasGutierrez@live.com','whatsapp',2,5,1,1);



INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('inaki', 'Igarreta', 'CFO','igarro@live.com','None',2,1,2,1);
INSERT INTO contacts (name ,surname ,position ,mail ,interest ,company_id ,city_id ,user_id ,active) VALUES ('Mateo', 'Del Mastro', 'Sales Executive','el.macho@live.com','None',2,1,2,1);


