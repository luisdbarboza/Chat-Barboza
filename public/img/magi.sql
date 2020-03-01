-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema magi
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema magi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `magi` DEFAULT CHARACTER SET latin1 ;
USE `magi` ;

-- -----------------------------------------------------
-- Table `magi`.`pisos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`pisos` (
  `idPisos` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idPisos`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`salones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`salones` (
  `idSalones` INT(11) NOT NULL AUTO_INCREMENT,
  `idPisos` INT(11) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idSalones`),
  INDEX `idPisos` (`idPisos` ASC),
  CONSTRAINT `salones_ibfk_1`
    FOREIGN KEY (`idPisos`)
    REFERENCES `magi`.`pisos` (`idPisos`))
ENGINE = InnoDB
AUTO_INCREMENT = 29
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`status` (
  `idStatus` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idStatus`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`tiposmaquina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`tiposmaquina` (
  `idTipoMaquina` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idTipoMaquina`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`maquinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`maquinas` (
  `idMaquinas` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(10) NOT NULL,
  `idSocket` VARCHAR(20) NULL DEFAULT NULL,
  `idSalon` INT(11) NOT NULL,
  `idStatus` INT(11) NOT NULL,
  `idTipoMaquina` INT(11) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idMaquinas`),
  INDEX `idSalon` (`idSalon` ASC),
  INDEX `idStatus` (`idStatus` ASC),
  INDEX `idTipoMaquina` (`idTipoMaquina` ASC),
  CONSTRAINT `maquinas_ibfk_1`
    FOREIGN KEY (`idSalon`)
    REFERENCES `magi`.`salones` (`idSalones`),
  CONSTRAINT `maquinas_ibfk_2`
    FOREIGN KEY (`idStatus`)
    REFERENCES `magi`.`status` (`idStatus`),
  CONSTRAINT `maquinas_ibfk_3`
    FOREIGN KEY (`idTipoMaquina`)
    REFERENCES `magi`.`tiposmaquina` (`idTipoMaquina`))
ENGINE = InnoDB
AUTO_INCREMENT = 50
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`datosmaquinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`datosmaquinas` (
  `idDatosMaquinas` INT(11) NOT NULL AUTO_INCREMENT,
  `Procesador` VARCHAR(50) NOT NULL,
  `RAM` VARCHAR(50) NOT NULL,
  `TarjetaGrafica` VARCHAR(50) NOT NULL,
  `MAC` VARCHAR(50) NOT NULL,
  `idMaquinas` INT(11) NOT NULL,
  PRIMARY KEY (`idDatosMaquinas`, `idMaquinas`),
  INDEX `idMaquinas` (`idMaquinas` ASC),
  CONSTRAINT `fk_datosmaquinas_maquinas1`
    FOREIGN KEY (`idMaquinas`)
    REFERENCES `magi`.`maquinas` (`idMaquinas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `magi`.`tipoestudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`tipoestudiante` (
  `idTipoEstudiantes` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `isActive` INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idTipoEstudiantes`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `magi`.`estudiantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`estudiantes` (
  `idEstudiantes` INT(11) NOT NULL AUTO_INCREMENT,
  `cedula` INT(11) NOT NULL,
  `tipoestudiante` INT(11) NOT NULL,
  `isActive` INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idEstudiantes`),
  INDEX `tipoestudiante` (`tipoestudiante` ASC),
  CONSTRAINT `estudiantes_ibfk_1`
    FOREIGN KEY (`tipoestudiante`)
    REFERENCES `magi`.`tipoestudiante` (`idTipoEstudiantes`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `magi`.`tipousuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`tipousuario` (
  `idTipoUsuario` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoUsuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `magi`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `magi`.`usuarios` (
  `idUsuarios` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `password` VARCHAR(150) NOT NULL,
  `idTipoUsuario` INT(11) NOT NULL,
  `isActive` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`idUsuarios`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
