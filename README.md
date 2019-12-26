# Projeto Game Phaser Dragon Ball

Author:
Everton Ferreira

## Conteúdo
- [Visão Geral do Projeto](#visão-geral-do-projeto)
  - [Tecnologias](#tecnologias)
  - [Documentação LIB Phaser](#documentação-lib-phaser)
- [Informações Iniciais](#informações-iniciais)
  - [Clonando o Repositório](#clonando-o-repositório)
  - [Instalando as Dependências](#instalando-as-dependências)
- [Rodando o projeto](#rodando-o-projeto)
- [Gerar arquiovos de Produção](#Gerar-arquiovos-de-Produção)

## Visão Geral do Projeto
O principal objetivo e fazer um estudo sobre desenvolvimento de jogos utilizando a biblioteca Phaser js.

### Tecnologias
- HTML5
- CSS
- JavaScript

### Documentação LIB Phaser
A documentação da LIB utilizada está disponível em: [PHASER](https://phaser.io/docs/2.6.2/index).

## Informações Iniciais
Para realizar as passos a seguir, será necessário que tenha instalado em seu computador o **git**, **node.js** e o **grunt**. Abaixo seguem os sites para realizar o download e efetuar a instalação:
- [Git](https://git-scm.com/downloads)
- [Node.js - Windows/Mac](https://nodejs.org/en/download/)
- [Node.js - Linux](https://nodejs.org/en/download/package-manager/)
- [Grunt](https://gruntjs.com/installing-grunt)

### Clonando o Repositório
Primeiro é preciso que efetue a clonagem do repositório para o seu computador para assim efetuar alterações de código.
**clone or download** e copiar a URL do respositório.

Já abrindo o bash do Git para efetuar a clonagem será necessário que digite a seguinte linha de código e informe a URL copiada anteriormente:
git clone <url-do-repositorio>

### Instalando as Dependências
Para instalar as dependências do projeto basta abrir o **Prompt de Comando** (caso você esteja no linux, basta utilizar o terminal), acessar a pasta do repositório e inserir o seguinte comando:
npm install

## Rodando o projeto

Adicione o projeto em algum seridor ex: wamp ou outros

## Gerar arquiovos de Produção

Execute no **Prompt de Comando** (caso você esteja no linux, basta utilizar o terminal) `grunt build` para criar os arquivo minificados do projeto. Os arquivos serão armazenados no diretório `dist /`.